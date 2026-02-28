<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    // ── Admin Login Page ──────────────────────────────────────────────────────
    public function adminLoginPage(): Response
    {
        return Inertia::render('Admin/Login');
    }

    // ── Admin Login Handler ───────────────────────────────────────────────────
    public function adminLogin(Request $request): RedirectResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !$user->isAdmin() || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid admin credentials.',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->route('admin.dashboard');
    }

    // ── User Login Handler (modal POST) ───────────────────────────────────────
    public function userLogin(Request $request): RedirectResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'These credentials do not match our records.',
            ]);
        }

        if (Auth::user()->isAdmin()) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Please use the admin login portal.',
            ]);
        }

        $request->session()->regenerate();
        return redirect()->route('home');
    }

    // ── User Register Handler (modal POST) ────────────────────────────────────
    public function userRegister(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'end-user',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home');
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    public function logout(Request $request): RedirectResponse
    {
        $isAdmin = Auth::check() && Auth::user()->isAdmin();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $isAdmin
            ? redirect()->route('admin.login')
            : redirect()->route('welcome');
    }
}
