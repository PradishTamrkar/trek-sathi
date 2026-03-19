<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\TeaHouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTeaHouseController extends Controller
{
    public function show(string $id)
    {
        $teaHouse=TeaHouse::with([
            'trekkingRoute'=>function($q){
                $q->with('regions');
            },
        ])->find($id);

        if(!$teaHouse)
        {
            return redirect()->route('home')->with('failed','Failed to find the tea house');
        }

        return Inertia::render('User/TeaHouses/Show',[
            'teaHouse'=>$teaHouse,
        ]);
    }
}
