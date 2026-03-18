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
        Schema::table('tea_houses', function (Blueprint $table) {
            $table->string('tea_house_images')->after('has_wifi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tea_house', function (Blueprint $table) {
            $table->dropColumn('tea_house_images');
        });
    }
};
