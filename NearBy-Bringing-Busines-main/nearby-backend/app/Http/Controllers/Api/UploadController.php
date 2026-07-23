<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UploadController extends Controller
{
    /**
     * Folders yang diizinkan. Satu titik untuk semua fitur:
     * foto UMKM, foto menu, foto profil, dokumen verifikasi (SIUP/KTP), media review.
     */
    private const FOLDERS = ['umkm', 'menu', 'profile', 'verification', 'review'];

    /**
     * Layanan upload terpusat.
     *
     * POST /api/uploads   (multipart/form-data)
     *   file   : gambar/pdf (wajib)
     *   folder : salah satu dari FOLDERS (opsional, default "umkm")
     *
     * Mengembalikan { path, url } — simpan `path` (atau `url`) ke kolom string
     * yang sudah ada (mis. umkm.img_label, umkm_items.img). Pengganti base64
     * client-side dengan file tersimpan di server (disk "public").
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
            'folder' => ['nullable', Rule::in(self::FOLDERS)],
        ]);

        $folder = $data['folder'] ?? 'umkm';

        // Disk "public" agar bisa diakses lewat URL (butuh `php artisan storage:link`).
        $path = $request->file('file')->store($folder, 'public');

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
