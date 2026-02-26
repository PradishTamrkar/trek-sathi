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
        Schema::create('route_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trekking_route_id')->constrained()->cascadeOnDelete();
            $table->integer('day_number');
            $table->string('start_point');
            $table->string('end_point');
            $table->integer('Distance_in_km');
            $table->integer('altitude');
            $table->text('days_description')-> nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('route_days');
    }
};
