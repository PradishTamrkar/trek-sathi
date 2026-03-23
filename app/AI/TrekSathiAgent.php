<?php

namespace App\AI;

use App\Models\ChatSession;
use App\AI\VectorStore\MySQLVectorStore;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class TrekSathiAgent
{
    const GROQ_URL        = 'https://api.groq.com/openai/v1/chat/completions';
    const CHAT_MODEL      = 'llama-3.3-70b-versatile';
    const TITLE_MODEL     = 'llama-3.1-8b-instant'; // faster/cheaper for titles
    const MAX_HISTORY     = 12;

    private Client $client;
    private MySQLVectorStore $vectorStore;
    private string $apiKey;

    public function __construct(MySQLVectorStore $vectorStore)
    {
        $this->vectorStore = $vectorStore;
        $this->apiKey      = config('services.groq.key');
        $this->client      = new Client(['timeout' => 60]);
    }

    /**
     * Stream a response to the user, calling $onChunk for each text delta
     * and $onDone when the stream is complete.
     */
    public function streamResponse(
        string $userMessage,
        ChatSession $session,
        callable $onChunk,
        callable $onDone
    ): void {
        try {
            // 1. Retrieve relevant context from vector store
            $context = $this->retrieveContext($userMessage);

            // 2. Build message array
            $messages = $this->buildMessages($userMessage, $session, $context);

            // 3. Stream from Groq
            $response = $this->client->post(self::GROQ_URL, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'model'       => self::CHAT_MODEL,
                    'messages'    => $messages,
                    'stream'      => true,
                    'temperature' => config('ai.temperature', 0.7),
                    'max_tokens'  => config('ai.max_tokens', 1024),
                ],
                'stream' => true,
            ]);

            $body        = $response->getBody();
            $fullText    = '';
            $buffer      = '';

            while (!$body->eof()) {
                $buffer .= $body->read(1024);

                // Process complete lines from the buffer
                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line   = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);
                    $line   = trim($line);

                    if ($line === '' || $line === 'data: [DONE]') {
                        continue;
                    }

                    if (str_starts_with($line, 'data: ')) {
                        $json = substr($line, 6);
                        $data = json_decode($json, true);

                        $delta = $data['choices'][0]['delta']['content'] ?? null;
                        if ($delta !== null) {
                            $fullText .= $delta;
                            $onChunk($delta);
                        }
                    }
                }
            }

            $onDone($fullText);

        } catch (RequestException $e) {
            Log::error('[TrekSathiAgent] Stream error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Generate a short title for a new chat session.
     */
    public function generateTitle(string $firstMessage): ?string
    {
        try {
            $response = $this->client->post(self::GROQ_URL, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'model'      => self::TITLE_MODEL,
                    'messages'   => [
                        [
                            'role'    => 'system',
                            'content' => 'Generate a concise 4-6 word title for a trekking chat based on the user\'s first message. Return only the title, no punctuation, no quotes.',
                        ],
                        [
                            'role'    => 'user',
                            'content' => $firstMessage,
                        ],
                    ],
                    'max_tokens'  => 20,
                    'temperature' => 0.3,
                ],
            ]);

            $data  = json_decode($response->getBody()->getContents(), true);
            $title = trim($data['choices'][0]['message']['content'] ?? '');

            return $title ?: null;

        } catch (\Exception $e) {
            Log::warning('[TrekSathiAgent] Title generation failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private function retrieveContext(string $query): string
    {
        try {
            $results = $this->vectorStore->similaritySearch($query, config('ai.top_k', 5));

            if (empty($results)) {
                return '';
            }

            $parts = [];
            foreach ($results as $result) {
                $parts[] = $result['content'];
            }

            return implode("\n\n---\n\n", $parts);

        } catch (\Exception $e) {
            Log::warning('[TrekSathiAgent] Context retrieval failed', ['error' => $e->getMessage()]);
            return '';
        }
    }

    private function buildMessages(string $userMessage, ChatSession $session, string $context): array
    {
        $systemPrompt = $this->buildSystemPrompt($context);

        $messages = [['role' => 'system', 'content' => $systemPrompt]];

        // Add recent chat history
        $history = $session->messages()
            ->orderBy('created_at', 'desc')
            ->limit(self::MAX_HISTORY)
            ->get()
            ->reverse();

        foreach ($history as $msg) {
            $messages[] = [
                'role'    => $msg->role === 'user' ? 'user' : 'assistant',
                'content' => $msg->content,
            ];
        }

        // Add current user message
        $messages[] = ['role' => 'user', 'content' => $userMessage];

        return $messages;
    }

    private function buildSystemPrompt(string $context): string
    {
        $base = <<<PROMPT
You are Trek-Sathi, an expert AI trekking companion for Nepal. You help trekkers plan their journeys, understand routes, find tea houses, check difficulty levels, and stay safe in the mountains.

You are knowledgeable about:
- Popular trekking routes (Everest Base Camp, Annapurna Circuit, Langtang, etc.)
- Tea houses and accommodation along routes
- Altitude sickness prevention and acclimatization
- Permits (TIMS, ACAP, SAGARMATHA, etc.)
- Best trekking seasons
- Gear and packing advice
- Local culture and etiquette

Always be encouraging, practical, and safety-conscious. If you don't know something specific, say so honestly.
PROMPT;

        if (!empty($context)) {
            $base .= "\n\n## Relevant information from Trek-Sathi knowledge base:\n\n" . $context;
            $base .= "\n\nUse the above information to give accurate, specific answers about these routes and locations.";
        }

        return $base;
    }
}
