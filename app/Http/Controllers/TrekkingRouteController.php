<?php

namespace App\Http\Controllers;

use App\Models\Region;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrekkingRouteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trekkingRoute=TrekkingRoute::all();

        return Inertia::render('Admin/TrekkingRoutes/Index',[
            'trekkingRoutes'=>$trekkingRoute,
            'regions'=>Region::orderBy('region_name')->get()
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
            'region_id'=>'required|exists:regions,id',
            'trekking_route_name'=>'required|string|max:255',
            'difficulty'=>'required|in:easy,moderate,hard,hellmode',
            'duration_days'=>'required|integer|min:1',
            'max_altitude'=>'required|integer|min:0',
            'best_season'=>'required|string|max:255',
            'permit_required'=>'boolean',
            'trekking_description'=>'nullable|string',
            'trekking_images'=>'nullable|string',
        ]);

        try{
            $trekkingRoute = new TrekkingRoute();
            $trekkingRoute->region_id = $validated['region_id'];
            $trekkingRoute->trekking_route_name = $validated['trekking_route_name'];
            $trekkingRoute->difficulty = $validated['difficulty'];
            $trekkingRoute->duration_days = $validated['duration_days'];
            $trekkingRoute->max_altitude = $validated['max_altitude'];
            $trekkingRoute->best_season = $validated['best_season'];
            $trekkingRoute->permit_required = $validated['permit_required'];
            $trekkingRoute->trekking_description = $validated['trekking_description'];
            $trekkingRoute->trekking_images = $validated['trekking_images'];
            $trekkingRoute->save();

            return back()->with('success','Trekking Route Created Successfully');
        }catch(\Exception $e){
            return back()->with('failed','Failed to create Trekking Route');
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
            'region_id'=>'required|exists:regions,id',
            'trekking_route_name'=>'required|string|max:255',
            'difficulty'=>'required|in:easy,moderate,hard,hellmode',
            'duration_days'=>'required|integer|min:1',
            'max_altitude'=>'required|integer|min:0',
            'best_season'=>'required|string|max:255',
            'permit_required'=>'boolean',
            'trekking_description'=>'nullable|string',
            'trekking_images'=>'nullable|string',
        ]);

        try{
            $trekkingRoute = TrekkingRoute::find($id);

            if(!$trekkingRoute){
                return back()->with('failed','Trekking Route not found');
            }
        }catch(\Exception $e){
            return back()->with('failed','Failed to update trekking route');
        }


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $trekkingRoute = TrekkingRoute::find($id);
            if (!$trekkingRoute) {
                return back()->with('failed', 'Trekking Route not found');
            }
            $trekkingRoute->delete();
            return back()->with('success', 'Trekking Route deleted successfully');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to delete Trekking Route');
        }
    }
}
