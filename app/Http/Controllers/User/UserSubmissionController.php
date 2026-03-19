<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CommunitySubmission;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserSubmissionController extends Controller
{

    public function index()
    {
        $submission = CommunitySubmission::where('status','approved')
            ->with(['user:id,name','trekkingRoute:id,trekking_route_name'])
            ->latest()
            ->get();

        $routes = TrekkingRoute::orderBy('trekking_route_name')
            ->get(['id','trekking_route_name']);

        return Inertia::render('User/CommunitySubmissions/Index',[
            'submissions'=>$submission,
            'trekking_routes'=>$routes,
        ]);
    }

    public function store(Request $request)
    {
        $validated=$request->validate([
            'trekking_route_id'=>'required|exists:trekking_routes,id',
            'experience_text'=>'required|string|max:3000',
            'trail_condition'=>'required|in:good,damaged,closed',
        ]);

        try {
            $submission=new CommunitySubmission();
            $submission->user_id=Auth::id();
            $submission->trekking_route_id=$validated['trekking_route_id'];
            $submission->experience_text=$validated['experience_text'];
            $submission->trail_condition=$validated['trail_condition'];
            $submission->status='pending';
            $submission->save();

            return back()->with('success','Submission created successfully and is on pending reviews. Thank You');
        }catch(\Exception $e){
            return back()->with('failed','failed to create submission');
        }
    }
}
