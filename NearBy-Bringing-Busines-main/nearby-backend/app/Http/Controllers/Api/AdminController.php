<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubmissionResource;
use App\Http\Resources\UmkmResource;
use App\Http\Resources\UserResource;
use App\Models\Review;
use App\Models\Submission;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /** Manage users. */
    public function users()
    {
        return UserResource::collection(User::orderBy('name')->get());
    }

    /** All UMKM (including pending verification). */
    public function umkms()
    {
        return UmkmResource::collection(Umkm::latest()->get());
    }

    /** Verification queue. */
    public function submissions()
    {
        return SubmissionResource::collection(
            Submission::with('owner')->where('status', 'menunggu')->latest()->get()
        );
    }

    /** Approve a submission → the UMKM becomes verified/visible. */
    public function approve(Submission $submission)
    {
        $submission->update(['status' => 'disetujui']);

        if ($submission->umkm) {
            $submission->umkm->update(['verification' => 'disetujui']);
        }
        if ($submission->owner && $submission->owner->status === 'menunggu') {
            $submission->owner->update(['status' => 'aktif']);
        }

        return new SubmissionResource($submission->fresh('owner'));
    }

    /** Reject a submission. */
    public function reject(Submission $submission)
    {
        $submission->update(['status' => 'ditolak']);

        if ($submission->umkm) {
            $submission->umkm->update(['verification' => 'ditolak']);
        }

        return new SubmissionResource($submission->fresh('owner'));
    }

    /** Aggregate report stats. */
    public function reports()
    {
        return response()->json([
            'stats' => [
                'umkmCount' => Umkm::count(),
                'userCount' => User::count(),
                'reviewCount' => Review::count(),
                'avgRating' => round((float) Umkm::avg('rating'), 1),
            ],
            'byCategory' => Umkm::selectRaw('category, count(*) as total')
                ->groupBy('category')->pluck('total', 'category'),
            'byLocation' => Umkm::selectRaw('location, count(*) as total')
                ->groupBy('location')->pluck('total', 'location'),
        ]);
    }

    /** Soft-deleted users and UMKM (Trash). */
    public function trash()
    {
        return response()->json([
            'users' => UserResource::collection(User::onlyTrashed()->get()),
            'umkms' => UmkmResource::collection(Umkm::onlyTrashed()->get()),
        ]);
    }

    /** Restore a soft-deleted UMKM or user. ?type=umkm|user */
    public function restore(Request $request, int $id)
    {
        $type = $request->query('type', 'umkm');

        if ($type === 'user') {
            User::onlyTrashed()->findOrFail($id)->restore();
        } else {
            Umkm::onlyTrashed()->findOrFail($id)->restore();
        }

        return response()->json(['message' => 'Berhasil dipulihkan.']);
    }
}
