<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeaHouse extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function trekkingRoute(){
        return $this->belongsTo(TrekkingRoute::class);
    }

    public function region(){
        return $this->belongsTo(Region::class);
    }
}
