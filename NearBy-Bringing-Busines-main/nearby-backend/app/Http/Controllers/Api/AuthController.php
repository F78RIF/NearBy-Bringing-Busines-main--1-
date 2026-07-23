<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /** Register a new account (role: user or owner). */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:40'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', Rule::in(['user', 'owner'])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
            'role' => $data['role'] ?? 'user',
            'status' => ($data['role'] ?? 'user') === 'owner' ? 'menunggu' : 'aktif',
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    /** Log in and return an API token. */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau kata sandi salah.'],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /** Revoke the current access token. */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil keluar.']);
    }

    /** Currently authenticated user. */
    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * List the user's active sessions (Sanctum tokens).
     *
     * Catatan: device & lokasi tidak tersedia karena tidak disimpan saat login
     * (butuh kolom baru di `personal_access_tokens`). Yang tersedia: nama token,
     * waktu dibuat, dan terakhir dipakai.
     */
    public function sessions(Request $request)
    {
        $currentId = $request->user()->currentAccessToken()->id;

        $sessions = $request->user()->tokens()
            ->latest()
            ->get()
            ->map(fn ($token) => [
                'id' => $token->id,
                'name' => $token->name,
                'current' => $token->id === $currentId,
                'lastUsed' => $token->last_used_at?->diffForHumans(),
                'createdAt' => $token->created_at?->translatedFormat('j M Y H:i'),
            ]);

        return response()->json(['sessions' => $sessions]);
    }

    /** Revoke a specific session/token belonging to the user. */
    public function revokeSession(Request $request, int $tokenId)
    {
        $deleted = $request->user()->tokens()->where('id', $tokenId)->delete();

        abort_unless($deleted, 404, 'Sesi tidak ditemukan.');

        return response()->json(['message' => 'Sesi dihentikan.']);
    }

    /**
     * Soft-delete the authenticated user's own account and revoke its tokens.
     *
     * Catatan: pemulihan oleh user sendiri tidak mungkin setelah akun terhapus
     * (tak bisa login). Restore tetap tersedia lewat admin (`/admin/trash`).
     * "Window 30 hari" perlu penjadwalan pembersihan tersendiri (belum ada).
     */
    public function destroyAccount(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Akun dihapus. Dapat dipulihkan admin dalam masa tenggang.']);
    }

    /**
     * Update the authenticated user's profile (name, email, phone).
     *
     * Catatan: foto profil TIDAK disimpan karena belum ada kolom di tabel `users`.
     * Endpoint upload (`POST /api/uploads` folder=profile) tetap bisa dipakai untuk
     * menghasilkan URL, tapi persistensinya menunggu penambahan kolom di DB.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['sometimes', 'nullable', 'string', 'max:40'],
        ]);

        $user->update($data);

        return new UserResource($user->fresh());
    }

    /** Change password from the account page (verifies the current password). */
    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password:sanctum'],
            'password' => ['required', 'string', 'min:6', 'confirmed', 'different:current_password'],
        ]);

        $user = $request->user();
        $user->update(['password' => $data['password']]); // cast 'hashed' meng-hash otomatis

        return response()->json(['message' => 'Kata sandi berhasil diperbarui.']);
    }

    /** Request a password reset link (sent via configured mailer). */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        // Balasan seragam agar tidak membocorkan apakah email terdaftar.
        return response()->json([
            'message' => 'Jika email terdaftar, tautan atur ulang kata sandi telah dikirim.',
            'status' => __($status),
        ]);
    }

    /** Set a new password using the emailed reset token. */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => $password, // cast 'hashed' meng-hash otomatis
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PasswordReset) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['message' => 'Kata sandi berhasil diatur ulang.']);
    }
}
