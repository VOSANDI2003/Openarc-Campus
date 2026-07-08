<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $admins = Admin::all();

        return Inertia::render('admin/index', [
            'admins' => $admins,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|max:20|unique:admins',
            'full_name'   => 'required|string|max:100',
            'email'       => 'required|email|unique:admins',
            'password'    => 'required|string|min:8',
        ]);

        // Create the linked User account for login
        $user = User::create([
            'name'     => $validated['full_name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'admin',
        ]);

        Admin::create([
            'user_id'     => $user->id,
            'employee_id' => $validated['employee_id'],
            'full_name'   => $validated['full_name'],
            'email'       => $validated['email'],
        ]);

        return redirect()->route('admin.index')
                         ->with('success', 'Admin added successfully!');
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'required|string|max:20|unique:admins,employee_id,' . $id,
            'full_name'   => 'required|string|max:100',
            'email'       => 'required|email|unique:admins,email,' . $id,
        ]);

        $admin->update($validated);

        // Keep the linked User record in sync
        if ($admin->user) {
            $admin->user->update([
                'name'  => $validated['full_name'],
                'email' => $validated['email'],
            ]);
        }

        return redirect()->route('admin.index')
                         ->with('success', 'Admin updated successfully!');
    }

    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);

        // Deleting the User will cascade-delete the Admin row (see migration)
        if ($admin->user) {
            $admin->user->delete();
        } else {
            $admin->delete();
        }

        return redirect()->route('admin.index')
                         ->with('success', 'Admin deleted successfully!');
    }
}