<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class QuestionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete all rows but keep foreign key constraints safe
        DB::table('questions')->delete();

        $now = Carbon::now();

        $questions = [
            // Faith & Spiritual Life
            'How do you keep your personal relationship with God strong in your daily life?',
            'What role does prayer and reading the Bible play in your decision-making?',
            'How do you handle seasons of doubt or spiritual dryness?',

            // Integrity & Honesty
            'How would you respond if faced with a situation where being truthful might cost you popularity or votes?',
            'How do you ensure that your actions align with your words?',
            'Have you ever been tempted to compromise your values for personal gain? How did you respond?',

            // Servant Leadership
            'What does servant leadership mean to you, and how do you plan to demonstrate it if elected?',
            'How do you balance humility with the responsibilities of being in a position of authority?',
            'How would you handle situations where serving others requires personal sacrifice?',

            // Relationships & Forgiveness
            'How do you deal with conflicts or misunderstandings with others?',
            'Can you share an experience where you had to forgive someone who wronged you?',
            'How do you plan to model Christlike love to those who disagree with you?',

            // Commitment & Perseverance
            'What motivates you to continue serving even when things get difficult?',
            'How do you stay faithful to your commitments when challenges arise?',
            'What biblical principle guides you when making long-term decisions?',

            // Witness & Influence
            'How do you make sure your leadership reflects Christ to others?',
            'What impact do you hope your leadership will have on others’ spiritual growth?',
            'How will you handle the pressure of being a role model to others?',

            // Values & Vision
            'What Christian values do you believe are most important for a leader to demonstrate?',
            'What is your vision for this position, and how is it grounded in biblical principles?',
        ];

        foreach ($questions as $question) {
            DB::table('questions')->insert([
                'question_text' => $question,
                'enable' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
