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
     * Find the correct active semester for a student.
     * Matches by semester number in semester_name, falls back to any active semester.
     */
    private function getStudentSemester(Student $student): ?Semester
    {
        // First try to find an active semester that has payments for this student
        $semesterWithPayment = Semester::where('is_active', true)
            ->whereHas('feePayments', function ($q) use ($student) {
                $q->where('student_id', $student->id);
            })
            ->first();

        if ($semesterWithPayment) {
            return $semesterWithPayment;
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
    /*public function index()
    {
        $user    = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        $semester = $this->getStudentSemester($student);

        // Format dates
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
    }*/

    /**
     * Student confirms enrollment.
     * Requires at least 1 installment paid.
     */
    public function store(Request $request)
    {
        $user    = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Use same semester detection logic as index()
        $semester = $this->getStudentSemester($student);

        if (!$semester) {
            return back()->withErrors([
                'enrollment' => 'No active semester found. Please contact the admin.',
            ]);
        }

        // At least 1 installment must be paid
        $paidCount = FeePayment::where('student_id', $student->id)
            ->where('semester_id', $semester->id)
            ->count();

        if ($paidCount < 1) {
            return back()->withErrors([
                'enrollment' => 'You must pay at least the first installment before enrolling.',
            ]);
        }

        // Check if already enrolled
        $existing = Enrollment::where('student_id', $student->id)
            ->where('semester_id', $semester->id)
            ->first();

        if ($existing) {
            return back()->withErrors([
                'enrollment' => 'You are already enrolled for this semester.',
            ]);
        }

        // Create enrollment
        Enrollment::create([
            'student_id'      => $student->id,
            'semester_id'     => $semester->id,
            'enrollment_date' => now()->toDateString(),
            'status'          => 'enrolled',
        ]);

        // Auto-update student semester level
        $student->update([
            'current_semester' => $student->current_semester + 1,
        ]);

        return redirect()->route('enrollment.index')
                         ->with('success', 'You have successfully enrolled for ' . $semester->semester_name . '!');
    }
}