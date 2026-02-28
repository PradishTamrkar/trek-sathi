<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrekkingRoute extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function regions(){
        return $this->belongsTo(Region::class);
    }

    public function routeDays(){
        return $this->hasMany(RouteDay::class);
    }

    public function permits(){
        return $this->hasMany(Permit::class);
    }

    public function savedTrips(){
        return $this->hasMany(SavedTrip::class);
    }

    public function communitySubmission(){
        return $this->hasMany(CommunitySubmission::class);
    }

    public function knowledgeBase(){
        return $this->hasMany(KnowledgeBase::class);
    }

    public function teaHouse(){
        return $this->hasManyThrough(TeaHouse::class ,RouteDay::class);
    }
}
