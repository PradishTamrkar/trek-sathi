<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\TeaHouse;
use App\Models\TrekkingRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\CloudinaryService;

class AdminTeaHouseController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary){}

    public function index()
    {
        return Inertia::render('Admin/TeaHouses/Index', [
            'teaHouses' => TeaHouse::with([
                'trekkingRoute:id,trekking_route_name',
                'region:id,region_name',
            ])->latest()->get(),

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
            'tea_house_images'=>'nullable|image|mime:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['has_electricity'] = $validated['has_electricity'] ?? false;
        $validated['has_wifi']        = $validated['has_wifi']        ?? false;

        try {
            $teaHouse=new TeaHouse();
            $teaHouse->house_name=$validated['house_name'];
            $teaHouse->location=$validated['location'];
            $teaHouse->altitude_location=$validated['altitude_location'];
            $teaHouse->cost_per_night=$validated['cost_per_night'];
            $teaHouse->has_electricity=$validated['has_electricity'];
            $teaHouse->has_wifi=$validated['has_wifi'];
            $teaHouse->trekking_route_id=$validated['trekking_route_id'];
            $teaHouse->region_id=$validated['region_id'];
            if($request->hasFile('tea_house_images')){
                $validated['tea_house_images']=$this->cloudinary->upload
                (
                    $request->file('tea_house_images'),
                    'trek-sathi/teaHouses'
                );
            }else{
                $validated['tea_house_images']=null;
            }
            $teaHouse->save();

            return back()->with('success', 'Successfully Created Tea House');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to create Tea House');
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
            if($request->hasFile('tea_house_images')){
                //delete old image from cloudinary
                if($teaHouse->tea_house_images){
                    $this->cloudinary->delete($teaHouse->tea_house_images);
                }
                $validated['tea_house_images']=$this->cloudinary->upload(
                    $request->file('tea_house_images'),
                    'trek-sathi/teaHouses'
                );
            }else{
                unset($validated['tea_house_images']);
            }
            $teaHouse->update($validated);
            return back()->with('success', 'Successfully Updated Tea House');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to update Tea House');
        }
    }

    public function destroy(string $id)
    {
        $teaHouse = TeaHouse::find($id);
        if (!$teaHouse) {
            return back()->with('failed', 'Tea House Not Found');
        }
        try {
            if ($teaHouse->tea_house_images) {
                $this->cloudinary->delete($teaHouse->tea_house_images);
            }
            $teaHouse->delete();
            return back()->with('success', 'Successfully Deleted Tea House');
        } catch (\Exception $e) {
            return back()->with('failed', 'Failed to delete Tea House');
        }
    }
}
