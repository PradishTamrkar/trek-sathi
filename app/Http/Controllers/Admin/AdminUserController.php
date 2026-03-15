<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Users/Index',[
            'users'=>User::where('role','end-user')
                ->withCount(['savedTrips','communitySubmission'])
                ->latest()
                ->get()
        ]);
    }

    // /**
    //  * Show the form for creating a new resource.
    //  */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     //
    // }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     //
    // }

    /**
     * Show the form for editing the specified resource.
     */
    // public function edit(string $id)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, string $id)
    // {
    //     //
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $user = User::find($id);

            if(!$user){
                return back()->with('failed','User not found');
            }

            //prevent admin from deleting themselves
            if($user->isAdmin()){
                return back()->with('failed','Admin accounts cannot be deleted');
            }

            $user->delete();

            return back()->with('success','Successfully deleted User');
        }catch(\Exception $e){
            return back()->with('failed','Failed to delete user');
        }
    }
}
