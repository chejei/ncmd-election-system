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
            // PositionsTableSeeder::class,
            // CandidatesTableSeeder::class,
            SettingSeeder::class,
            // QuestionsTableSeeder::class,
            UserSeeder::class,
            // VotersTableSeeder::class,
            // VotesTableSeeder::class,
            // CandidateAnswersTableSeeder::class,
        ]);
    }

}
