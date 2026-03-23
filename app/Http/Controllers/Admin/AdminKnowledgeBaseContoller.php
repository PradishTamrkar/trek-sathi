<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBase;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminKnowledgeBaseContoller extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/KnowledgeBases/Index',[
            'entries'=>KnowledgeBase::with('TrekkingRoutes:id, trekking_route_name')
                ->latest()
                ->get(),
            'routes'=>TrekkingRoute::orderBy('trekking_route_name')
                ->get(['id','trekking_route_name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated=$request->validate([
            'trekking_route_id'=>'nullable|exists:trekking_route,id',
            'title'=>'required|string|max:255',
            'content'=>'required|string',
            'category'=>'nullable|string|max:255',
            'source'=>'nullable|string|max:255',
        ]);

        try{
            $knowledgeBase=new KnowledgeBase();
            $knowledgeBase->trekking_route_id=$validated['trekking_route_id'];
            $knowledgeBase->title=$validated['title'];
            $knowledgeBase->content=$validated['content'];
            $knowledgeBase->category=$validated['category'];
            $knowledgeBase->source=$validated['source'];
            $knowledgeBase->save();

            return back()->with('success','sucessfully added knowledge to the base');
        }catch(\Exception $e)
        {
            return back()->with('failed','Failed to add knowledge to the base');
        }
    }

    public function update(Request $request, string $id)
    {
        $validated=$request->validate([
            'trekking_route_id'=>'nullable|exists:trekking_route,id',
            'title'=>'required|string|max:255',
            'content'=>'required|string',
            'category'=>'nullable|string|max:255',
            'source'=>'nullable|string|max:255',
        ]);

        try{
            $entry=KnowledgeBase::find($id);
            if(!$entry)
            {
                return back()->with('failed','Knowledge base not found');
            }
            $entry->update($validated);
            return back()->with('success','Knowledge base updated successfully');
        }catch(\Exception $e)
        {
            return back()->with('failed','failed to update knowledge');
        }
    }

    public function destroy(string $id)
    {
        try{
            $entry=KnowledgeBase::find($id);
            if(!$entry)
            {
                return back()->with('failed','Knowledge base not found');
            }
            $entry->delete();
            return back()->with('success','Successfully deleted Knowledge');
        }catch(\Exception $e)
        {
            return back()->with('failed','Failed to delete knowledge');
        }
    }
}
