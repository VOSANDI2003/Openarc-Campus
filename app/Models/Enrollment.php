<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// This model represents an enrollment record, 
// linking a student to a specific semester and tracking their enrollment status.
class Enrollment extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'student_id',
        'semester_id',
        'enrollment_date',
        'status',
    ];

    protected $casts = [
        'enrollment_date' => 'date:Y-m-d',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}