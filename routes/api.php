<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CandidateController;
use App\Http\Controllers\API\ChurchController;
use App\Http\Controllers\API\PositionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VoterAuthController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\CandidateAnswerController;
use App\Http\Controllers\Api\VoterController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\ElectionController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/account/update', [AccountController::class, 'update']);

    Route::get('/admin/check', function () {
        return response()->json(['message' => 'You are admin']);
    });
});



Route::post('/voter/login', [VoterAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/voter/logout', [VoterAuthController::class, 'logout']);
});


Route::apiResource('candidates', CandidateController::class);
Route::get('/position-candidates', [CandidateController::class, 'positionCandidates']);
Route::get('/candidate/{slug}', [CandidateController::class, 'candidateBySlug']);

Route::apiResource('positions', PositionController::class);
Route::post('/positions/reorder', [PositionController::class, 'reorder']);
Route::get('/meet-candidates', [PositionController::class, 'meetCandidates']);

Route::apiResource('churches', ChurchController::class);

Route::apiResource('questions', QuestionController::class);
Route::get('/questions/active/{candidateId}', [QuestionController::class, 'activeQuestions']);

Route::post('/candidate-answers/bulk', [CandidateAnswerController::class, 'storeBulk']);

Route::apiResource('voters', VoterController::class);
Route::post('/voters/{id}/send-pin', [VoterController::class, 'sendPin']);
Route::post('/voters/{id}/reset-pin', [VoterController::class, 'resetPin']);
Route::post('/voters/import', [VoterController::class, 'import']);


Route::post('/submit-ballot', [VoteController::class, 'store']);

Route::get('/settings', [SettingController::class, 'index']);
Route::get('/settings/{option}', [SettingController::class, 'show']);
Route::post('/settings', [SettingController::class, 'store']);

Route::get('/statistics', [ElectionController::class, 'statistics']);
