<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function messages()
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at','asc');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function latestMessage()
    {
        return $this->hasOne(ChatMessage::class)->latestOfMany();
    }
}
