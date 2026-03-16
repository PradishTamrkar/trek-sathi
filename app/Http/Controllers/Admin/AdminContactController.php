<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contact;
class AdminContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Contact::where('is_read','false')->update(['is_read'=>true]);

        return Inertia::render('Admin/Contact/Index',[
            'contacts'=>Contact::latest()->get(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $contact=Contact::find($id);
            if(!$contact)
            {
                return back()->with('failed','Message not found');
            }
            $contact->destroy();
            return back()->with('success','Message successfully Deleted');
        }catch(\Exception $e){
            return back()->with('failed','Failed to delete message');
        }
    }
}
