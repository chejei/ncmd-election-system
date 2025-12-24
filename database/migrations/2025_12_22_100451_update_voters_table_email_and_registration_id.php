<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            // 1. Make email nullable (remove unique if exists)
            $table->string('email')->nullable()->change();

            // 2. Add registration_num column (nullable)
            if (!Schema::hasColumn('voters', 'registration_num')) {
                $table->string('registration_num')->nullable()->after('email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            // Remove registration_num column
            if (Schema::hasColumn('voters', 'registration_num')) {
                $table->dropColumn('registration_num');
            }
        });
    }
};
