<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Make registration_num unique
        $indexes = collect(DB::select("SHOW INDEX FROM voters"))
            ->pluck('Key_name');

        if (!$indexes->contains('voters_registration_num_unique')) {
            Schema::table('voters', function (Blueprint $table) {
                $table->unique('registration_num');
            });
        }
    }

    public function down(): void
    {
        // Remove the unique constraint
        $indexes = collect(DB::select("SHOW INDEX FROM voters"))
            ->pluck('Key_name');

        if ($indexes->contains('voters_registration_num_unique')) {
            Schema::table('voters', function (Blueprint $table) {
                $table->dropUnique('voters_registration_num_unique');
            });
        }
    }
};
