<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SavedTrip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserSavedTripsController extends Controller
{
    public function store(Request $request)
    {
        $validated=$request->validate([
            'trekking_route_id' => 'required|exists:trekking_routes,id',
            'trip_title'        => 'required|string|max:255',
            'itinerary_json'    => 'required|array',
        ]);

        try {
            $trip=new SavedTrip();
            $trip->user_id=Auth::id();
            $trip->trekking_route_id=$validated['trekking_route_id'];
            $trip->trip_title=$validated['trip_title'];
            $trip->itinerary_json=$validated['itinerary_json'];
            $trip->save();

            return back()->with('success','Trip saved successfully')->with('trip_id',$trip->id);
        }catch(\Exception $e){
            return back()->with('Failed to save trip');
        }
    }

    public function show(string $id)
    {
        $trip=SavedTrip::where('id',$id)
            ->with('user_id',Auth::id())
            ->with(['trekkingRoute.regions','trekkingRoute.permits','trekkingRoute.routeDays'])
            ->first();

            if(!$trip){
                return back()->with('failed','Trip not found');
            }

            return Inertia::render('User/SavedTrips/Show',[
                'trip'=>$trip,
            ]);
    }

    public function destroy(string $id)
    {
        $trip=SavedTrip::where('id',$id)
            ->where('user_id',Auth::id())
            ->first();

        if(!$trip){
            return back()->with('failed','Trip not found');
        }

        try{
            $trip->delete();
            return back()->with('success','Successfully deleted saved trips');
        }catch(\Exception $e){
            return back()->with('failed','Failed to delete saved trip');
        }
    }
}
