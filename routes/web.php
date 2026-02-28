<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\User\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Public ────────────────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// ── Guest-only (redirect away if already logged in) ───────────────────────────
Route::middleware('guest')->group(function () {
    // Admin login page + handler
    Route::get('/admin/login',  [AuthController::class, 'adminLoginPage'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'adminLogin'])->name('admin.login.post');

    // User login + register (modal-based POST only — no dedicated login page)
    Route::post('/login',    [AuthController::class, 'userLogin'])->name('user.login');
    Route::post('/register', [AuthController::class, 'userRegister'])->name('user.register');
});

// ── Logout ────────────────────────────────────────────────────────────────────
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ── Admin protected ───────────────────────────────────────────────────────────
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Route::resource('/regions', RegionController::class);
    // Route::resource('/trekkingRoutes', TrekkingRouteController::class);
});

// ── User protected ────────────────────────────────────────────────────────────
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
});
