<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UmkmResource;
use App\Models\Umkm;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /** List the user's favorite UMKM. */
    public function index(Request $request)
    {
        $umkms = $request->user()->favorites()->get();

        return UmkmResource::collection($umkms);
    }

    /** Toggle favorite status for a UMKM. */
    public function toggle(Request $request, Umkm $umkm)
    {
        $result = $request->user()->favorites()->toggle($umkm->id);
        $isFavorite = ! empty($result['attached']);

        return response()->json([
            'umkmId' => $umkm->id,
            'isFavorite' => $isFavorite,
        ]);
    }
}
