<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = ['title', 'priority', 'max_winners'];

    protected $appends = ['candidate_count'];

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }

    public function approvedCandidates()
    {
        return $this->hasMany(Candidate::class)->where('status', 'approved');
    }

    public function getCandidateCountAttribute()
    {
        return $this->approvedCandidates()->count();
    }
}