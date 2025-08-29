<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VotesTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('votes')->insert([
            [
                'voter_id' => 1,
                'candidate_id' => 1,
                'created_at' => now(),
            ],
        ]);
    }
}
