<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lecturer;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class LecturerController extends Controller
{
    public function index()
    {
        $lecturers = Lecturer::all();

        return Inertia::render('lecturer/index', [
            'lecturers' => $lecturers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lecturer_id' => 'required|string|max:20|unique:lecturers',
            'full_name'   => 'required|string|max:100',
            'email'       => 'required|email|unique:lecturers',
            'contact'     => 'required|string|max:20',
            'subject'  => 'required|string|max:100',
            'password'    => 'required|string|min:8',
        ]);

        // Create the linked User account for login
        $user = User::create([
            'name'     => $validated['full_name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'lecturer',
        ]);

        Lecturer::create([
            'user_id'     => $user->id,
            'lecturer_id' => $validated['lecturer_id'],
            'full_name'   => $validated['full_name'],
            'email'       => $validated['email'],
            'contact'     => $validated['contact'],
            'subject'  => $validated['subject'],
        ]);

        return redirect()->route('lecturer.index')
                         ->with('success', 'Lecturer added successfully!');
    }

    public function update(Request $request, $id)
    {
        $lecturer = Lecturer::findOrFail($id);

        $validated = $request->validate([
            'lecturer_id' => 'required|string|max:20|unique:lecturers,lecturer_id,' . $id,
            'full_name'   => 'required|string|max:100',
            'email'       => 'required|email|unique:lecturers,email,' . $id,
            'contact'     => 'required|string|max:20',
            'subject'  => 'required|string|max:100',
        ]);

        $lecturer->update($validated);

        // Keep the linked User record in sync
        if ($lecturer->user) {
            $lecturer->user->update([
                'name'  => $validated['full_name'],
                'email' => $validated['email'],
            ]);
        }

        return redirect()->route('lecturer.index')
                         ->with('success', 'Lecturer updated successfully!');
    }

    public function destroy($id)
    {
        $lecturer = Lecturer::findOrFail($id);

        // Deleting the User will cascade-delete the Lecturer row (see migration)
        if ($lecturer->user) {
            $lecturer->user->delete();
        } else {
            $lecturer->delete();
        }

        return redirect()->route('lecturer.index')
                         ->with('success', 'Lecturer deleted successfully!');
    }
}