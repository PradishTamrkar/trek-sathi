<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\Admin\AdminTrekkingRouteController;
use App\Http\Controllers\Admin\AdminRegionController;
use App\Http\Controllers\Admin\AdminSubmissionController;
use App\Http\Controllers\Admin\AdminTeaHouseController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminKnowledgeBaseContoller;
use App\Http\Controllers\Admin\AdminRouteDayController;
use App\Http\Controllers\Admin\AdminPermitController;
use App\Http\Controllers\User\ChatController;
use App\Http\Controllers\User\UserRegionController;
use App\Http\Controllers\User\UserTeaHouseController;
use App\Http\Controllers\User\UserTrekkingRouteController;
use App\Http\Controllers\User\UserContactController;
use App\Models\ChatSession;
use Illuminate\Support\Facades\Route;

// Public landing
Route::get('/', [HomeController::class, 'welcome'])->name('welcome');
Route::resource('/contact',UserContactController::class)->only(['index','store']);
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
    Route::resource('/submissions',AdminSubmissionController::class)->only(['index','update','destory']);
    Route::resource('/users',AdminUserController::class)->only(['index','destroy']);
    Route::resource('/teaHouses',AdminTeaHouseController::class)->only(['index','store','update','destroy']);
    Route::resource('/contacts',AdminContactController::class)->only(['index','destroy']);
    Route::resource('/knowledgeBase',AdminKnowledgeBaseContoller::class)->only('index','store','update','destory');
    Route::get('/trekkingRoutes/{trekkingRoute}/days',[AdminRouteDayController::class, 'index'])->name('trekkingRoutes.days.index');
    Route::post('/trekkingRoutes/{trekkingRoute}/days',[AdminRouteDayController::class, 'store'])->name('trekkingRoutes.days.store');
    Route::put('/trekkingRoutes/{trekkingRoute}/days/{day}',[AdminRouteDayController::class, 'update'])->name('trekkingRoutes.days.update');
    Route::delete('/trekkingRoutes/{trekkingRoute}/days/{day}',[AdminRouteDayController::class, 'destroy'])->name('trekkingRoutes.days.destroy');
    Route::get(   '/trekkingRoutes/{trekkingRoute}/permits',[AdminPermitController::class, 'index'  ])->name('trekkingRoutes.permits.index');
    Route::post(  '/trekkingRoutes/{trekkingRoute}/permits',[AdminPermitController::class, 'store'  ])->name('trekkingRoutes.permits.store');
    Route::put(   '/trekkingRoutes/{trekkingRoute}/permits/{permit}',[AdminPermitController::class, 'update' ])->name('trekkingRoutes.permits.update');
    Route::delete('/trekkingRoutes/{trekkingRoute}/permits/{permit}',[AdminPermitController::class, 'destroy'])->name('trekkingRoutes.permits.destroy');
});

// User protected
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/regions/{id}',[UserRegionController::class,'show'])->name('regions.show');
    Route::get('trekkingRoutes/{id}',[UserTrekkingRouteController::class,'show'])->name('trekkingRoute.show');
    Route::get('/teaHouses/{id}',[UserTeaHouseController::class,'show'])->name('teaHouse.show');
    Route::get('/chat',[ChatController::class,'index'])->name('chat.index');
    Route::get('/chat/{session}',[ChatSession::class,'show'])->name('chat.show');
});
