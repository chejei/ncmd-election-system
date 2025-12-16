<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ElectoralGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ElectoralGroupController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('search') && $request->has('page')) {
            $search = $request->input('search', '');

            $groups = ElectoralGroup::when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->paginate(10);

        } else {
            $groups = ElectoralGroup::all();
        }

        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',          // hex or name
            'logo' => 'nullable|string',          // image path
            'banner_image' => 'nullable|string',  // image path
        ]);

        $logoPath = null;
        $bannerImagePath = null;

        if ($request->logo) {
            $logo = str_replace('data:image/png;base64,', '', $request->logo);
            $logo = str_replace('data:image/jpeg;base64,', '', $logo);
            $logo = str_replace(' ', '+', $logo);
            $logoName = 'political-group/logo/' . uniqid() . '.png';
            Storage::disk('public')->put($logoName, base64_decode($logo));
            $logoPath = $logoName;
        }

        if ($request->banner_image) {
            $banner_image = str_replace('data:image/png;base64,', '', $request->banner_image);
            $banner_image = str_replace('data:image/jpeg;base64,', '', $banner_image);
            $banner_image = str_replace(' ', '+', $banner_image);
            $bannerImageName = 'political-group/banner_image/' . uniqid() . '.png';
            Storage::disk('public')->put($bannerImageName, base64_decode($banner_image));
            $bannerImagePath = $bannerImageName;
        }


         // Save candidate
        $group = ElectoralGroup::create([
            'name' => $request->name,
            'color' => $request->color,
            'logo' => $logoPath,
            'banner_image' => $bannerImagePath
        ]);

        return response()->json([
            'message' => 'Electoral Group created successfully.',
            'data' => $group
        ]);
    }

    public function show(ElectoralGroup $electoralGroup)
    {
        return response()->json($electoralGroup);
    }

    public function update(Request $request,  $id)
    {
        $electoralGroup = ElectoralGroup::findOrFail($id);
        $prevFileLogo = basename($electoralGroup->logo);
        $newFileLogo = basename($request->logo);
        $prevFileBannerImage = basename($electoralGroup->banner_image);
        $newFileBannerImage = basename($request->banner_image);
         
        if($request->logo && $prevFileLogo !== $newFileLogo){
             if ( \Storage::exists('public/political-group/logo/' . $prevFileLogo)) {
                \Storage::delete('public/political-group/logo/' . $prevFileLogo);
            }
        }

        if($request->banner_image && $prevFileBannerImage !== $newFileBannerImage){
             if ( \Storage::exists('public/political-group/banner_image/' . $prevFileBannerImage)) {
                \Storage::delete('public/political-group/banner_image/' . $prevFileBannerImage);
            }
        }
       
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',          // hex or name
            'logo' => 'nullable|string',          // image path
            'banner_image' => 'nullable|string',  // image path
        ]);
         // Update fields
        $electoralGroup->fill($validated);

        if($request->logo && $prevFileLogo !== $newFileLogo){
            $logo = str_replace('data:image/png;base64,', '', $request->logo);
            $logo = str_replace('data:image/jpeg;base64,', '', $logo);
            $logo = str_replace(' ', '+', $logo);
            $logoName = 'political-group/logo/' . uniqid() . '.png';
            Storage::disk('public')->put($logoName, base64_decode($logo));
            $electoralGroup->logo = $logoName;
        }else{
            $electoralGroup->logo = "";
            if($request->has('logo') && $prevFileLogo !== ""){
                $electoralGroup->logo =  'political-group/logo/' .$prevFileLogo;
            }
        }


        if($request->banner_image && $prevFileBannerImage !== $newFileBannerImage){
            $banner_image = str_replace('data:image/png;base64,', '', $request->banner_image);
            $banner_image = str_replace('data:image/jpeg;base64,', '', $banner_image);
            $banner_image = str_replace(' ', '+', $banner_image);
            $bannerImageName = 'political-group/banner_image/' . uniqid() . '.png';
            Storage::disk('public')->put($bannerImageName, base64_decode($banner_image));
            $electoralGroup->banner_image = $bannerImageName;
        }else{
            $electoralGroup->banner_image = "";
            if($request->has('banner_image') && $prevFileBannerImage !== ""){
                $electoralGroup->banner_image =  'political-group/banner_image/' .$prevFileBannerImage;
            }
        }
        
        $electoralGroup->save();
        return response()->json($electoralGroup);

        // $electoralGroup->update($validated);

        // return response()->json($electoralGroup);
    }

    public function destroy(ElectoralGroup $electoralGroup)
    {
        $electoralGroup->delete();

        return response()->json([
            'message' => 'Electoral group deleted successfully'
        ]);
    }
}
