<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tea_houses', function (Blueprint $table) {
            // Drop the old FK
            $table->dropForeign(['route_days_id']);
            $table->dropColumn('route_days_id');

            $table->foreignId('trekking_route_id')
                  ->nullable()
                  ->after('id')
                  ->constrained()
                  ->nullOnDelete();

            $table->foreignId('region_id')
                  ->nullable()
                  ->after('trekking_route_id')
                  ->constrained()
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tea_houses', function (Blueprint $table) {
            $table->dropForeign(['trekking_route_id']);
            $table->dropColumn('trekking_route_id');
            $table->dropForeign(['region_id']);
            $table->dropColumn('region_id');

            // Restore original column
            $table->foreignId('route_days_id')->constrained('route_days')->cascadeOnDelete();
        });
    }
};
