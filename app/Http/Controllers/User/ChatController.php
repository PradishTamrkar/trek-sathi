<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\SavedTrip;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * new empty chat page
     */
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('User/Chat',[
            'chatSessions'=>ChatSession::where('user_id',$user->id)
                ->latest()
                ->take(30)
                ->get(['id','title','created_at']),
            'savedTrips'=>SavedTrip::where('user_id',$user->id)
                ->with('trekkingRoute:id,trekking_route_name')
                ->latest()
                ->take(20)
                ->get(['id','trip_title','trekking_route_id','created_at']),
            'trekkingRoutes'=>TrekkingRoute::orderBy('trekking_route_name')
                ->get(['id','trekking_route_name']),
            'sessionId'=>null,
        ]);
    }

    //Resume existing chat session
    public function show(string $session)
    {
        $user=Auth::user();
        $chatSession=ChatSession::where('id',$session)
            ->where('user_id',$user->id)
            ->with('messages')
            ->first();

        if(!$chatSession)
        {
            return redirect()->route('chat.index')->with('failed','Session not found');
        }

        return Inertia::render('User/Chat',[
            'chatSessions'=>ChatSession::where('user_id',$user->id)
                ->latest()
                ->take(30)
                ->get(['id','title','created_at']),
            'savedTrips'=>SavedTrip::where('user_id',$user->id)
                ->with('trekkingRoute:id,trekking_route_name')
                ->latest()
                ->take(20)
                ->get(['id', 'trip_title', 'trekking_route_id', 'created_at']),
            'trekkingRoutes'=>TrekkingRoute::orderBy('trekking_route_name')
                ->get(['id','trekking_route_name']),
            'sessionId'=>$chatSession->id,
            'messages'=>$chatSession->messages,
        ]);
    }
}
