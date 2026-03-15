<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\Admin\AdminTrekkingRouteController;
use App\Http\Controllers\Admin\AdminRegionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public landing — renders User/Home (handles guest + auth state itself)
Route::get('/', [HomeController::class, 'welcome'])->name('welcome');

// Redirect away if already logged in
Route::middleware('guest')->group(function () {
    Route::get('/admin/login',  [AuthController::class, 'adminLoginPage'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'adminLogin'])->name('admin.login.post');
    Route::post('/login',       [AuthController::class, 'userLogin'])->name('user.login');
    Route::post('/register',    [AuthController::class, 'userRegister'])->name('user.register');
});

// Logout
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Admin protected
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('/regions',AdminRegionController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('/trekkingRoutes',AdminTrekkingRouteController::class)->only(['index', 'store', 'update', 'destroy']);
});

// User protected
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
});
