<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_text',
        'enable'
    ];

    public function answers()
    {
        return $this->hasMany(CandidateAnswer::class);
    }
}
