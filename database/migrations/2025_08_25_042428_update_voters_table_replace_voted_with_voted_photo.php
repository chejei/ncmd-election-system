<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            // Remove the old voted field
            if (Schema::hasColumn('voters', 'voted')) {
                $table->dropColumn('voted');
            }

            // Add new voted_photo field
            $table->string('voted_photo')->nullable()->after('church_id'); 
        });
    }

    public function down(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            // Rollback: remove photo and add voted back
            if (Schema::hasColumn('voters', 'voted_photo')) {
                $table->dropColumn('voted_photo');
            }
            $table->boolean('voted')->default(false)->after('church_id');
        });
    }
};

