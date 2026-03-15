<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('chat_histories');

        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title')->default('New Chat'); // auto-set from first message
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_sessions');
    }
};
