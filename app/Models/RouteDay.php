<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteDay extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function trekkingRoute(){
        return $this->belongsTo(TrekkingRoute::class);
    }

    public function teaHouse(){
        return $this->hasMany(TeaHouse::class);
    }
}
