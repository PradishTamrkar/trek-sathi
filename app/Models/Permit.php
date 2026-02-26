<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permit extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function trekkingRoute(){
        $this->belongsTo(TrekkingRoute::class);
    }
}
