<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunitySubmission;
use App\Models\Region;
use App\Models\TrekkingRoute;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Admin/Dashboard',[
            'stats'=>[
                'total_routes'=>TrekkingRoute::count(),
                'total_regions'=>Region::count(),
                'total_users'=>User::where('role','user')->count(),
                'pending_submissions'=>CommunitySubmission::where('status','pending')->count(),
            ]
        ]);
    }
}
