<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::all();

        return Inertia::render('student/index', [
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'index_no'         => 'required|string|max:20|unique:students',
            'full_name'        => 'required|string|max:100',
            'email'            => 'required|email|unique:students',
            'contact'          => 'required|string|max:20',
            'current_semester' => 'required|integer|min:1|max:8',
            'password'         => 'nullable|string|min:8',
        ]);

        DB::transaction(function () use ($validated) {
            // Check if user already exists (self-registered)
            $user = User::where('email', $validated['email'])->first();

            if ($user) {
                // Already registered — just ensure role is student
                $user->update(['role' => 'student']);
            } else {
                // New user — create account
                $user = User::create([
                    'name'     => $validated['full_name'],
                    'email'    => $validated['email'],
                    'password' => Hash::make($validated['password'] ?? str()->random(12)),
                    'role'     => 'student',
                ]);
            }

            Student::create([
                'user_id'          => $user->id,
                'index_no'         => $validated['index_no'],
                'full_name'        => $validated['full_name'],
                'email'            => $validated['email'],
                'contact'          => $validated['contact'],
                'current_semester' => $validated['current_semester'],
            ]);
        });

        return redirect()->route('student.index')
                         ->with('success', 'Student added successfully!');
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'index_no'         => 'required|string|max:20|unique:students,index_no,' . $id,
            'full_name'        => 'required|string|max:100',
            'email'            => 'required|email|unique:students,email,' . $id,
            'contact'          => 'required|string|max:20',
            'current_semester' => 'required|integer|min:1|max:8',
        ]);

        DB::transaction(function () use ($student, $validated) {
            $student->update($validated);

            $student->user?->update([
                'name'  => $validated['full_name'],
                'email' => $validated['email'],
            ]);
        });

        return redirect()->route('student.index')
                         ->with('success', 'Student updated successfully!');
    }

    public function destroy($id)
    {
        $student = Student::with('user')->findOrFail($id);

        $student->user?->delete() ?? $student->delete();

        return redirect()->route('student.index')
                         ->with('success', 'Student deleted successfully!');
    }
}