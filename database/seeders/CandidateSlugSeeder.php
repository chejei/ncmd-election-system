<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Candidate;

class CandidateSlugSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidates = Candidate::all();

        foreach ($candidates as $candidate) {
            if (empty($candidate->slug)) {
                $candidate->slug = Candidate::generateUniqueSlug($candidate->full_name, $candidate->id);
                $candidate->save();
            }
        }
    }
}
