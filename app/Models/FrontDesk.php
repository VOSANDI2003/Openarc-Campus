<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// This model represents a front desk user in the system, 
// linking to the User model for authentication and storing additional front desk-specific information.
class FrontDesk extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'frontdesks'; // add this line

    protected $fillable = [
        'user_id',
        'fd_id',
        'full_name',
        'email',
        'contact',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}