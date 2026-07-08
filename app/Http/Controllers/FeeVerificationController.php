<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FeePayment;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Semester;
use Inertia\Inertia;

class FeeVerificationController extends Controller
{
    public function index()
    {
        $semesters = Semester::orderBy('semester_level')->get();

        return Inertia::render('fee-verification/index', [
            'semesters'        => $semesters,
            'selectedSemester' => null,
            'student'          => null,
            'payments'         => [],
            'success'          => session('success'),
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'index_no'    => 'required|string',
            'semester_id' => 'required|integer|exists:semesters,id',
        ]);

        $semesters = Semester::orderBy('semester_level')->get();
        $semester  = Semester::findOrFail($request->semester_id);
        $student   = Student::where('index_no', $request->index_no)->first();

        if (!$student) {
            return back()->withErrors(['index_no' => 'No student found with that ID.']);
        }

        $payments = FeePayment::where('student_id', $student->id)
            ->where('semester_id', $semester->id)
            ->orderBy('installment_number')
            ->get();

        return Inertia::render('fee-verification/index', [
            'semesters'        => $semesters,
            'selectedSemester' => $semester,
            'student'          => $student,
            'payments'         => $payments,
            'success'          => null,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'student_id'   => 'required|integer|exists:students,id',
            'semester_id'  => 'required|integer|exists:semesters,id',
            'payment_type' => 'required|in:installment,full',
            'amount'       => 'required|numeric|min:0',
            'valid_from'   => 'required|date',
            'valid_to'     => 'required|date|after:valid_from',
        ]);

        if ($request->payment_type === 'installment') {
            $request->validate([
                'installment_number' => 'required|integer|in:1,2,3',
            ]);
        }

        $semester = Semester::findOrFail($request->semester_id);
        $student  = Student::findOrFail($request->student_id);

        DB::transaction(function () use ($request, $semester, $student) {

            // ── 1. Record payment(s) ────────────────────────────────────────
            if ($request->payment_type === 'full') {
                $splitAmount = round($request->amount / 3, 2);
                foreach ([1, 2, 3] as $num) {
                    FeePayment::updateOrCreate(
                        [
                            'student_id'         => $student->id,
                            'semester_id'        => $semester->id,
                            'installment_number' => $num,
                        ],
                        [
                            'amount'        => $num === 3
                                ? $request->amount - ($splitAmount * 2)
                                : $splitAmount,
                            'valid_from'    => $request->valid_from,
                            'valid_to'      => $request->valid_to,
                            'is_paid'       => true,
                            'verified_by'   => auth()->id(),
                            'verified_date' => now()->toDateString(),
                        ]
                    );
                }
            } else {
                FeePayment::updateOrCreate(
                    [
                        'student_id'         => $student->id,
                        'semester_id'        => $semester->id,
                        'installment_number' => $request->installment_number,
                    ],
                    [
                        'amount'        => $request->amount,
                        'valid_from'    => $request->valid_from,
                        'valid_to'      => $request->valid_to,
                        'is_paid'       => true,
                        'verified_by'   => auth()->id(),
                        'verified_date' => now()->toDateString(),
                    ]
                );
            }

            // ── 2. Enroll student in the semester if not already enrolled ───
            // Triggered by any payment (installment 1, or full payment).
            // updateOrCreate prevents duplicate enrollment records.
            Enrollment::updateOrCreate(
                [
                    'student_id'  => $student->id,
                    'semester_id' => $semester->id,
                ],
                [
                    'enrollment_date' => now()->toDateString(),
                    'status'          => 'enrolled',
                ]
            );

            // ── 3. Update student's active semester ─────────────────────────
            // Only promote current_semester if the paid semester is ahead
            // of what the student is currently on, preventing accidental
            // downgrades (e.g. paying a missed old-semester installment).
            if ($semester->semester_level > $student->current_semester) {
                $student->update([
                    'current_semester' => $semester->semester_level,
                ]);
            }
        });

        // Reload fresh data after transaction
        $student  = Student::find($request->student_id);
        $payments = FeePayment::where('student_id', $student->id)
            ->where('semester_id', $semester->id)
            ->orderBy('installment_number')
            ->get();

        $semesters = Semester::orderBy('semester_level')->get();

        return Inertia::render('fee-verification/index', [
            'semesters'        => $semesters,
            'selectedSemester' => $semester,
            'student'          => $student,
            'payments'         => $payments,
            'success'          => 'Payment recorded and student enrolled in semester successfully!',
        ]);
    }
}