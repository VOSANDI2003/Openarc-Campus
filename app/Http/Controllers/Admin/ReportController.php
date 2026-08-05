<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    /**
     * C.1 Student List Report
     */
    public function studentList(Request $request)
    {
        $search = $request->query('search');
        $semester = $request->query('semester');

        $students = Student::query()
            ->select('id', 'index_no', 'full_name', 'contact', 'email', 'current_semester')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                      ->orWhere('index_no', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($semester, fn ($q, $semester) => $q->where('current_semester', $semester))
            ->orderBy('index_no')
            ->get();

        $availableSemesters = Student::query() 
            ->select('current_semester')
            ->distinct()
            ->orderBy('current_semester')
            ->pluck('current_semester');

        return Inertia::render('admin/reports/students', [
            'students'  => $students,
            'filters'   => ['search' => $search, 'semester' => $semester],
            'total'     => $students->count(),
            'semesters' => $availableSemesters,
        ]);
    }

    /**
     * Helper: count students currently on this semester,
     * based purely on students.current_semester (not the enrollments table).
     */
    private function countCurrentlyEnrolled(Semester $semester): int
    {
        preg_match('/\d+/', $semester->semester_name, $matches);
        $semesterNumber = $matches[0] ?? null;

        if ($semesterNumber === null) {
            return 0;
        }

        return Student::where('current_semester', $semesterNumber)->count();
    }

    /**
     * C.2 Enrollment Summary Report
     * "Enrolled" = students whose current_semester matches this semester right now.
     */
    public function enrollmentSummary(Request $request)
    {
        $academicYear = $request->query('academic_year');

        $semesters = Semester::query()
            ->select('id', 'semester_name', 'academic_year', 'start_date', 'end_date', 'is_active')
            ->when($academicYear, fn ($q, $year) => $q->where('academic_year', $year))
            ->orderBy('start_date')
            ->get();

        $semesters->each(function ($semester) {
            $semester->enrolled_count = $this->countCurrentlyEnrolled($semester);
        });

        $academicYears = Semester::query()
            ->select('academic_year')
            ->distinct()
            ->orderByDesc('academic_year')
            ->pluck('academic_year');

        return Inertia::render('admin/reports/enrollment-summary', [
            'semesters'     => $semesters,
            'academicYears' => $academicYears,
            'filters'       => ['academic_year' => $academicYear],
            'totalEnrolled' => $semesters->sum('enrolled_count'),
        ]);
    }

    /**
     * C.1 Student List Report — PDF download
     */
    public function downloadStudentListPdf(Request $request)
    {
        $search = $request->query('search');
        $semester = $request->query('semester');

        $students = Student::query()
            ->select('id', 'index_no', 'full_name', 'contact', 'email', 'current_semester')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                      ->orWhere('index_no', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($semester, fn ($q, $semester) => $q->where('current_semester', $semester))
            ->orderBy('index_no')
            ->get();

        $pdf = Pdf::loadView('reports.students-pdf', [
            'students' => $students,
        ]);

        return $pdf->download('student-list-report.pdf');
    }

    /**
     * C.2 Enrollment Summary Report — PDF download
     */
    public function downloadEnrollmentSummaryPdf(Request $request)
    {
        $academicYear = $request->query('academic_year');

        $semesters = Semester::query()
            ->select('id', 'semester_name', 'academic_year', 'start_date', 'end_date', 'is_active')
            ->when($academicYear, fn ($q, $year) => $q->where('academic_year', $year))
            ->orderBy('start_date')
            ->get();

        $semesters->each(function ($semester) {
            $semester->enrolled_count = $this->countCurrentlyEnrolled($semester);
        });

        $pdf = Pdf::loadView('reports.enrollment-summary-pdf', [
            'semesters'     => $semesters,
            'academicYear'  => $academicYear,
            'totalEnrolled' => $semesters->sum('enrolled_count'),
        ]);

        return $pdf->download('enrollment-summary-report.pdf');
    }
}