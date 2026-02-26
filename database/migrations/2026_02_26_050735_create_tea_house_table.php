<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tea_house', function (Blueprint $table) {
            $table->id();
            $table->foreignId('route_days_id')->constrained()->cascadeOnDelete();
            $table->string('house_name');
            $table->string('location')->nullable();
            $table->integer('altitude_location')->nullable();
            $table->decimal('cost_per_night',8,2)->nullable();
            $table->boolean('has_electricity')->default(false);
            $table->boolean('has_wifi')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tea_house');
    }
};
