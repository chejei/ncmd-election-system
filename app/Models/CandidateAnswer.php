<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateAnswer extends Model
{
    protected $fillable = ['question_id', 'candidate_id', 'answer'];

     protected $appends = ['question_text'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function getQuestionTextAttribute()
    {
        return $this->question ? $this->question->question_text : null;
    }
}
