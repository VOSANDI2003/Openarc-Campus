<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// This model represents an admin user in the system, 
// linking to the User model for authentication and storing additional admin-specific information.
class Admin extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'employee_id',
        'full_name',
        'email',
    ];

    //Relationships 

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}