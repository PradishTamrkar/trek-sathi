<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunitySubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Submissions/Index',[
            'submissions'=>CommunitySubmission::with(['user','trekkingRoute'])->latest()->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Admin gets all the community submissions created by users and then theyc cna update the community status only
     */
    public function update(Request $request, string $id)
    {
        $validated=$request->validate([
            'status'=>'required|in:pending,approved,rejected',
        ]);

        try{
            $submission = CommunitySubmission::find($id);

            if(!$submission)
            {
                return back()->with('failed','Submission not found');
            }

            $submission->update($validated);

            return back()->with('success','Submission status updated to '.ucfirst($validated['status']));
        }catch(\Exception $e){
            return back()->with('failed','Failed to update Submission Status: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $submission=CommunitySubmission::find($id);

            if(!$submission)
            {
                return back()->with('failed','Submission not found');
            }

            $submission->delete();

            return back()->with('success','Submissions Deleted Successfully');
        }catch(\Exception $e)
        {
            return back()->with('failed','Failed to delete Submission');
        }
    }
}
