<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('candidates', function (Blueprint $table) {
            // make academic fields nullable
            $table->string('grade_year')->nullable()->change();
            $table->string('course_strand')->nullable()->change();
            $table->string('school')->nullable()->change();

            // new fields
            $table->string('occupation')->nullable()->after('address');
            $table->string('company')->nullable()->after('occupation');
        });
    }

    public function down()
    {
        Schema::table('candidates', function (Blueprint $table) {
            // revert academic fields back to NOT NULL
            $table->string('grade_year')->nullable(false)->change();
            $table->string('course_strand')->nullable(false)->change();
            $table->string('school')->nullable(false)->change();

            $table->dropColumn(['occupation', 'company']);
        });
    }

};
