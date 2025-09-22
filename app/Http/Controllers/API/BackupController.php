<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BackupController extends Controller
{
    public function createBackup(Request $request)
    {   
        try {
            // Run backup
            Artisan::call('backup:run');

            $backupName = config('backup.backup.name'); // e.g. ncmd-es
            $files = Storage::disk('local')->files($backupName);
            var_dump($files);

            $latest = collect($files)->last();

            if (!$latest) {
                Log::warning("No backup files found in folder: {$backupName}");
                return response()->json(['error' => "No backup files found in folder: {$backupName}"], 500);
            }

            return Storage::disk('local')->download($latest, 'election_backup.zip');

        } catch (\Exception $e) {
            Log::error("Backup failed: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
