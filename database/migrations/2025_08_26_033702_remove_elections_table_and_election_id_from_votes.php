<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Drop the election_id column in votes table
        Schema::table('votes', function (Blueprint $table) {
            if (Schema::hasColumn('votes', 'election_id')) {
                $table->dropForeign(['election_id']); // if foreign key exists
                $table->dropColumn('election_id');
            }
        });

        // Drop elections table
        Schema::dropIfExists('elections');
    }

    public function down(): void
    {
        // Recreate elections table if rollback
        Schema::create('elections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('photo')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('upcoming');
            $table->timestamps();
        });

        // Add back election_id in votes
        Schema::table('votes', function (Blueprint $table) {
            $table->unsignedBigInteger('election_id')->nullable();

            $table->foreign('election_id')
                  ->references('id')->on('elections')
                  ->onDelete('cascade');
        });
    }
};
