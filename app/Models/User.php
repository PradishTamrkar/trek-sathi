<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'=>'hashed',
    ];

    //check if user is admin
    public function isAdmin(){
        return $this->role === 'admin';
    }

    public function savedTrips(){
        return $this->hasMany(SavedTrip::class);
    }

    public function chatHistory(){
        return $this->hasMany(ChatHistory::class);
    }

    public function communitySubmission(){
        return $this->hasMany(CommunitySubmission::class);
    }
}
