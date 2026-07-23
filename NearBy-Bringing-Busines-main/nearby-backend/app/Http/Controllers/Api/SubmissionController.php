<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubmissionResource;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubmissionController extends Controller
{
    /**
     * Attach a legality document / photo to a submission.
     *
     * Alurnya: unggah dulu lewat `POST /api/uploads` (folder=verification),
     * lalu kirim `path` hasilnya ke sini. Entri ditambahkan ke JSON `files`
     * yang sudah ada (bentuk {name, kind, ok, meta, path}) — tanpa perubahan DB.
     */
    public function attachFile(Request $request, Submission $submission)
    {
        $user = $request->user();
        abort_unless(
            $user->role === 'admin' || $submission->owner_id === $user->id,
            403,
            'Bukan pemilik pengajuan ini.'
        );

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'kind' => ['required', Rule::in(['image', 'doc'])],
            'path' => ['required', 'string', 'max:2048'],
            'meta' => ['nullable', 'string', 'max:255'],
        ]);

        $files = $submission->files ?? [];

        $entry = [
            'name' => $data['name'],
            'kind' => $data['kind'],
            'ok' => true,
            'meta' => $data['meta'] ?? 'Terunggah',
            'path' => $data['path'],
        ];

        // Ganti entri dengan nama sama bila sudah ada (mis. unggah ulang KTP/SIUP).
        $replaced = false;
        foreach ($files as $i => $file) {
            if (($file['name'] ?? null) === $entry['name']) {
                $files[$i] = $entry;
                $replaced = true;
                break;
            }
        }
        if (! $replaced) {
            $files[] = $entry;
        }

        $submission->update(['files' => $files]);

        return new SubmissionResource($submission->fresh('owner'));
    }
}
