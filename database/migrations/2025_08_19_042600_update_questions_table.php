<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Drop the old column
            $table->dropColumn('question');

            // Add the new column
            $table->string('question_text')->after('id');

            // Add enable column right after question_text
            $table->boolean('enable')->default(true)->after('question_text');
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Rollback: remove new fields and add back old
            $table->dropColumn(['question_text', 'enable']);
            $table->string('question');
        });
    }
};

