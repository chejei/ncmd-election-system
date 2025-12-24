<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\ChurchController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VoterAuthController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\CandidateAnswerController;
use App\Http\Controllers\Api\VoterController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\ElectionController;
use App\Http\Controllers\Api\BackupController;
use App\Http\Controllers\Api\ElectoralGroupController;


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
Route::get('/db-test', function() {
    return DB::connection()->getPdo() ? 'DB Connected!' : 'DB Failed!';
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/voter/login', [VoterAuthController::class, 'login']);
Route::post('/voter/verify', [VoterController::class, 'verify']);


Route::post('/apply-candidacy', [CandidateController::class, 'store']);

Route::get('/statistics', [ElectionController::class, 'statistics']);
Route::get('/meet-candidates', [PositionController::class, 'meetCandidates']);
Route::get('/candidate/{slug}', [CandidateController::class, 'candidateBySlug']);

Route::get('/settings', [SettingController::class, 'index']);
Route::get('/settings/{option}', [SettingController::class, 'show']);

Route::apiResource('churches', ChurchController::class)->only(['index', 'show']);
Route::apiResource('electoral-groups', ElectoralGroupController::class)->only(['index', 'show']);
Route::apiResource('positions', PositionController::class)->only(['index', 'show']);
Route::get('/questions-active', [QuestionController::class, 'enableQuestions']);


Route::middleware('auth:sanctum')->group(function () {
    // Admin-related
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/account/update', [AccountController::class, 'update']);
    Route::get('/admin/check', function () {
        return response()->json(['message' => 'You are admin']);
    });

    Route::get('/backup', [BackupController::class, 'createBackup']);
    Route::apiResource('candidates', CandidateController::class);
    Route::apiResource('positions', PositionController::class)->except(['index', 'show']);
    Route::post('/positions/reorder', [PositionController::class, 'reorder']);

    Route::apiResource('churches', ChurchController::class)->except(['index', 'show']);

    Route::apiResource('electoral-groups', ElectoralGroupController::class)->except(['index', 'show']);

    Route::apiResource('questions', QuestionController::class);
    Route::get('/questions/active/{candidateId}', [QuestionController::class, 'activeQuestions']);

    Route::post('/candidate-answers/bulk', [CandidateAnswerController::class, 'storeBulk']);

    Route::apiResource('voters', VoterController::class);
    Route::post('/voters/{id}/send-pin', [VoterController::class, 'sendPin']);
    Route::post('/voters/{id}/reset-pin', [VoterController::class, 'resetPin']);
    Route::post('/voters/import', [VoterController::class, 'import']);

    Route::post('/settings', [SettingController::class, 'store']);

    Route::post('/candidates/{id}/approve', [CandidateController::class, 'approve']);
    Route::post('/candidates/{id}/reject', [CandidateController::class, 'reject']);

    // Voter-related
    Route::post('/voter/logout', [VoterAuthController::class, 'logout']);
    Route::post('/submit-ballot', [VoteController::class, 'store']);
    
    Route::get('/position-candidates', [CandidateController::class, 'positionCandidates']);
});



