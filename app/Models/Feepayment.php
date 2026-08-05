<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// This model represents a fee payment record, 
// linking a student to a specific semester and tracking their payment details.
class FeePayment extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'student_id',
        'semester_id',
        'installment_number',
        'amount',
        'valid_from',
        'valid_to',
        'is_paid',
        'verified_by',
        'verified_date',
    ];

    protected $casts = [
        'is_paid'       => 'boolean',
        'valid_from'    => 'date:Y-m-d',
        'valid_to'      => 'date:Y-m-d',
        'verified_date' => 'date:Y-m-d',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}