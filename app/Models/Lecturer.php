<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// This model represents a lecturer in the system, 
// linking to the User model for authentication and storing additional lecturer-specific information.
class Lecturer extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'lecturer_id',
        'full_name',
        'email',
        'contact',
        'subject',
    ];

    // Relationships 

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}