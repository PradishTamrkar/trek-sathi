<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTrekkingRouteController extends Controller
{
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
            'trekking_images'      => 'nullable|string',
        ]);

        $validated['permit_required'] = $validated['permit_required'] ?? false;

        try {
            TrekkingRoute::create($validated);
            return back()->with('success', 'Trekking Route created successfully');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to create Trekking Route: ' . $e->getMessage());
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
            'trekking_images'      => 'nullable|string',
        ]);

        $validated['permit_required'] = $validated['permit_required'] ?? false;

        try {
            $trekkingRoute = TrekkingRoute::find($id);

            if (!$trekkingRoute) {
                return back()->with('failed', 'Trekking Route not found');
            }

            $trekkingRoute->update($validated);

            return back()->with('success', 'Trekking Route updated successfully');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to update Trekking Route: ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            $trekkingRoute = TrekkingRoute::find($id);

            if (!$trekkingRoute) {
                return back()->with('failed', 'Trekking Route not found');
            }

            $trekkingRoute->delete();
            return back()->with('success', 'Trekking Route deleted successfully');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to delete Trekking Route: ' . $e->getMessage());
        }
    }
}
