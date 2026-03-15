<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\Region;
use App\Models\SavedTrip;
use App\Models\TeaHouse;
use App\Models\TrekkingRoute;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Guest landing — no data needed.
     */
    public function welcome()
    {
        return Inertia::render('User/Welcome');
    }

    /**
     * Authenticated home.
     */
    public function index()
    {
        $user = Auth::user();

        $regions = Region::orderBy('region_name')
            ->get(['id', 'region_name', 'best_season', 'region_description', 'region_images']);

        $trekkingRoutes = TrekkingRoute::with('regions:id,region_name')
            ->orderBy('duration_days')
            ->get();

        $teaHouses = TeaHouse::orderBy('house_name')
            ->take(12)
            ->get(['id', 'house_name', 'location', 'altitude_location',
                   'cost_per_night', 'has_wifi', 'has_electricity']);

        $savedTrips = SavedTrip::where('user_id', $user->id)
            ->with('trekkingRoute:id,trekking_route_name')
            ->latest()
            ->take(20)
            ->get();

        // Chat sessions for sidebar
        $chatSessions = ChatSession::where('user_id', $user->id)
            ->latest()
            ->take(20)
            ->get(['id', 'title', 'created_at']);

        return Inertia::render('User/Home', [
            'regions'        => $regions,
            'trekkingRoutes' => $trekkingRoutes,
            'teaHouses'      => $teaHouses,
            'savedTrips'     => $savedTrips,
            'chatSessions'   => $chatSessions,
        ]);
    }
}
