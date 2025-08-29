<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CandidateAnswer;

class CandidateAnswerController extends Controller
{
    public function storeBulk(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|integer|exists:candidates,id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|integer|exists:questions,id',
            'answers.*.answer' => 'nullable|string',
        ]);

        $candidateId = $request->candidate_id;
        $answers = $request->answers;

        foreach ($answers as $ans) {
            CandidateAnswer::updateOrCreate(
                [
                    'candidate_id' => $candidateId,
                    'question_id' => $ans['question_id'],
                ],
                [
                    'answer' => $ans['answer'],
                ]
            );
        }

        return response()->json(['message' => 'Answers saved successfully.']);
    }
}
