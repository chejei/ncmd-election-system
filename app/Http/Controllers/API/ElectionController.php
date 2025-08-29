<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Voter;
use App\Models\Vote;
use App\Models\Setting;
use App\Models\Church;
use App\Models\Position;




class ElectionController extends Controller
{
    public function statistics() {

        $votesByVoter = Vote::distinct('voter_id')->count('voter_id');

        $zones = Church::select('zone')
            ->withCount('voters') // count voters per church
            ->get()
            ->groupBy('zone')
            ->map(function ($churches, $zone) {
                return [
                    'zone' => $zone,
                    'voter_count' => $churches->sum('voters_count')
                ];
            });

        $electionCountPerCandidate = Position::with(['candidates'])->get();


        return response()->json([
            'total_voters'     => Voter::count(),
            'total_returns'    => $votesByVoter,
            'start_date'       => Setting::getValue('start_date'),
            'end_date'         => Setting::getValue('end_date'),
            'zones'            => $zones,
            'election_count'   => $electionCountPerCandidate
        ]);
    }
}
