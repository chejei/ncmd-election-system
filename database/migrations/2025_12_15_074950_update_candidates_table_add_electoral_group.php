<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
      public function up(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            // Remove political_color
            if (Schema::hasColumn('candidates', 'political_color')) {
                $table->dropColumn('political_color');
            }

            // Add electoral_group_id
            $table->foreignId('electoral_group_id')
                  ->nullable()
                  ->after('position_id')
                  ->constrained('electoral_groups')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            // Re-add political_color
            $table->string('political_color', 20)->nullable();

            // Drop foreign key & column
            $table->dropForeign(['electoral_group_id']);
            $table->dropColumn('electoral_group_id');
        });
    }
};
