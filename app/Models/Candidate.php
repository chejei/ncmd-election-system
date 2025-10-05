<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use \App\Models\Setting;
use Carbon\Carbon;

class Candidate extends Model
{   
    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'suffix_name',
        'ministry_involvement',
        'age',
        'email',
        'phone_number',
        'address',
        'grade_year',
        'course_strand',
        'school',
        'occupation',
        'company',
        'church_id',
        'position_id',
        'endorsed',
        'photo',
        'political_color',
        'status'
    ];
    protected $appends = ['church_name', 'position_title' , 'full_name', 'restrict', 'vote_count'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($candidate) {
            $candidate->slug = static::generateUniqueSlug($candidate->full_name);
        });

        static::updating(function ($candidate) {
            // Only regenerate if full_name actually changed
            if ($candidate->isDirty(['first_name', 'last_name', 'middle_name', 'suffix_name'])) {
                $candidate->slug = static::generateUniqueSlug($candidate->full_name, $candidate->id);
            }
        });
    }

    protected static function booted()
    {
        static::addGlobalScope('orderByPositionPriority', function ($query) {
            $query->leftJoin('positions', 'positions.id', '=', 'candidates.position_id')
                  ->orderBy('positions.priority', 'asc')
                  ->orderBy('candidates.id', 'asc')
                  ->select('candidates.*'); // Important: avoid overwriting columns
        });
    }

    public static function generateUniqueSlug($name, $ignoreId = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (
            static::where('slug', $slug)
                ->when($ignoreId, fn($q) => $q->where('candidates.id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function church()
    {
        return $this->belongsTo(Church::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }
    
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function elections()
    {
        return $this->belongsToMany(Election::class, 'votes');
    }

    public function answers()
    {
        return $this->hasMany(CandidateAnswer::class);
    }

    public function getChurchNameAttribute()
    {
        return $this->church ? $this->church->name : null;
    }

    public function getPositionTitleAttribute()
    {
        return $this->position ? $this->position->title : null;
    }

    public function getVoteCountAttribute()
    {
        return $this->votes()->count();
    }

    public function getFullNameAttribute()
    {
        $middleInitial = $this->middle_name ? strtoupper(substr($this->middle_name, 0, 1)) . '.' : '';
        $suffix = $this->suffix_name ? ' ' . $this->suffix_name : '';

        return trim("{$this->first_name} {$middleInitial} {$this->last_name}{$suffix}");
    }
    public function getRestrictAttribute()
    {
        // Grab start & end date from settings table
        $startDate = Setting::getValue('start_date');
        $endDate   = Setting::getValue('end_date');

        if (!$startDate || !$endDate) {
            return false; // if not configured, no restriction
        }
        $startDate = Carbon::parse($startDate);
        $endDate   = Carbon::parse($endDate);

        $now = now();

        // Election is ongoing if "now" is between start and end
        $isOngoing = $now->between($startDate, $endDate);

        return $isOngoing;
    }
}
