<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SuperAdmin;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class Super_AdminController extends Controller
{
    public function index()
    {
        $superAdmins = SuperAdmin::all();

        return Inertia::render('super-admin/index', [
            'superAdmins' => $superAdmins,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id'  => 'required|string|max:20|unique:super_admins',
            'full_name'    => 'required|string|max:100',
            'email'        => 'required|email|unique:super_admins',
            'access_level' => 'required|string|max:50',
            'password'     => 'required|string|min:8',
        ]);

        // Create the linked User account for login
        $user = User::create([
            'name'     => $validated['full_name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'super_admin',
        ]);

        SuperAdmin::create([
            'user_id'      => $user->id,
            'employee_id'  => $validated['employee_id'],
            'full_name'    => $validated['full_name'],
            'email'        => $validated['email'],
            'access_level' => $validated['access_level'],
        ]);

        return redirect()->route('super-admin.index')
                         ->with('success', 'Super Admin added successfully!');
    }

    public function update(Request $request, $id)
    {
        $superAdmin = SuperAdmin::findOrFail($id);

        $validated = $request->validate([
            'employee_id'  => 'required|string|max:20|unique:super_admins,employee_id,' . $id,
            'full_name'    => 'required|string|max:100',
            'email'        => 'required|email|unique:super_admins,email,' . $id,
            'access_level' => 'required|string|max:50',
        ]);

        $superAdmin->update($validated);

        // Keep the linked User record in sync
        if ($superAdmin->user) {
            $superAdmin->user->update([
                'name'  => $validated['full_name'],
                'email' => $validated['email'],
            ]);
        }

        return redirect()->route('super-admin.index')
                         ->with('success', 'Super Admin updated successfully!');
    }

    public function destroy($id)
    {
        $superAdmin = SuperAdmin::findOrFail($id);

        // Deleting the User will cascade-delete the SuperAdmin row (see migration)
        if ($superAdmin->user) {
            $superAdmin->user->delete();
        } else {
            $superAdmin->delete();
        }

        return redirect()->route('super-admin.index')
                         ->with('success', 'Super Admin deleted successfully!');
    }
}