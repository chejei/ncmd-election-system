<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            // Remove voters_number
            $table->dropColumn('voters_number');

            // Add pin_code (hashed like password)
            $table->string('pin_code'); 
        });
    }

    public function down(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            // Rollback: add voters_number back and remove pin_code
            $table->string('voters_number')->unique();
            $table->dropColumn('pin_code');
        });
    }
};
