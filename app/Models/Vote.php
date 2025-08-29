<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = [
        'voter_id',
        'candidate_id',
    ];

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null; // disable updated_at only

    // Each vote belongs to one voter
    public function voter()
    {
        return $this->belongsTo(Voter::class);
    }

    // Each vote belongs to one candidate
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
    
    public function position()
    {
        return $this->hasOneThrough(
            Position::class,
            Candidate::class,
            'id',        // Candidate primary key
            'id',        // Position primary key
            'candidate_id', // Foreign key on votes
            'position_id'   // Foreign key on candidates
        );
    }
}
