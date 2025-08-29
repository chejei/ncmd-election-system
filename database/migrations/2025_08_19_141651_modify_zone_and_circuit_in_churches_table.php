<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('churches', function (Blueprint $table) {
            $table->integer('zone')->nullable()->change();
            $table->integer('circuit')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('churches', function (Blueprint $table) {
            $table->string('zone')->nullable()->change();
            $table->string('circuit')->nullable()->change();
        });
    }
};
