<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\SavedTrip;
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
                ->latest()
                ->take(20)
                ->get(),
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
            ->find();

        if(!$chatSession)
        {
            return back()->with('failed','Session not found');
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
                ->get(),
                'sessionId'=>$chatSession->id,
                'messages'=>$chatSession->messages,
        ]);
    }
}
