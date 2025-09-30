<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class VoterAuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'last_name' => 'required|string',
            'pin_code'  => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

         // Lookup by pin_code first (pin_code should be unique)
        $voter = Voter::where('pin_code', $request->pin_code)->first();

        // Generic error message so we don't leak which field was wrong
        if (!$voter) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Compare last names case-insensitively (trim whitespace)
        if (strtolower(trim($voter->last_name)) !== strtolower(trim($request->last_name))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }


        // ✅ If you want token-based login (Sanctum/Passport)
        $token = $voter->createToken('voter_token')->plainTextToken;

        return response()->json([
                'voter' => $voter,
                'token' => $token,
                'role' => 'voter'
            ], 200);
    }

    public function logout(Request $request)
    {
        // Revoke the current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ], 200);
    }
}
