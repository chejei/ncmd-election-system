<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $questions = Question::when($search, function ($query, $search) {
                $query->where('question', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json($questions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question_text' => 'required|string|max:255',
            'enable'   => 'nullable|boolean'
        ]);

        $question = Question::create($validated);

        return response()->json($question, 201);
    }

    public function show(Question $question)
    {
        return response()->json($question);
    }

    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'question_text' => 'required|string|max:255',
            'enable'   => 'nullable|boolean'
        ]);

        $question->update($validated);

        return response()->json($question);
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return response()->json(['message' => 'Question deleted successfully']);
    }

    public function activeQuestions($candidateId)
    {
        $questions = Question::where('enable', 1)
            ->with(['answers' => function ($q) use ($candidateId) {
                $q->where('candidate_id', $candidateId);
            }])
            ->get();

        // format answers (avoid returning collection inside array)
        $questions->each(function ($q) {
            $q->answer = $q->answers->first()?->answer ?? null;
            unset($q->answers);
        });

        return response()->json($questions);
    }

}
