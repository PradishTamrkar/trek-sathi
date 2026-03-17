<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrekkingRoute;
use App\Models\RouteDay;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminRouteDayController extends Controller
{
    public function index(string $routeId)
    {
        $trekkingRoute = TrekkingRoute::with([
            'routeDays'=>fn($q)=>$q->orderBy('dat_number'),
        ])->find($routeId);

        if(!$trekkingRoute)
        {
            return back()->with('failed','Trekking Route Not Found');
        }

        return Inertia::render('Admin/RouteDays/Index',[
            'trekkingRoute'=>$trekkingRoute,
            'routeDays'=>$trekkingRoute->routeDays,
        ]);
    }

    public function store(Request $request,string $routeId)
    {
        $validated=$request->validate([
            'day_number'=>'required|integer|min:1',
            'start_point'=>'required|string|max:255',
            'end_point'=>'required|string|max:255',
            'Distance_in_km'=>'required|integer|min:0',
            'altitude'=>'required|integer|min:0',
            'days_description'=>'nullable|string',
        ]);
        try{
            $trekkingRoute=TrekkingRoute::find($routeId);
            if(!$trekkingRoute)
            {
                return back()->with('failed','Trekking Route Not Found');
            }

            $trekkingRoute->routeDays()->create($validated);

            return back()->with('success','Day Added Successfully');
        }catch(\Exception $e)
        {
            return back()->with('failed','Failed to create day');
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $routeId, string $dayId)
    {
        $validated=$request->validate([
            'day_number'=>'required|integer|min:1',
            'start_point'=>'required|string|max:255',
            'end_point'=>'required|string|max:255',
            'Distance_in_km'=>'required|integer|min:0',
            'altitude'=>'required|integer|min:0',
            'days_description'=>'nullable|string',
        ]);

        try{
            $day=RouteDay::where('id',$dayId)
                ->where('trekking_route_id',$routeId)
                ->first()
                ->find();

            if(!$day)
            {
                return back()->with('failed','Day not found');
            }

            $day->update($validated);

            return back()->with('success','Sucessfully updated Day info');
        }catch(\Exception $e)
        {
            return back()->with('failed','Failed to update day info');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $routeId, string $dayId)
    {
        try{
            $day=RouteDay::where('id',$dayId)
                ->where('trekking_route_id',$routeId)
                ->first()
                ->find();
            if(!$day)
            {
                return back()->with('failed','Failed to find the day');
            }
            $day->delete();
            return back()->with('success','successfully deleted day');
        }catch(\Exception $e)
        {
            return back()->with('failed','failed to delete day info');
        }
    }
}
