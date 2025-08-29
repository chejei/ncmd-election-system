<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // ChurchesTableSeeder::class,
            PositionsTableSeeder::class,
            // ElectionsTableSeeder::class,
            CandidatesTableSeeder::class,
            // VotersTableSeeder::class,
            // VotesTableSeeder::class,
            // QuestionsTableSeeder::class,
            // CandidateAnswersTableSeeder::class,
        ]);
    }

}
