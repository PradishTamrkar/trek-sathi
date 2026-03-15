<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeaHouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTeaHouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/TeaHouse/Index',[
            'teahouses'=>TeaHouse::with(['trekkingRoute:id, trekking_route_name','region:id,region_name'])->latest()->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated=$request->validate([
            'house_name'=>'required|string|max:255',
            'location'=>'nullable|string|max:255',
            'altitude_location'=>'nullable|integer|min:0',
            'cost_per_night'=>'nullable|numeric|min:0',
            'has_electricity'=>'boolean',
            'has_wifi'=>'boolean',
            'trekking_route_id'=>'nullable|exists:trekking_routes,id',
            'region_id'=>'nullable|exists:regions,id',
        ]);

        $validated['has_electricity']=$validated['has_electricity'] ?? false;
        $validated['has_wifi']=$validated['has_wifi'] ?? false;

        try{
            $teahouse=new TeaHouse();
            $teahouse->house_name=$validated['house_name'];
            $teahouse->location=$validated['location'];
            $teahouse->altitude_location=$validated['altitude_location'];
            $teahouse->cost_per_night=$validated['cost_per_night'];
            $teahouse->has_electricity=$validated['has_electricity'];
            $teahouse->has_wifi=$validated['has_wifi'];
            $teahouse->trekking_route_id=$validated['trekking_route_id'];
            $teahouse->region_id=$validated['region_id'];
            $teahouse->save();

            return back()->with('success','Successfully Created Tea House');
        }catch(\Exception $e){
            return back()->with('failed','Failed to create Tea House');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated=$request->validate([
            'house_name'=>'required|string|max:255',
            'location'=>'nullable|string|max:255',
            'altitude_location'=>'nullable|integer|min:0',
            'cost_per_night'=>'nullable|numeric|min:0',
            'has_electricity'=>'boolean',
            'has_wifi'=>'boolean',
            'trekking_route_id'=>'nullable|exists:trekking_routes,id',
            'region_id'=>'nullable|exists:regions,id',
        ]);

        $validated['has_electricity']=$validated['has_electricity'] ?? false;
        $validated['has_wifi']=$validated['has_wifi'] ?? false;

        try{
            $teahouse = TeaHouse::find($id);
            if(!$teahouse)
            {
                return back()->with('failed','Tea House Not Found');
            }
            $teahouse->update($validated);

            return back()->with('success','Sucessfully Updated Tea House');
        }catch(\Exception $e){
            return back()->with('failed','Failed to update tea house info');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $teahouse=TeaHouse::find($id);

        if(!$teahouse)
        {
            return back()->with('failed','Tea House Not Found');
        }

        $teahouse->delete();

        return back()->with('success','Successfully Deleted Tea House Info');
    }
}
