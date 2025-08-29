<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VoterResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'middle_name' => $this->middle_name,
            'suffix_name' => $this->suffix_name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'church_name' => $this->church?->name,
            'voted_photo' => $this->voted_photo,
            'created_at' => $this->created_at->toDateTimeString(),
            'restrict' => $this->restrict,
            'voted_positions' => $this->votes->map(function ($vote) {
                return [
                    'position' => $vote->candidate->position->title ?? null,
                    'candidate' => $vote->candidate->full_name ?? null,
                ];
            }),
        ];
    }
}
