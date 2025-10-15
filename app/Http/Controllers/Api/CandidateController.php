<?php
// app/Http/Controllers/API/CandidateController.php

namespace App\Http\Controllers\Api;
use Carbon\Carbon;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Candidate;
use App\Models\Position;



class CandidateController extends Controller
{
   
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Candidate::query()
            ->where('status', $status);

        if ($search) {
            $query->leftJoin('churches', 'churches.id', '=', 'candidates.church_id');
            $query->where(function($q) use ($search) {
                $q->where('candidates.first_name', 'like', "%{$search}%")
                ->orWhere('candidates.last_name', 'like', "%{$search}%")
                ->orWhere('churches.name', 'like', "%{$search}%")
                ->orWhere('positions.title', 'like', "%{$search}%");
            });
        }

        $candidates = $query->paginate(10);

        return response()->json($candidates);
    }

    public function show($id)
    {
        $candidate = Candidate::findOrFail($id); // find or fail will 404 if not found
        return response()->json($candidate);
    }
    
    public function store(Request $request)
    {
        // Validate input
        $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix_name' => 'nullable|string|max:50',
            'ministry_involvement' => 'nullable|string',
            'age' => 'required|nullable|integer',
            'email'       => 'nullable|email|max:255',
            'phone_number'=> 'nullable|string|max:20',
            'address'     => 'nullable|string|max:255',
            'occupation'  => 'nullable|string|max:100',
            'company'     => 'nullable|string|max:100',
            'grade_year' => 'nullable|string|max:50',
            'course_strand' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',
            'church_id' => 'required|integer|exists:churches,id',
            'position_id' => 'required|integer|exists:positions,id',
            'photo' => 'nullable|string', // Base64 string
            'endorsed' => 'nullable|string|max:255',
            'political_color'  => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        $photoPath = null;

        // Handle Base64 Photo
        if ($request->photo) {
            $image = str_replace('data:image/png;base64,', '', $request->photo);
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageName = 'candidates/' . uniqid() . '.png';
            Storage::disk('public')->put($imageName, base64_decode($image));
            $photoPath = $imageName;
        }

        // Save candidate
        $candidate = Candidate::create([
            'last_name' => $request->last_name,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'suffix_name' => $request->suffix_name,
            'ministry_involvement' => $request->ministry_involvement,
            'age' => $request->age,
            'grade_year' => $request->grade_year,
            'course_strand' => $request->course_strand,
            'school' => $request->school,
            'church_id' => $request->church_id,
            'position_id' => $request->position_id,
            'photo' => $photoPath,
            'endorsed' => $request->endorsed,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'occupation' => $request->occupation,
            'company' => $request->company,
            'political_color' => $request->political_color,
            'status' => $request->status ?? 'pending',
        ]);

        return response()->json([
            'message' => 'Candidate created successfully.',
            'data' => $candidate
        ]);
    }

    public function update(Request $request, $id)
    {
        $candidate = Candidate::findOrFail($id);
        $prevFile = basename($candidate->photo);
        $newFile = basename($request->photo);
         
        if($request->photo && $prevFile !== $newFile){
             if ( \Storage::exists('public/candidates/' . $prevFile)) {
                \Storage::delete('public/candidates/' . $prevFile);
            }
        }
       

        // Validate input
        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix_name' => 'nullable|string|max:50',
            'ministry_involvement' => 'nullable|string',
            'age' => 'required|nullable|integer',
            'email'       => 'nullable|email|max:255',
            'phone_number'=> 'nullable|string|max:20',
            'address'     => 'nullable|string|max:255',
            'occupation'  => 'nullable|string|max:100',
            'company'     => 'nullable|string|max:100',
            'grade_year' => 'nullable|string|max:50',
            'course_strand' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',
            'church_id' => 'required|integer|exists:churches,id',
            'position_id' => 'required|integer|exists:positions,id',
            'photo' => 'nullable|string', // Base64 string
            'endorsed' => 'nullable|string|max:255',
            'political_color'  => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        // Update fields
        $candidate->fill($validated);

        if ($request->photo && $prevFile !== $newFile ) {
            $image = str_replace('data:image/png;base64,', '', $request->photo);
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageName = 'candidates/' . uniqid() . '.png';
            Storage::disk('public')->put($imageName, base64_decode($image));
            $candidate->photo = $imageName;
        }else{
            $candidate->photo = "";
            if($request->has('photo') && $prevFile !== ""){
                $candidate->photo =  'candidates/' .$prevFile;
            }
           
        }
        
        $candidate->save();
        return response()->json($candidate);
    }

    public function destroy($id)
    {
        $candidate = Candidate::findOrFail($id);

        $photoFile = basename($candidate->photo);
        if($photoFile){
            if ( \Storage::exists('public/candidates/' . $photoFile)) {
                \Storage::delete('public/candidates/' . $photoFile);
            }
        } 

        $candidate->delete();

        return response()->json(['message' => 'Candidate deleted successfully']);
    }

    public function positionCandidates()
    {
        // Fetch positions with their candidates
        $positions = Position::with('approvedCandidates')->orderBy('priority', 'asc')->get();
        return response()->json($positions);
    }

    public function candidateBySlug($slug)
    {   
        $candidate = Candidate::with(['answers.question'])
            ->where('slug', $slug)->firstOrFail();

        return response()->json($candidate);
    }

    public function approve($id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->status = 'approved';
        $candidate->approved_at = now();
        $candidate->rejected_at = null; // clear reject timestamp if re-approved
        $candidate->save();

        return response()->json(['message' => 'Candidate approved']);
    }

    public function reject($id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->status = 'rejected';
        $candidate->rejected_at = now();
        $candidate->approved_at = null; // clear approve timestamp if rejected
        $candidate->save();

        return response()->json(['message' => 'Candidate rejected']);
    }
}