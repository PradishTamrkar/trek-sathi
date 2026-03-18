<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\CloudinaryService;


class AdminRegionController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary){}

    public function index()
    {
        $regions = Region::all();

        return Inertia::render('Admin/Regions/Index',[
            'regions'=>$regions
        ]);
    }

    public function store(Request $request)
    {
        $validated=$request->validate([
            'region_name'=>'required|string|max:255',
            'region_description'=>'nullable|string',
            'best_season'=>'nullable|string|max:255',
            'how_to_reach'=>'nullable|string',
            'region_images'=>'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        try{
            $region=new Region();
            $region->region_name=$validated['region_name'];
            $region->region_description=$validated['region_description'];
            $region->best_season=$validated['best_season'];
            $region->how_to_reach=$validated['how_to_reach'];
            if($request->hasFile('region_images')){
                $validated['region_images']=$this->cloudinary->upload
                (
                    $request->file('region_images'),
                    'trek-sathi/regions'
                );
            }else{
                $validated['region_images']=null;
            }
            $region->save($validated);

            return back()->with('success','Region created successfully');
        }catch(\Exception $e){
            return back()->with('failed','Failed to create region');
        }
    }

    public function update(Request $request, string $id)
    {
        $validated=$request->validate([
            'region_name'=>'required|string|max:255',
            'region_description'=>'nullable|string',
            'best_season'=>'nullable|string|max:255',
            'how_to_reach'=>'nullable|string',
            'region_images'=>'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        try{
            $region = Region::find($id);

            if(!$region){
                return back()->with('failed','failed to find the region');
            }

            if($request->hasFile('region_images')){
                //delete old image from cloudinary
                if($region->region_images){
                    $this->cloudinary->delete($region->region_images);
                }
                $validated['region_images']=$this->cloudinary->upload(
                    $request->file('region_images'),
                    'trek-sathi/regions'
                );
            }else{
                unset($validated['region_images']);
            }
            $region->update($validated);

            return back()->with('success','Region successfully updated');
        }catch(\Exception $e){
            return back()->with('failed','failed to update region info');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $region=Region::find($id);
        if (!$region) {
            return back()->with('failed', 'Region not found');
        }

        try{
            // Clean up Cloudinary image
            if ($region->region_images) {
                $this->cloudinary->delete($region->region_images);
            }
            $region->delete();
            return back()->with('success','Region deleted successfully');
        }catch(\Exception $e){
            return back()->with('failed','Failed to delete region');
        }
    }
}
