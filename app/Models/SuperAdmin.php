<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// This model represents a super admin user in the system, 
// linking to the User model for authentication and storing additional super admin-specific information.
class SuperAdmin extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'employee_id',
        'full_name',
        'email',
        'access_level',
    ];

    // Relationships 

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}