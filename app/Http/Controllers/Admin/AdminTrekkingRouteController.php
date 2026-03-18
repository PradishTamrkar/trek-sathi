<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\CloudinaryService;

class AdminTrekkingRouteController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary){}

    public function index()
    {
        return Inertia::render('Admin/TrekkingRoutes/Index', [
            'trekkingRoutes'=>TrekkingRoute::with('regions')->get(),
            'regions'=>Region::orderBy('region_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'region_id'            => 'required|exists:regions,id',
            'trekking_route_name'  => 'required|string|max:255',
            'difficulty'           => 'required|in:easy,moderate,hard,hellmode',
            'duration_days'        => 'required|integer|min:1',
            'max_altitude'         => 'required|integer|min:0',
            'best_season'          => 'required|string|max:255',
            'permit_required'      => 'boolean',
            'trekking_description' => 'nullable|string',
            'trekking_images'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['permit_required'] = $validated['permit_required'] ?? false;

        try {
            $trekkingRoute=new TrekkingRoute();
            $trekkingRoute->region_id=$validated['region_id'];
            $trekkingRoute->trekking_route_name=$validated['trekking_route_name'];
            $trekkingRoute->difficulty=$validated['difficulty'];
            $trekkingRoute->duration_days=$validated['duration_days'];
            $trekkingRoute->max_altitude=$validated['max_altitude'];
            $trekkingRoute->best_season=$validated['best_season'];
            $trekkingRoute->permit_required=$validated['permit_required'];
            $trekkingRoute->trekking_description=$validated['trekking_description'];
            if($request->hasFile('trekking_images')){
                $validated['trekking_images']=$this->cloudinary->upload
                (
                    $request->file('trekking_images'),
                    'trek-sathi/trekkingRoutes'
                );
            }else{
                $validated['trekking_images']=null;
            }
            $trekkingRoute->save();
            return back()->with('success', 'Trekking Route created successfully');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to create Trekking Route:');
        }
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'region_id'            => 'required|exists:regions,id',
            'trekking_route_name'  => 'required|string|max:255',
            'difficulty'           => 'required|in:easy,moderate,hard,hellmode',
            'duration_days'        => 'required|integer|min:1',
            'max_altitude'         => 'required|integer|min:0',
            'best_season'          => 'required|string|max:255',
            'permit_required'      => 'boolean',
            'trekking_description' => 'nullable|string',
            'trekking_images'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['permit_required'] = $validated['permit_required'] ?? false;

        try {
            $trekkingRoute = TrekkingRoute::find($id);

            if (!$trekkingRoute) {
                return back()->with('failed', 'Trekking Route not found');
            }
            if($request->hasFile('trekking_images')){
                //delete old image from cloudinary
                if($trekkingRoute->trekking_images){
                    $this->cloudinary->delete($trekkingRoute->trekking_images);
                }
                $validated['trekking_images']=$this->cloudinary->upload(
                    $request->file('trekking_images'),
                    'trek-sathi/trekkingRoutes'
                );
            }else{
                unset($validated['trekking_images']);
            }
            $trekkingRoute->update($validated);

            return back()->with('success', 'Trekking Route updated successfully');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to update Trekking Route: ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        $trekkingRoute = TrekkingRoute::find($id);

        if (!$trekkingRoute) {
            return back()->with('failed', 'Trekking Route not found');
        }
        try {
             // Clean up Cloudinary image
            if ($trekkingRoute->trekking_images) {
                $this->cloudinary->delete($trekkingRoute->trekking_images);
            }
            $trekkingRoute->delete();
            return back()->with('success', 'Trekking Route deleted successfully');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to delete Trekking Route: ' . $e->getMessage());
        }
    }
}
