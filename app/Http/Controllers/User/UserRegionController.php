<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserRegionController extends Controller
{

    public function show(string $id)
    {
        $region=Region::with(['trekkingRoutes'=>function($q){
            $q->withCount('routeDays')
              ->with('permits');
        }])->find($id);

        if(!$region)
        {
            return back()->with('failed','Failed to find the region');
        }

        return Inertia::render('User/Regions/Show',[
            'region'=>$region,
        ]);
    }
}
