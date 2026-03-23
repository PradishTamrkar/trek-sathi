<?php

namespace App\AI\Providers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

final class GeminiEmbeddingProvider
{
    private const ENDPOINT  = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';
    private const BATCH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents';
    private const DIMS      = 3072;
    private Client $http;

    public function __construct(private readonly string $apiKey)
    {
        $this->http = new Client(['timeout' => 30]);
    }

    /**
     * Embed a single piece of text.
     *
     * @return float[]  768-dimensional vector
     */
    public function embedText(string $text): array
    {
        $text = $this->sanitise($text);

        try {
            $response = $this->http->post(self::ENDPOINT . '?key=' . $this->apiKey, [
                'json' => [
                    'model'   => 'models/text-embedding-001',
                    'content' => [
                        'parts' => [['text' => $text]],
                    ],
                    'taskType' => 'RETRIEVAL_DOCUMENT',
                ],
            ]);

            $body = json_decode((string) $response->getBody(), true);

            return $body['embedding']['values'] ?? array_fill(0, self::DIMS, 0.0);
        } catch (GuzzleException $e) {
            Log::error('[GeminiEmbed] embedText failed', ['error' => $e->getMessage()]);
            return array_fill(0, self::DIMS, 0.0);
        }
    }

    /**
     * Embed a user query (different taskType for better retrieval quality).
     *
     * @return float[]
     */
    public function embedQuery(string $query): array
    {
        $query = $this->sanitise($query);

        try {
            $response = $this->http->post(self::ENDPOINT . '?key=' . $this->apiKey, [
                'json' => [
                    'model'   => 'models/text-embedding-001',
                    'content' => [
                        'parts' => [['text' => $query]],
                    ],
                    'taskType' => 'RETRIEVAL_QUERY',
                ],
            ]);

            $body = json_decode((string) $response->getBody(), true);

            return $body['embedding']['values'] ?? array_fill(0, self::DIMS, 0.0);
        } catch (GuzzleException $e) {
            Log::error('[GeminiEmbed] embedQuery failed', ['error' => $e->getMessage()]);
            return array_fill(0, self::DIMS, 0.0);
        }
    }

    /**
     * Batch-embed up to 100 texts in a single API call.
     *
     * @param  string[]  $texts
     * @return float[][]
     */
    public function embedBatch(array $texts): array
    {
        if (empty($texts)) {
            return [];
        }

        $requests = array_map(fn (string $t) => [
            'model'   => 'models/text-embedding-001',
            'content' => ['parts' => [['text' => $this->sanitise($t)]]],
            'taskType' => 'RETRIEVAL_DOCUMENT',
        ], $texts);

        try {
            $response = $this->http->post(self::BATCH_URL . '?key=' . $this->apiKey, [
                'json' => ['requests' => $requests],
            ]);

            $body = json_decode((string) $response->getBody(), true);

            return array_column(
                array_map(fn ($e) => $e['values'] ?? array_fill(0, self::DIMS, 0.0),
                    $body['embeddings'] ?? []),
                null
            );
        } catch (GuzzleException $e) {
            Log::error('[GeminiEmbed] embedBatch failed', ['error' => $e->getMessage()]);
            return array_fill(0, count($texts), array_fill(0, self::DIMS, 0.0));
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function sanitise(string $text): string
    {
        // Gemini embedding limit: ~2048 tokens ≈ ~8 000 chars — truncate safely
        return mb_substr(trim($text), 0, 8000);
    }
}
