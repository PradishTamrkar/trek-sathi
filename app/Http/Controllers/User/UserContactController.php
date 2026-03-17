<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserContactController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Contact/Index');
    }

    public function store(Request $request)
    {
        $validated=$request->validate([
            'contact_name'=>'required|string|max:255',
            'contact_email'=>'required|email|max:255',
            'topic'=>'required|string|max:255',
            'message'=>'required|string|max:2000',
        ]);

        try{
            $contact=new Contact();
            $contact->contact_name=$validated['contact_name'];
            $contact->contact_email=$validated['contact_email'];
            $contact->topic=$validated['topic'];
            $contact->message=$validated['message'];
            $contact->save();

            return back()->with('success','Message Sent Successfully');
        }catch(\Exception $e){
            return back()->with('failed','Failed to send Message');
        }
    }
}
