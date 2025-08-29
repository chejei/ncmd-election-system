<?php

// app/Http/Controllers/API/ChurchController.php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Church;
use Illuminate\Http\Request;

class ChurchController extends Controller
{
    public function index(Request $request)
    {
        if($request->has('search') && $request->has('page')){
            $search = $request->input('search', '');
            $positions = Church::when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                ->orWhere('senior_ptr', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->paginate(10);
        }else{
            $positions = Church::all();
        }
        return response()->json($positions);
    }

     public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'senior_ptr' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'zone' => 'nullable|integer',
            'circuit' => 'nullable|integer',
        ]);

        $church = Church::create($validated);

        return response()->json($church, 201);
    }

    public function show(Church $church)
    {
        return response()->json($church);
    }

    public function update(Request $request, Church $church)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'senior_ptr' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'zone' => 'nullable|integer',
            'circuit' => 'nullable|integer',
        ]);

        $church->update($validated);

        return response()->json($church);
    }

    public function destroy(Church $church)
    {
        $church->delete();

        return response()->json(['message' => 'Church deleted successfully']);
    }
}
