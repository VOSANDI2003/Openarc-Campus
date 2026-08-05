<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FeePayment;
use App\Models\Student;
use App\Models\Semester;
use Inertia\Inertia;

// This controller handles the fee status page for students, showing their payment history and status.
class FeeStatusController extends Controller
{
public function index()
{
    $user    = auth()->user();
    $student = Student::where('user_id', $user->id)->first();

    // Student registered but not yet added by admin/front desk
    if (!$student) {
        return Inertia::render('fee-status/index', [
            'student' => null,
            'grouped' => [],
        ]);
    }

    $payments = FeePayment::where('student_id', $student->id)
        ->with('semester')
        ->orderBy('semester_id')
        ->orderBy('installment_number')
        ->get();

    $grouped = $payments->groupBy('semester_id')->map(function ($semPayments) {
        $semester  = $semPayments->first()->semester;
        $totalPaid = $semPayments->sum('amount');
        $paidCount = $semPayments->count();
        $fullyPaid = $paidCount === 3;

        return [
            'semester'     => $semester,
            'installments' => $semPayments->values(),
            'total_paid'   => $totalPaid,
            'paid_count'   => $paidCount,
            'fully_paid'   => $fullyPaid,
        ];
    })->values();

    return Inertia::render('fee-status/index', [
        'student' => $student,
        'grouped' => $grouped,
    ]);
}
}
