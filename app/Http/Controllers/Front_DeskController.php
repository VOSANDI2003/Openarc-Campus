<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FrontDesk;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class Front_DeskController extends Controller
{
    public function index()
    {
        $frontDesks = FrontDesk::all();

        return Inertia::render('front-desk/index', [
            'frontDesks' => $frontDesks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fd_id'     => 'required|string|max:20|unique:frontdesks',
            'full_name' => 'required|string|max:100',
            'email'     => 'required|email|unique:frontdesks',
            'contact'   => 'required|string|max:20',
            'password'  => 'required|string|min:8',
        ]);

        // Create the linked User account for login
        $user = User::create([
            'name'     => $validated['full_name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'frontdesk',
        ]);

        FrontDesk::create([
            'user_id'   => $user->id,
            'fd_id'     => $validated['fd_id'],
            'full_name' => $validated['full_name'],
            'email'     => $validated['email'],
            'contact'   => $validated['contact'],
        ]);

        return redirect()->route('front-desk.index')
                         ->with('success', 'Front Desk staff added successfully!');
    }

    public function update(Request $request, $id)
    {
        $frontDesk = FrontDesk::findOrFail($id);

        $validated = $request->validate([
            'fd_id'     => 'required|string|max:20|unique:frontdesks,fd_id,' . $id,
            'full_name' => 'required|string|max:100',
            'email'     => 'required|email|unique:frontdesks,email,' . $id,
            'contact'   => 'required|string|max:20',
        ]);

        $frontDesk->update($validated);

        // Keep the linked User record in sync
        if ($frontDesk->user) {
            $frontDesk->user->update([
                'name'  => $validated['full_name'],
                'email' => $validated['email'],
            ]);
        }

        return redirect()->route('front-desk.index')
                         ->with('success', 'Front Desk staff updated successfully!');
    }

    public function destroy($id)
    {
        $frontDesk = FrontDesk::findOrFail($id);

        // Deleting the User will cascade-delete the FrontDesk row (see migration)
        if ($frontDesk->user) {
            $frontDesk->user->delete();
        } else {
            $frontDesk->delete();
        }

        return redirect()->route('front-desk.index')
                         ->with('success', 'Front Desk staff deleted successfully!');
    }
}