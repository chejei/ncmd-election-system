<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voter;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class VoteController extends Controller
{

    public function store(Request $request)
    {
         // Decode selections from JSON string
        $selections = json_decode($request->input('selections'), true);

        if (!is_array($selections)) {
            return response()->json(['error' => 'Selections must be an array'], 422);
        }
        $request->validate([
            'voter_id' => 'required|exists:voters,id',
            'photo' => 'nullable|string', // base64 image
        ]);

        $voter = Voter::findOrFail($request->voter_id);

        // Save photo directly in voters table
        if ($request->photo) {
            $image = str_replace('data:image/jpeg;base64,', '', $request->photo);
            $image = str_replace(' ', '+', $image);
            $fileName = 'voter_photos/' . uniqid() . '.jpg';
            Storage::disk('public')->put($fileName, base64_decode($image));

            $voter->update([
                'voted_photo' => $fileName,
            ]);
        }

        // Save votes
        foreach ($selections as $positionId => $candidateIds) {
            foreach ((array) $candidateIds as $candidateId) {
                Vote::create([
                    'voter_id'    => $voter->id,
                    'candidate_id'=> $candidateId,
                ]);
            }
        }

        return response()->json([
            'message' => 'Ballot submitted successfully',
        ]);
    }




}
