<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeaHouse extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function routeDay(){
        return $this->belongsTo(RouteDay::class);
    }

    public function trekkingRoute(){
        return $this->routeDay->trekkingRoute;
    }
}
