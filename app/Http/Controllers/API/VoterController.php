<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voter;
use App\Models\Church;
use App\Http\Resources\VoterResource;
use Illuminate\Http\Request;
use App\Mail\SendPinMail;
use App\Mail\PinResetMail;
use Illuminate\Support\Facades\Mail;

class VoterController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $voters = Voter::with([
            'church',
            'votes.candidate.position' // eager load candidate and its position
        ])
            ->when($search, function ($query, $search) {
                $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('church', function ($cq) use ($search) {
                          $cq->where('name', 'like', "%{$search}%");
                      });
            })
            ->orderBy('last_name')
            ->paginate(10);

        return $voters->through(fn ($voter) => new VoterResource($voter));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'   => 'required|string|max:255',
            'last_name'    => 'required|string|max:255',
            'middle_name'  => 'nullable|string|max:255',
            'suffix_name'  => 'nullable|string|max:50',
            'email'        => 'required|email|unique:voters,email',
            'phone_number' => 'nullable|string|max:20',
            'church_id'    => 'nullable|exists:churches,id',
        ]);

        $voter = Voter::create($data);

        return new VoterResource($voter);
    }

    public function show(Voter $voter)
    {
        return new VoterResource($voter->load('church'));
    }

    public function update(Request $request, Voter $voter)
    {
        $data = $request->validate([
            'first_name'   => 'required|string|max:255',
            'last_name'    => 'required|string|max:255',
            'middle_name'  => 'nullable|string|max:255',
            'suffix_name'  => 'nullable|string|max:50',
            'email'        => 'required|email|unique:voters,email,' . $voter->id,
            'phone_number' => 'nullable|string|max:20',
            'church_id'    => 'nullable|exists:churches,id',
        ]);

        $voter->update($data);

        return new VoterResource($voter);
    }

    public function destroy(Voter $voter)
    {
        $voter->delete();

        return response()->json(['message' => 'Voter deleted successfully']);
    }

    public function sendPin(Request $request, $id)
    {
        $request->validate([
            'method' => 'required|in:email,sms',
        ]);

        $voter = Voter::findOrFail($id);
        $pin   = $voter->pin_code;
        $method = $request->input('method');

        try {
            switch ($method) {
                case 'email':
                    Mail::to($voter->email)->send(new SendPinMail($pin, $voter));
                    break;
                case 'sms':
                    // TODO: Replace with actual SMS service integration
                    // Example: SmsService::send($voter->phone_number, "Your PIN is: {$pin}");
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => "PIN sent via {$method} successfully.",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Failed to send PIN via {$method}.",
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function resetPin($id)
    {
        $voter = Voter::findOrFail($id);
        $voter->pin_code = Voter::generateUniquePin();
        $pin   = $voter->pin_code;
        $voter->save();

        // Send email to voter
        Mail::to($voter->email)->send(new PinResetMail($pin,$voter));

        return response()->json([
            'new_pin' => $voter->pin_code,
            'message' => 'PIN has been reset and emailed to the voter.'
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'voters' => 'required|array',
            'voters.*.first_name' => 'required|string',
            'voters.*.last_name' => 'required|string',
            'voters.*.email' => 'nullable|email',
            'voters.*.phone_number' => 'nullable|string',
            'voters.*.church_name' => 'nullable|string',
        ]);

        $voters = $request->input('voters');

        foreach ($voters as $voterData) {
            // Find or create church
            $church = Church::firstOrCreate(
                ['name' => $voterData['church_name']],
                ['senior_ptr' => null, 'address' => null, 'zone' => null]
            );

            Voter::create([
                'first_name'   => $voterData['first_name'],
                'last_name'    => $voterData['last_name'],
                'middle_name'  => $voterData['middle_name'] ?? null,
                'suffix_name'  => $voterData['suffix_name'] ?? null,
                'email'        => $voterData['email'] ?? null,
                'phone_number' => $voterData['phone_number'] ?? null,
                'church_id'    => $church->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Voters imported successfully!'
        ]);
    }




}
