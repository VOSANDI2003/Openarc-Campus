<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    // ── Relationships ──────────────────────────────────────────────────────────

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