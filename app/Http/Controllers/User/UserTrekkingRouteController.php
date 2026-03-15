<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTrekkingRouteController extends Controller
{
    public function show(string $id)
    {
        $trekkingRoute = TrekkingRoute::with([
            'regions',
            'routeDays.teaHouse',
            'permits',
        ])->find($id);

        if(!$trekkingRoute)
        {
            return back()->with('failed','failed to find tthe trekking route');
        }

        return Inertia::render('User/TrekkingRoutes/Show');
    }
}
