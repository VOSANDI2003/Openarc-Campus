<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Enrollment;
use App\Models\Semester;
use App\Models\Student;
use App\Models\FeePayment;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    /**
     * Find the correct active semester for a student — the one tied to
     * their MOST RECENT fee payment, not just any semester they've ever paid for.
     */
    private function getStudentSemester(Student $student): ?Semester
    {
        $latestPayment = FeePayment::where('student_id', $student->id)
            ->orderByDesc('created_at')
            ->first();

        if ($latestPayment) {
            $semester = Semester::where('is_active', true)
                ->where('id', $latestPayment->semester_id)
                ->first();

            if ($semester) {
                return $semester;
            }
        }

        // Otherwise match by semester number in name
        $matched = Semester::where('is_active', true)
            ->where('semester_name', 'like', '%' . $student->current_semester . '%')
            ->first();

        if ($matched) {
            return $matched;
        }

        // Fall back to first active semester
        return Semester::where('is_active', true)->first();
    }

    /**
     * Student views the enrollment page.
     */
    public function index()
    {
        $user    = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        $semester = $this->getStudentSemester($student);

        if ($semester) {
            $semester->start_date = $semester->start_date->format('Y-m-d');
            $semester->end_date   = $semester->end_date->format('Y-m-d');
        }

        $alreadyEnrolled = false;
        $enrollment      = null;
        $payments        = collect();
        $paidCount       = 0;
        $fullyPaid       = false;
        $canEnroll       = false;

        if ($semester) {
            $enrollment = Enrollment::where('student_id', $student->id)
                ->where('semester_id', $semester->id)
                ->first();

            $alreadyEnrolled = (bool) $enrollment;

            $payments = FeePayment::where('student_id', $student->id)
                ->where('semester_id', $semester->id)
                ->orderBy('installment_number')
                ->get();

            $paidCount = $payments->count();
            $fullyPaid = $paidCount === 3;
            $canEnroll = $paidCount >= 1;
        }

        return Inertia::render('enrollment/index', [
            'student'         => $student,
            'semester'        => $semester,
            'alreadyEnrolled' => $alreadyEnrolled,
            'canEnroll'       => $canEnroll,
            'fullyPaid'       => $fullyPaid,
            'paidCount'       => $paidCount,
            'payments'        => $payments,
            'enrollment'      => $enrollment,
        ]);
    }

    /**
     * Student confirms enrollment.
     * Requires at least 1 installment paid.
     */
    public function store(Request $request)
    {
        $user    = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        $semester = $this->getStudentSemester($student);

        if (!$semester) {
            return back()->withErrors([
                'enrollment' => 'No active semester found. Please contact the admin.',
            ]);
        }

        $paidCount = FeePayment::where('student_id', $student->id)
            ->where('semester_id', $semester->id)
            ->count();

        if ($paidCount < 1) {
            return back()->withErrors([
                'enrollment' => 'You must pay at least the first installment before enrolling.',
            ]);
        }

        $existing = Enrollment::where('student_id', $student->id)
            ->where('semester_id', $semester->id)
            ->first();

        if ($existing) {
            return back()->withErrors([
                'enrollment' => 'You are already enrolled for this semester.',
            ]);
        }

        Enrollment::create([
            'student_id'      => $student->id,
            'semester_id'     => $semester->id,
            'enrollment_date' => now()->toDateString(),
            'status'          => 'enrolled',
        ]);

        // Only promote if this semester is actually ahead of current —
        // same safeguard as FeeVerificationController::verify(), so both
        // paths behave consistently and can't double-increment.
        if ($semester->semester_level > $student->current_semester) {
            $student->update([
                'current_semester' => $semester->semester_level,
            ]);
        }

        return redirect()->route('enrollment.index')
                         ->with('success', 'You have successfully enrolled for ' . $semester->semester_name . '!');
    }
}