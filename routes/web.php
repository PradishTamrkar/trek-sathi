<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\TrekkingRouteController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\User\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//public routes
Route::get('/', function () {
    return Inertia::render('Welcome');
});

//admin routes
Route::middleware(['auth','admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard',[DashboardController::class,'index'])->name('dashboard');
    // Route::resource('/regions',RegionController::class);
    // Route::resource('/trekkingRoutes',TrekkingRouteController::class);
});

//user routes
Route::middleware(['auth'])->group(function (){
    // Route::get('/home',[HomeController::class,'index'])->name('home');
});

