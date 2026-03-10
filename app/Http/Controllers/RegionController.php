<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $regions = Region::all();

        return Inertia::render('Admin/Regions/Index',[
            'regions'=>$regions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated=$request->validate([
            'region_name'=>'required|string|max:255',
            'region_description'=>'nullable|string',
            'best_session'=>'nullable|string|max:255',
            'how_to_reach'=>'nullable|string',
            'region_images'=>'nullable|string',
        ]);

        try{
            $region=new Region();
            $region->region_name=$validated['region_name'];
            $region->region_description=$validated['region_description'];
            $region->best_session=$validated['best_session'];
            $region->how_to_reach=$validated['how_to_reach'];
            $region->region_images=$validated['region_images'];
            $region->save();

            return back()->with('success','Region created successfully');
        }catch(\Exception $e){
            return back()->with('failed','Failed to create region');
        }
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     //
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // public function edit(string $id)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated=$request->validate([
            'region_name'=>'required|string|max:255',
            'region_description'=>'nullable|string',
            'best_session'=>'nullable|string|max:255',
            'how_to_reach'=>'nullable|string',
            'region_images'=>'nullable|string',
        ]);

        try{
            $region = Region::find($id);

            if(!$region){
                return back()->with('failed','failed to find the region');
            }

            $region->update();

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

        try{
            $region->delete();
            return back()->with('success','Region deleted successfully');
        }catch(\Exception $e){
            return back()->with('failed','Failed to delete region');
        }
    }
}
