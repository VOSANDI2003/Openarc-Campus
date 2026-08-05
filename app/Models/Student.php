<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// This model represents a student in the system, 
// linking to the User model for authentication and storing additional student information.
class Student extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'index_no',
        'full_name',
        'email',
        'contact',
        'current_semester',
    ];

    // Relationships 
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }
}