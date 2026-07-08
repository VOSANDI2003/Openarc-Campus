<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'semester_name',
        'academic_year',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
    'start_date' => 'date:Y-m-d',
    'end_date'   => 'date:Y-m-d',
    'is_active'  => 'boolean',
];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }
}