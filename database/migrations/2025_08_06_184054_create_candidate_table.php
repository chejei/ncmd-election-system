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
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('suffix_name');
            
            $table->text('ministry_involvement')->nullable();
            $table->integer('age');
            $table->string('grade_year');
            $table->string('course_strand');
            $table->string('school');

            $table->foreignId('church_id')->constrained();
            $table->foreignId('position_id')->constrained()->onDelete('cascade');
            
            $table->longText('photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
