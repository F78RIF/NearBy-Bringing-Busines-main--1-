<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UmkmItemResource;
use App\Models\Umkm;
use App\Models\UmkmItem;
use Illuminate\Http\Request;

class UmkmItemController extends Controller
{
    /** Owner adds a menu/product item to their UMKM. */
    public function store(Request $request, Umkm $umkm)
    {
        $this->authorizeOwner($request, $umkm);

        $data = $this->validateData($request);
        $item = $umkm->items()->create($data);

        return new UmkmItemResource($item);
    }

    /** Owner updates a single menu/product item. */
    public function update(Request $request, UmkmItem $item)
    {
        $this->authorizeOwner($request, $item->umkm);

        $data = $this->validateData($request, partial: true);
        $item->update($data);

        return new UmkmItemResource($item->fresh());
    }

    /** Owner deletes a single menu/product item. */
    public function destroy(Request $request, UmkmItem $item)
    {
        $this->authorizeOwner($request, $item->umkm);
        $item->delete();

        return response()->json(['message' => 'Item dihapus.']);
    }

    private function authorizeOwner(Request $request, ?Umkm $umkm): void
    {
        $user = $request->user();
        abort_unless(
            $umkm && ($user->role === 'admin' || $umkm->owner_id === $user->id),
            403,
            'Bukan pemilik UMKM ini.'
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request, bool $partial = false): array
    {
        $req = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$req, 'string', 'max:255'],
            'price' => ['nullable', 'string', 'max:255'],
            'img' => ['nullable', 'string', 'max:255'],
            'available' => ['nullable', 'boolean'],
        ]);
    }
}
