<?php

namespace App\AI\VectorStore;

use App\AI\Providers\GeminiEmbeddingProvider;
use App\Models\Embedding;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * MySQL-backed vector store.
 *
 * Stores 768-dim embeddings as JSON.  Similarity search loads vectors into PHP
 * and computes cosine similarity — fast enough for KB sizes under ~50 000 rows.
 * For larger corpora, swap the search() method for pgvector or Qdrant.
 */
final class MySQLVectorStore
{
    public function __construct(
        private readonly GeminiEmbeddingProvider $embedder
    ) {}

    // ── Write ─────────────────────────────────────────────────────────────────

    /**
     * Upsert a single document chunk.
     * Skips if an identical chunk (same hash) already exists.
     *
     * @param  array<string, mixed>  $metadata
     */
    public function addDocument(
        string $sourceType,
        int    $sourceId,
        string $content,
        array  $metadata = []
    ): void {
        $hash = hash('sha256', $content);

        // Skip if already indexed
        if (Embedding::where('chunk_hash', $hash)->exists()) {
            return;
        }

        $vector = $this->embedder->embedText($content);

        Embedding::create([
            'source_type' => $sourceType,
            'source_id'   => $sourceId,
            'content'     => $content,
            'embedding'   => $vector,
            'metadata'    => $metadata,
            'chunk_hash'  => $hash,
        ]);
    }

    /**
     * Batch-upsert multiple document chunks using the Gemini batch endpoint.
     *
     * @param  array<array{source_type: string, source_id: int, content: string, metadata: array}>  $docs
     */
    public function addDocumentBatch(array $docs): void
    {
        // Filter out already-indexed chunks
        $pending = array_filter($docs, function (array $doc) {
            $hash = hash('sha256', $doc['content']);
            return !Embedding::where('chunk_hash', $hash)->exists();
        });

        if (empty($pending)) {
            return;
        }

        $pending = array_values($pending);
        $texts   = array_column($pending, 'content');
        $vectors = $this->embedder->embedBatch($texts);

        foreach ($pending as $i => $doc) {
            Embedding::create([
                'source_type' => $doc['source_type'],
                'source_id'   => $doc['source_id'],
                'content'     => $doc['content'],
                'embedding'   => $vectors[$i] ?? array_fill(0, 768, 0.0),
                'metadata'    => $doc['metadata'] ?? [],
                'chunk_hash'  => hash('sha256', $doc['content']),
            ]);
        }
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    /**
     * Find the top-k most relevant chunks for a query.
     *
     * @return array<array{content: string, metadata: array, score: float}>
     */
    public function similaritySearch(string $query, int $k = 5): array
    {
        $queryVector = $this->embedder->embedQuery($query);

        if (array_sum(array_map('abs', $queryVector)) === 0.0) {
            Log::warning('[VectorStore] Zero query vector — embedding may have failed.');
            return [];
        }

        // Load all rows.  For large deployments stream this in pages.
        $rows = Embedding::select('id', 'content', 'embedding', 'metadata')->get();

        $scored = $rows
            ->map(function (Embedding $row) use ($queryVector): array {
                $docVector = is_array($row->embedding)
                    ? $row->embedding
                    : json_decode($row->embedding, true);

                return [
                    'content'  => $row->content,
                    'metadata' => $row->metadata ?? [],
                    'score'    => $this->cosine($queryVector, $docVector),
                ];
            })
            ->sortByDesc('score')
            ->take($k)
            ->values()
            ->all();

        return $scored;
    }

    // ── Housekeeping ──────────────────────────────────────────────────────────

    /** Remove all embeddings for a given source row. */
    public function deleteBySource(string $sourceType, int $sourceId): int
    {
        return Embedding::where('source_type', $sourceType)
            ->where('source_id', $sourceId)
            ->delete();
    }

    // ── Math ──────────────────────────────────────────────────────────────────

    /**
     * Cosine similarity between two equal-length float vectors.
     * Returns value in [-1, 1]; higher = more similar.
     */
    private function cosine(array $a, array $b): float
    {
        $dot = 0.0;
        $na  = 0.0;
        $nb  = 0.0;

        $len = min(count($a), count($b));

        for ($i = 0; $i < $len; $i++) {
            $dot += $a[$i] * $b[$i];
            $na  += $a[$i] ** 2;
            $nb  += $b[$i] ** 2;
        }

        $denom = sqrt($na) * sqrt($nb);

        return $denom > 0 ? $dot / $denom : 0.0;
    }
}
