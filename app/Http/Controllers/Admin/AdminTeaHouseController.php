<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\TeaHouse;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTeaHouseController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/TeaHouses/Index', [  // FIX: was 'Admin/TeaHouse/Index' (singular)
            'teaHouses' => TeaHouse::with([
                'trekkingRoute:id,trekking_route_name',
                'region:id,region_name',
            ])->latest()->get(),

            // FIX: these were missing — JSX needs them for the create/edit dropdowns
            'routes'  => TrekkingRoute::orderBy('trekking_route_name')->get(['id', 'trekking_route_name']),
            'regions' => Region::orderBy('region_name')->get(['id', 'region_name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_name'        => 'required|string|max:255',
            'location'          => 'nullable|string|max:255',
            'altitude_location' => 'nullable|integer|min:0',
            'cost_per_night'    => 'nullable|numeric|min:0',
            'has_electricity'   => 'boolean',
            'has_wifi'          => 'boolean',
            'trekking_route_id' => 'nullable|exists:trekking_routes,id',
            'region_id'         => 'nullable|exists:regions,id',
        ]);

        $validated['has_electricity'] = $validated['has_electricity'] ?? false;
        $validated['has_wifi']        = $validated['has_wifi']        ?? false;

        try {
            TeaHouse::create($validated);
            return back()->with('success', 'Successfully Created Tea House');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to create Tea House: ' . $e->getMessage());
        }
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'house_name'        => 'required|string|max:255',
            'location'          => 'nullable|string|max:255',
            'altitude_location' => 'nullable|integer|min:0',
            'cost_per_night'    => 'nullable|numeric|min:0',
            'has_electricity'   => 'boolean',
            'has_wifi'          => 'boolean',
            'trekking_route_id' => 'nullable|exists:trekking_routes,id',
            'region_id'         => 'nullable|exists:regions,id',
        ]);

        $validated['has_electricity'] = $validated['has_electricity'] ?? false;
        $validated['has_wifi']        = $validated['has_wifi']        ?? false;

        try {
            $teaHouse = TeaHouse::find($id);
            if (!$teaHouse) {
                return back()->with('failed', 'Tea House Not Found');
            }
            $teaHouse->update($validated);
            return back()->with('success', 'Successfully Updated Tea House');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to update Tea House: ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            $teaHouse = TeaHouse::find($id);
            if (!$teaHouse) {
                return back()->with('failed', 'Tea House Not Found');
            }
            $teaHouse->delete();
            return back()->with('success', 'Successfully Deleted Tea House');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to delete Tea House: ' . $e->getMessage());
        }
    }
}
