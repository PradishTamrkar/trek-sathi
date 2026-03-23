<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\AI\Providers\GeminiEmbeddingProvider;
use App\AI\TextChunker;
use App\AI\TrekSathiAgent;
use App\AI\VectorStore\MySQLVectorStore;

class AIServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //Gemini Embedding - we will reuse HTTP client
        $this->app->singleton(GeminiEmbeddingProvider::class, function(){
            return new GeminiEmbeddingProvider(config('services.gemini.key'));
        });

        //vector store
        $this->app->singleton(MySQLVectorStore::class, function($app){
            return new MySQLVectorStore($app->make(GeminiEmbeddingProvider::class));
        });

        //Text chunker
        $this->app->singleton(TextChunker::class, function(){
            return new TextChunker(
                chunkSize:(int)config('ai.chunk_size',1000),
                chunkOverlap:(int)config('ai.chunk_overlap',200)
            );
        });

        //Main agent
        $this->app->singleton(TrekSathiAgent::class, function($app){
            return new TrekSathiAgent(
                vectorStore:$app->make(MySQLVectorStore::class),
            );
        });
    }
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
