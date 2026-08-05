<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Semester;
use Inertia\Inertia;

// This controller handles the management of semesters, allowing admins to create, update, activate/deactivate, and delete semester records.
class SemesterController extends Controller
{
    public function index()
    {
        $semesters = Semester::orderBy('created_at', 'asc')->get();

        return Inertia::render('semester/index', [
            'semesters' => $semesters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'semester_name' => 'required|string|max:100',
            'academic_year' => 'required|string|max:20',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after:start_date',
        ]);

        Semester::create([
            'semester_name' => $validated['semester_name'],
            'academic_year' => $validated['academic_year'],
            'start_date'    => $validated['start_date'],
            'end_date'      => $validated['end_date'],
            'is_active'     => false,
        ]);

        return redirect()->route('semester.index')
                         ->with('success', 'Semester created successfully!');
    }

    public function update(Request $request, $id)
    {
        $semester = Semester::findOrFail($id);

        $validated = $request->validate([
            'semester_name' => 'required|string|max:100',
            'academic_year' => 'required|string|max:20',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after:start_date',
        ]);

        $semester->update($validated);

        return redirect()->route('semester.index')
                         ->with('success', 'Semester updated successfully!');
    }

    /**
     * Toggle active/inactive for a single semester independently.
     */
    public function toggleActive($id)
    {
        $semester = Semester::findOrFail($id);
        $semester->update(['is_active' => !$semester->is_active]);

        $status = $semester->is_active ? 'activated' : 'deactivated';

        return redirect()->route('semester.index')
                         ->with('success', $semester->semester_name . ' has been ' . $status . '.');
    }

    public function destroy($id)
    {
        $semester = Semester::findOrFail($id);

        if ($semester->is_active) {
            return redirect()->route('semester.index')
                             ->withErrors(['semester' => 'Cannot delete an active semester. Please deactivate it first.']);
        }

        $semester->delete();

        return redirect()->route('semester.index')
                         ->with('success', 'Semester deleted successfully!');
    }
}