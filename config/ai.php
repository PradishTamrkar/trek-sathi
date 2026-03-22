<?php

/*
* RAG pipeline configuration.
* Add this file to your config/ directory and clear the config cache.
*/

return [
    /*
    * chunk_size — target character length per chunk (~250 tokens at 4 chars/token)
    * chunk_overlap — overlap between consecutive chunks (preserves boundary context)
    */
    'chunk_size' => env('AI_CHUNK_SIZE', 1000),
    'chunk_overlap' => env('AI_CHUNK_OVERLAP', 200),

    /*
    * top_k — number of KB chunks to retrieve per query
    * min_score — minimum cosine similarity to include a chunk (0–1)
    */
    'top_k' => env('AI_TOP_K', 5),
    'min_score' => env('AI_MIN_SCORE', 0.60),

    /*
    * model — Gemini model to use for chat completions
    * temperature — 0 = deterministic, 1 = creative
    * max_tokens — maximum response length
    */
    'model' => env('AI_MODEL', 'gemini-1.5-flash'),
    'temperature' => env('AI_TEMPERATURE', 0.7),
    'max_tokens' => env('AI_MAX_TOKENS', 2048),

];
