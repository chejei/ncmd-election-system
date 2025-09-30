<?php
// app/Http/Controllers/API/PositionController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function index(Request $request)
    {
        if($request->has('search')){
            $search = $request->input('search', '');
            $positions = Position::when($search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->orderBy('priority', 'asc')
            ->get();
        }else{
            $positions = Position::all();
        }
        return response()->json($positions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'max_winners' => 'required|integer|min:1'
        ]);

        // Get the current highest priority
        $lastPriority = Position::max('priority');

        // Assign next priority
        $validated['priority'] = $lastPriority ? $lastPriority + 1 : 1;

        $position = Position::create($validated);

        return response()->json($position, 201);
    }

    public function show(Position $position)
    {
        return response()->json($position);
    }

    public function update(Request $request, Position $position)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'max_winners' => 'required|integer|min:1', 
        ]);

        $position->update($validated);

        return response()->json($position);
    }

    public function destroy(Position $position)
    {
        $position->delete();

        return response()->json(['message' => 'Position deleted successfully']);
    }
    // PositionController.php
    public function reorder(Request $request)
    {
        $orderedIds = $request->input('positions'); // array of IDs in new order
        foreach ($orderedIds as $index => $id) {
            Position::where('id', $id)->update(['priority' => $index + 1]);
        }
        return response()->json(['message' => 'Order updated successfully']);
    }

    public function meetCandidates()
    {
        $positions = Position::with('candidates')->orderBy('priority', 'asc')->get();
        return response()->json($positions);
    }

}
