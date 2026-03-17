<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permit;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPermitController extends Controller
{

    public function index(string $routeId)
    {
        $trekkingRoute=TrekkingRoute::with('permits')->find($routeId);
        if(!$trekkingRoute)
        {
            return back()->with('failed','Trekking Route not found');
        }

        return Inertia::render('Admin/Permits/Index',[
            'trekkingRoute'=>$trekkingRoute,
            'permits'=>$trekkingRoute->permits,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $routeId)
    {
        $validated=$request->validate([
            'permit_name'=>'required|string|max:255',
            'price_in_usd'=>'nullable|numeric|min:0',
            'price_in_npr'=>'nullable|numeric|min:0',
        ]);
        try{
            $trekkingRoute=TrekkingRoute::find($routeId);
            if(!$trekkingRoute)
            {
                return back()->with('failed','Trekking Route not found');
            }
            $trekkingRoute->permit()->create($validated);
            return back()->with('failed','Permit added succesfully');
        }catch(\Exception $e){
            return back()->with('success','Failed to create Permit');
        }
    }

    public function update(Request $request, string $routeId, string $permitId)
    {
        $validated=$request->validate([
            'permit_name'=>'required|string|max:255',
            'price_in_usd'=>'nullable|numeric|min:0',
            'price_in_npr'=>'nullable|numeric|min:0',
        ]);

        try{
            $permit=Permit::where('id',$permitId)
                ->where('trekking_rpute_id',$routeId)
                ->first()
                ->find();
            if(!$permit)
            {
                return back()->with('failed','Permit not found');
            }
            $permit->update($validated);
            return back()->with('success','Sucessfully updated Permit Info');
        }catch(\Exception $e)
        {
            return back()->with('failed','Failed to Update Permit Info');
        }
    }

    public function destroy(string $id, string $routeId, string $permitId)
    {
        try{
            $permit=Permit::where('id',$permitId)
                ->where('trekking_rpute_id',$routeId)
                ->first()
                ->find();
            if(!$permit)
            {
                return back()->with('failed','Permit not found');
            }
            $permit->delete();
            return back()->with('success','Permit Deleted Successfully');
        }catch(\Exception $e)
        {
            return back()->with('failed','Failed to dekete permit info');
        }
    }
}
