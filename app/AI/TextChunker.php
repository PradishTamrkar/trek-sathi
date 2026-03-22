<?php

namespace App\AI;

/**
 * Splits text into overlapping chunks for embedding.
 *
 * Uses a character-level sliding window with a clean sentence boundary.
 * Overlap ensures no context is lost at chunk edges.
 */
final class TextChunker
{
    public function __construct(
        private readonly int $chunkSize    = 1000,   // ~250 tokens
        private readonly int $chunkOverlap = 200
    ) {}

    /**
     * @return string[]  One or more chunks
     */
    public function split(string $text): array
    {
        $text = $this->normalise($text);

        if (mb_strlen($text) <= $this->chunkSize) {
            return [$text];
        }

        $chunks = [];
        $start  = 0;
        $length = mb_strlen($text);

        while ($start < $length) {
            $end = $start + $this->chunkSize;

            if ($end >= $length) {
                $chunks[] = mb_substr($text, $start);
                break;
            }

            // Walk back to the nearest sentence end so we don't cut mid-sentence
            $boundary = $this->findSentenceBoundary($text, $end);
            $chunks[] = mb_substr($text, $start, $boundary - $start);

            // Advance with overlap
            $start = $boundary - $this->chunkOverlap;
            if ($start < 0) {
                $start = 0;
            }
        }

        return array_values(array_filter($chunks, fn ($c) => mb_strlen(trim($c)) > 20));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function normalise(string $text): string
    {
        // Collapse multiple blank lines / excess whitespace
        $text = preg_replace('/\n{3,}/', "\n\n", $text);
        $text = preg_replace('/ {2,}/', ' ', $text);
        return trim($text);
    }

    private function findSentenceBoundary(string $text, int $end): int
    {
        // Look up to 200 chars back for a '. ', '? ', '! ', or '\n'
        $lookback = max(0, $end - 200);
        $segment  = mb_substr($text, $lookback, $end - $lookback);

        // Try sentence-ending punctuation followed by whitespace
        $pos = mb_strrpos($segment, '. ');
        if ($pos !== false) {
            return $lookback + $pos + 2;
        }

        $pos = mb_strrpos($segment, "\n");
        if ($pos !== false) {
            return $lookback + $pos + 1;
        }

        // Fall back to the original end position
        return $end;
    }
}
