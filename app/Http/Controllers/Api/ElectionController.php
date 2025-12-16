<?php

namespace App\Http\Controllers\Api;

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

        $electionCountPerCandidate = Position::with(['approvedCandidates'])->get();

        $recentChurchImports = Church::withCount('voters')
            ->withMax('voters', 'created_at')
            ->orderByDesc('voters_max_created_at')
            ->limit(10)
            ->get()
            ->map(function ($church) {
                return [
                    'church_id'   => $church->id,
                    'church_name' => $church->name,
                    'total_voters'=> $church->voters_count,
                    'last_import' => $church->voters_max_created_at,
                ];
            });



        return response()->json([
            'total_voters'     => Voter::count(),
            'total_returns'    => $votesByVoter,
            'start_date'       => Setting::getValue('start_date'),
            'end_date'         => Setting::getValue('end_date'),
            'zones'            => $zones,
            'election_count'   => $electionCountPerCandidate,
            'recentChurchImports' => $recentChurchImports
        ]);
    }
}
