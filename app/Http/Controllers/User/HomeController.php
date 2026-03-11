<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Public landing page — accessible by guests and logged-in users.
     * Inertia shares auth.user automatically via HandleInertiaRequests.
     */
    public function welcome()
    {
        return Inertia::render('User/Home');
    }

    /**
     * Authenticated user home — redirected here after login.
     */
    public function index()
    {
        return Inertia::render('User/Home');
    }
}