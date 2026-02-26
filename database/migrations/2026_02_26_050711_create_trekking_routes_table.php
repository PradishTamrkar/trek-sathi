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
        Schema::create('trekking_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->string('Trekking_route_name');
            $table->enum('difficulty',['easy','moderate','hard','hellmode']);
            $table->integer('duration_days');
            $table->integer('max_altitude');
            $table->string('best_session');
            $table->boolean('permit_required')->default(false);
            $table->text('trekking_description')->nullable();
            $table->string('trekking_images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trekking_routes');
    }
};
