<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('churches', function (Blueprint $table) {
            $table->string('senior_ptr')->nullable()->change();
            $table->string('address')->nullable()->change();
            $table->string('zone')->nullable()->change();
            $table->integer('circuit', false, true)->nullable()->change(); // unsigned int, nullable
        });
    }

    public function down(): void
    {
        Schema::table('churches', function (Blueprint $table) {
            $table->string('senior_ptr')->nullable(false)->change();
            $table->string('address')->nullable(false)->change();
            $table->string('zone')->nullable(false)->change();
            $table->integer('circuit')->nullable(false)->change();
        });
    }
};

