#!/bin/bash
#
echo "🧹 Removing Laravel Breeze files..."
#
## ── Breeze Auth Controllers ─────────────────────────────────────────────────
rm -f app/Http/Controllers/Auth/AuthenticatedSessionController.php
rm -f app/Http/Controllers/Auth/ConfirmablePasswordController.php
rm -f app/Http/Controllers/Auth/EmailVerificationNotificationController.php
rm -f app/Http/Controllers/Auth/EmailVerificationPromptController.php
rm -f app/Http/Controllers/Auth/NewPasswordController.php
rm -f app/Http/Controllers/Auth/PasswordResetLinkController.php
rm -f app/Http/Controllers/Auth/RegisteredUserController.php
rm -f app/Http/Controllers/Auth/VerifyEmailController.php
# Don't delete the Auth folder itself — our AuthController.php lives there
#
## ── Breeze Routes File ──────────────────────────────────────────────────────
rm -f routes/auth.php
#
## ── Breeze Frontend Pages ───────────────────────────────────────────────────
rm -f resources/js/Pages/Auth/Login.jsx
rm -f resources/js/Pages/Auth/Register.jsx
rm -f resources/js/Pages/Auth/ForgotPassword.jsx
rm -f resources/js/Pages/Auth/ResetPassword.jsx
rm -f resources/js/Pages/Auth/VerifyEmail.jsx
rm -f resources/js/Pages/Auth/ConfirmPassword.jsx
rmdir resources/js/Pages/Auth 2>/dev/null  # remove dir if now empty
#
## ── Breeze Layouts ──────────────────────────────────────────────────────────
rm -f resources/js/Layouts/GuestLayout.jsx
rm -f resources/js/Layouts/AuthenticatedLayout.jsx
#
## ── Breeze Dashboard ────────────────────────────────────────────────────────
rm -f resources/js/Pages/Dashboard.jsx
#
## ── Breeze Profile Pages ────────────────────────────────────────────────────
rm -f resources/js/Pages/Profile/Edit.jsx
rm -f resources/js/Pages/Profile/Partials/UpdatePasswordForm.jsx
rm -f resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx
rm -f resources/js/Pages/Profile/Partials/DeleteUserForm.jsx
rmdir resources/js/Pages/Profile/Partials 2>/dev/null
rmdir resources/js/Pages/Profile 2>/dev/null
#
## ── Breeze ProfileController ────────────────────────────────────────────────
rm -f app/Http/Controllers/ProfileController.php
#
## ── Breeze Requests ─────────────────────────────────────────────────────────
rm -f app/Http/Requests/Auth/LoginRequest.php
rmdir app/Http/Requests/Auth 2>/dev/null
rmdir app/Http/Requests 2>/dev/null  # only if empty
#
# ── Clear caches ─────────────────────────────────────────────────────────────
php artisan route:clear
php artisan view:clear
php artisan cache:clear
composer dump-autoload
#
echo ""
echo "✅ Breeze removed! Your custom auth is now the only auth system."
echo ""
echo "Files kept (your custom code):"
echo "  app/Http/Controllers/Auth/AuthController.php"
echo "  app/Http/Controllers/User/HomeController.php"
echo "  app/Models/User.php"
echo "  routes/web.php"
echo "  resources/js/Pages/Welcome.jsx"
echo "  resources/js/Pages/Admin/Login.jsx"
