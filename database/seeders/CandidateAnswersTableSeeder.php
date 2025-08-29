<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CandidateAnswersTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('candidate_answers')->insert([
            [
                'question_id' => 1,
                'candidate_id' => 1,
                'answer' => 'I want to serve and lead the youth ministry with excellence.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
