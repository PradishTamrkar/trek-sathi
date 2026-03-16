<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunitySubmission;
use App\Models\Region;
use App\Models\TeaHouse;
use App\Models\TrekkingRoute;
use App\Models\User;
use App\Models\Contact;
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
                'total_users'=>User::where('role','end-user')->count(),
                'pending_submissions'=>CommunitySubmission::where('status','pending')->count(),
                'total_tea_houses'=>TeaHouse::count(),
                'unread_contacts'=>Contact::where('is_read',false)->count(),
            ]
        ]);
    }
}
