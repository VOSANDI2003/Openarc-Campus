<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Super_AdminController;
use App\Http\Controllers\Front_DeskController;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\FeeVerificationController;
use App\Http\Controllers\FeeStatusController;
use App\Http\Controllers\SemesterController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        $student = null;
        $lecturer = null;

        if (auth()->user()->role === 'student') {
            $student = \App\Models\Student::where('user_id', auth()->id())->first();
        }

        if (auth()->user()->role === 'lecturer') {
        $lecturer = \App\Models\Lecturer::where('user_id', auth()->id())->first();
    }

        return Inertia::render('dashboard', [
            'student' => $student,
            'lecturer' => $lecturer,
        ]);
    })->name('dashboard');

    // Admin
    Route::get('/admins',         [AdminController::class, 'index'])->name('admin.index');
    Route::post('/admins',        [AdminController::class, 'store'])->name('admin.store');
    Route::put('/admins/{id}',    [AdminController::class, 'update'])->name('admin.update');
    Route::delete('/admins/{id}', [AdminController::class, 'destroy'])->name('admin.destroy');

    // Super Admin
    Route::get('/super-admins',         [Super_AdminController::class, 'index'])->name('super-admin.index');
    Route::post('/super-admins',        [Super_AdminController::class, 'store'])->name('super-admin.store');
    Route::put('/super-admins/{id}',    [Super_AdminController::class, 'update'])->name('super-admin.update');
    Route::delete('/super-admins/{id}', [Super_AdminController::class, 'destroy'])->name('super-admin.destroy');

    // Front Desk
    Route::get('/front-desks',         [Front_DeskController::class, 'index'])->name('front-desk.index');
    Route::post('/front-desks',        [Front_DeskController::class, 'store'])->name('front-desk.store');
    Route::put('/front-desks/{id}',    [Front_DeskController::class, 'update'])->name('front-desk.update');
    Route::delete('/front-desks/{id}', [Front_DeskController::class, 'destroy'])->name('front-desk.destroy');

    // Lecturer
    Route::get('/lecturers',         [LecturerController::class, 'index'])->name('lecturer.index');
    Route::post('/lecturers',        [LecturerController::class, 'store'])->name('lecturer.store');
    Route::put('/lecturers/{id}',    [LecturerController::class, 'update'])->name('lecturer.update');
    Route::delete('/lecturers/{id}', [LecturerController::class, 'destroy'])->name('lecturer.destroy');

    // Student
    Route::get('/students',         [StudentController::class, 'index'])->name('student.index');
    Route::post('/students',        [StudentController::class, 'store'])->name('student.store');
    Route::put('/students/{id}',    [StudentController::class, 'update'])->name('student.update');
    Route::delete('/students/{id}', [StudentController::class, 'destroy'])->name('student.destroy');

    // Enrollment
    Route::get('/enrollment',  [EnrollmentController::class, 'index'])->name('enrollment.index');
    Route::post('/enrollment', [EnrollmentController::class, 'store'])->name('enrollment.store');

    //Fee Verification
    Route::get('/fee-verification',          [FeeVerificationController::class, 'index'])->name('fee-verification.index');
    Route::post('/fee-verification/search',  [FeeVerificationController::class, 'search'])->name('fee-verification.search');
    Route::get('/fee-verification/search',   [FeeVerificationController::class, 'index'])->name('fee-verification.search.get');
    Route::post('/fee-verification/verify',  [FeeVerificationController::class, 'verify'])->name('fee-verification.verify');

    // Fee Status
    Route::get('/fee-status', [FeeStatusController::class, 'index'])->name('fee-status.index');

    // Semester
    Route::get('/semesters',              [SemesterController::class, 'index'])->name('semester.index');
    Route::post('/semesters',             [SemesterController::class, 'store'])->name('semester.store');
    Route::put('/semesters/{id}',         [SemesterController::class, 'update'])->name('semester.update');
    Route::put('/semesters/{id}/toggle',  [SemesterController::class, 'toggleActive'])->name('semester.toggle');
    Route::delete('/semesters/{id}',      [SemesterController::class, 'destroy'])->name('semester.destroy');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';