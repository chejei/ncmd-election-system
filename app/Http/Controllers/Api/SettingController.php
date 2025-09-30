<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class SettingController extends Controller
{
    // Get all settings
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'option');
        return response()->json($settings);
    }

    // Get single setting by option name
    public function show($option)
    {
        $setting = Setting::where('option', $option)->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        return response()->json($setting);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            $existingSetting = Setting::where('option', $key)->first();
            $oldValue = $existingSetting ? $existingSetting->value : null;

            // Handle image (base64)
            if (is_string($value) && ( str_starts_with($value, 'data:image') || str_starts_with($value, '/storage'))) {
                if( basename($oldValue) !== basename($value)){
                    // If old value exists (file path), delete it first
                    if ($oldValue && Storage::disk('public')->exists($oldValue)) {
                        Storage::disk('public')->delete($oldValue);
                    }

                    // Save new image
                    $image = preg_replace('/^data:image\/\w+;base64,/', '', $value);
                    $image = str_replace(' ', '+', $image);

                    $imageName = 'settings/' . uniqid() . '.png';
                    Storage::disk('public')->put($imageName, base64_decode($image));
                }else{
                    $imageName =  'settings/' .basename($oldValue);
                }
                $value = $imageName;
            } else {
                // If not image but value is same, skip update
                if ($oldValue === $value) {
                    continue;
                }
            }

            // Insert or update
            Setting::updateOrCreate(
                ['option' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
