<?php

namespace App\AI;

use App\AI\Providers\GeminiEmbeddingProvider;
use App\AI\VectorStore\MySQLVectorStore;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * TrekSathi RAG Agent
 *
 * Orchestrates the full retrieval-augmented generation pipeline:
 *   1. Embed the user query
 *   2. Retrieve top-k relevant KB chunks
 *   3. Build a grounded system prompt
 *   4. Stream the Gemini 1.5 Flash response token-by-token via SSE
 *
 * We call the Gemini REST API directly so streaming works without any
 * third-party SDK quirks.  NeuronAI's VectorStore interface is satisfied
 * by MySQLVectorStore.
 */
final class TrekSathiAgent
{
    private const GEMINI_STREAM_URL =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent';

    private const GEMINI_URL =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    private Client $http;

    public function __construct(
        private readonly GeminiEmbeddingProvider $embedder,
        private readonly MySQLVectorStore        $vectorStore,
        private readonly string                  $geminiKey
    ) {
        $this->http = new Client(['timeout' => 120, 'stream' => true]);
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Stream a response via Server-Sent Events.
     *
     * @param  string              $userMessage
     * @param  ChatSession         $session
     * @param  callable            $onChunk      fn(string $text): void
     * @param  callable|null       $onDone       fn(string $fullResponse): void
     */
    public function streamResponse(
        string      $userMessage,
        ChatSession $session,
        callable    $onChunk,
        ?callable   $onDone = null
    ): void {
        // 1. Retrieve relevant context
        $context = $this->retrieveContext($userMessage);

        // 2. Build conversation history
        $history = $this->buildHistory($session, $userMessage);

        // 3. Build Gemini request
        $payload = $this->buildPayload($history, $context);

        // 4. Stream & collect
        $fullResponse = '';

        try {
            $response = $this->http->post(
                self::GEMINI_STREAM_URL . '?key=' . $this->geminiKey . '&alt=sse',
                ['json' => $payload]
            );

            $body = $response->getBody();

            while (!$body->eof()) {
                $line = trim($body->read(4096));

                foreach (explode("\n", $line) as $raw) {
                    $raw = trim($raw);

                    if (!str_starts_with($raw, 'data:')) {
                        continue;
                    }

                    $json = trim(substr($raw, 5));

                    if ($json === '[DONE]') {
                        break 2;
                    }

                    $decoded = json_decode($json, true);
                    $chunk   = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? '';

                    if ($chunk !== '') {
                        $fullResponse .= $chunk;
                        $onChunk($chunk);
                    }
                }
            }
        } catch (GuzzleException $e) {
            Log::error('[TrekSathiAgent] Stream error', ['error' => $e->getMessage()]);
            $errMsg = 'Sorry, I ran into an issue. Please try again.';
            $onChunk($errMsg);
            $fullResponse = $errMsg;
        }

        if ($onDone) {
            $onDone($fullResponse);
        }
    }

    /**
     * Non-streaming response (used for title generation, tests).
     */
    public function respond(string $prompt): string
    {
        try {
            $response = $this->http->post(
                self::GEMINI_URL . '?key=' . $this->geminiKey,
                [
                    'json' => [
                        'contents'         => [['role' => 'user', 'parts' => [['text' => $prompt]]]],
                        'generationConfig' => ['maxOutputTokens' => 256, 'temperature' => 0.3],
                    ],
                ]
            );

            $body = json_decode((string) $response->getBody(), true);
            return $body['candidates'][0]['content']['parts'][0]['text'] ?? '';
        } catch (GuzzleException $e) {
            Log::error('[TrekSathiAgent] respond failed', ['error' => $e->getMessage()]);
            return '';
        }
    }

    // ── Pipeline steps ────────────────────────────────────────────────────────

    /** Step 1 — Retrieve top-5 KB chunks relevant to the query */
    private function retrieveContext(string $query): string
    {
        $chunks = $this->vectorStore->similaritySearch($query, k: 5);

        if (empty($chunks)) {
            return '';
        }

        $parts = [];

        foreach ($chunks as $i => $chunk) {
            $meta  = $chunk['metadata'];
            $label = isset($meta['title']) ? "Source: {$meta['title']}" : "Source #" . ($i + 1);

            if (!empty($meta['category'])) {
                $label .= " [{$meta['category']}]";
            }

            $parts[] = "---\n{$label}\n{$chunk['content']}";
        }

        return implode("\n\n", $parts);
    }

    /** Step 2 — Load last-N messages from the session */
    private function buildHistory(ChatSession $session, string $userMessage): array
    {
        $past = $session->messages()
            ->latest()
            ->take(12)          // keep 12-turn window to manage token budget
            ->get()
            ->reverse()
            ->values();

        $history = [];

        foreach ($past as $msg) {
            $history[] = [
                'role'  => $msg->role === 'user' ? 'user' : 'model',
                'parts' => [['text' => $msg->content]],
            ];
        }

        // Append the new user message
        $history[] = [
            'role'  => 'user',
            'parts' => [['text' => $userMessage]],
        ];

        return $history;
    }

    /** Step 3 — Build the full Gemini API payload with system prompt + context */
    private function buildPayload(array $history, string $context): array
    {
        $systemInstruction = $this->buildSystemPrompt($context);

        return [
            'system_instruction' => [
                'parts' => [['text' => $systemInstruction]],
            ],
            'contents'           => $history,
            'generationConfig'   => [
                'temperature'     => 0.7,
                'maxOutputTokens' => 2048,
                'topP'            => 0.95,
            ],
            'safetySettings'     => [
                ['category' => 'HARM_CATEGORY_HARASSMENT',        'threshold' => 'BLOCK_ONLY_HIGH'],
                ['category' => 'HARM_CATEGORY_HATE_SPEECH',       'threshold' => 'BLOCK_ONLY_HIGH'],
                ['category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold' => 'BLOCK_ONLY_HIGH'],
                ['category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold' => 'BLOCK_ONLY_HIGH'],
            ],
        ];
    }

    private function buildSystemPrompt(string $context): string
    {
        $contextBlock = $context
            ? "KNOWLEDGE BASE CONTEXT (use this to answer accurately):\n\n{$context}\n\n---"
            : "No specific knowledge base context was retrieved for this query.";

        return <<<PROMPT
You are TrekSathi, an expert AI trekking guide specialising in Nepal's mountain trails.
You have deep knowledge of Himalayan treks, permits, tea houses, altitude, gear, and safety.

PERSONA
- Warm, encouraging, and safety-conscious.
- Respond in the same language the user is writing in.
- Use markdown (bold, bullet lists, tables) for readability when helpful.
- Always include safety notes for altitude-related questions.

ANSWERING RULES
1. Prioritise the KNOWLEDGE BASE CONTEXT below when it is relevant.
2. If the context doesn't fully answer the question, use your general Nepal trekking knowledge.
3. Be honest when you're uncertain — suggest the user verify with official Nepal Tourism Board sources.
4. Never make up permit prices, distances, or altitudes. Say "verify current prices" instead.
5. For medical/health emergencies, always recommend consulting a doctor and descending immediately.

{$contextBlock}

Always end itinerary responses with a brief reminder about travel insurance and acclimatisation days.
PROMPT;
    }

    // ── Session title ─────────────────────────────────────────────────────────

    /**
     * Generate a short, descriptive title for a new chat session
     * based on the user's first message.
     */
    public function generateTitle(string $firstMessage): string
    {
        $title = $this->respond(
            "Generate a short 4-6 word title for a trekking chat that started with: \"{$firstMessage}\". " .
            "Return ONLY the title, no quotes, no punctuation at the end."
        );

        return $title ?: Str::limit($firstMessage, 50);
    }
}
