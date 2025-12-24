<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voter;
use App\Models\Vote;
use App\Models\Setting;
use App\Models\Church;
use App\Models\Position;
use App\Models\Candidate;

class ElectionController extends Controller
{
    public function statistics() {

        $votesByVoter = Vote::distinct('voter_id')->count('voter_id');
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

      
        $getZones = Church::select('zone')
            ->withCount('voters') // count voters per church
            ->get()
            ->groupBy('zone')
            ->map(function ($churches, $zone) {
                return [
                    'zone' => $zone,
                    'voter_count' => $churches->sum('voters_count'),
                    'positions' => [] // we will fill this next
                ];
            });
        
        $getZonePositons = Voter::with('church')->get()->groupBy(fn($v) => $v->church->zone ?? 'Unknown');

        $zonePositons = [];

        $positions = Position::all();

        foreach ($getZonePositons as $zoneName => $votersInZone) {
            $voterIds = $votersInZone->pluck('id');

            $zonePositions = [];

            foreach ($positions as $position) {
                // Get all candidates for this position
                $candidates = Candidate::with('votes')
                    ->where('position_id', $position->id)
                    ->get();

                $zonePositions[$position->title] = $candidates->map(function ($cand) use ($voterIds) {
                    return [
                        'full_name' => trim($cand->first_name . ' ' . $cand->last_name),
                        'votes' => $cand->votes->whereIn('voter_id', $voterIds)->count(),
                    ];
                })->values();
            }

            $zonePositons[$zoneName] = $zonePositions;
        } 
        $getZones = $getZones->map(function ($zoneData) use ($zonePositons) {
            $zoneName = $zoneData['zone'];

            if (isset($zonePositons[$zoneName])) {
                $zoneData['positions'] = $zonePositons[$zoneName];
            }

            return $zoneData;
        });

          $churches = Church::with([
            'voters.votes.candidate.position'
        ])->get();

        $positions = Position::with('candidates')->orderBy('priority')->get();

        $churchesByZone = [];

        foreach ($churches as $church) {
            $zoneName = $church->zone ?? 'Unknown';

            $churchData = [
                'church_name' => $church->name,
                'positions' => [],
            ];

            foreach ($positions as $position) {

                // Votes coming ONLY from this church's voters
                $votesFromChurch = $church->voters
                    ->flatMap->votes
                    ->where('candidate.position_id', $position->id);

                $candidatesData = $position->candidates->map(function ($candidate) use ($votesFromChurch) {
                    return [
                        'full_name' => $candidate->first_name . ' ' . $candidate->last_name,
                        'votes' => $votesFromChurch
                            ->where('candidate_id', $candidate->id)
                            ->count(),
                    ];
                });

                $churchData['positions'][$position->title] = $candidatesData->values();
            }

            $churchesByZone[$zoneName][] = $churchData;
        }

        return response()->json([
            'total_voters'     => Voter::count(),
            'total_returns'    => $votesByVoter,
            'start_date'       => Setting::getValue('start_date'),
            'end_date'         => Setting::getValue('end_date'),
            'show_result_percentage' => Setting::getValue('show_result'),
            'zones'            => $getZones,
            'churches_by_zone' => $churchesByZone,
            'election_count'   => $electionCountPerCandidate,
            'recent_church_imports' => $recentChurchImports,
        ]);
    }
}
