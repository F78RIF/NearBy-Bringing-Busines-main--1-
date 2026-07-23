<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UmkmResource;
use App\Models\Submission;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UmkmController extends Controller
{
    private const CATEGORIES = ['Kuliner', 'Penginapan', 'Fashion', 'Oleh-Oleh', 'Jasa'];

    private const LOCATIONS = [
        'Balikpapan Kota', 'Balikpapan Utara', 'Balikpapan Selatan',
        'Balikpapan Timur', 'Balikpapan Barat', 'Balikpapan Tengah',
    ];

    /** Public list with ?category= &location= &q= filters. */
    public function index(Request $request)
    {
        $query = Umkm::query()->where('verification', 'disetujui');

        if (($cat = $request->query('category')) && $cat !== 'Semua') {
            $query->where('category', $cat);
        }

        if (($loc = $request->query('location')) && $loc !== 'Semua') {
            $query->where('location', $loc);
        }

        if ($q = $request->query('q')) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('tag', 'like', "%{$q}%")
                    ->orWhere('address', 'like', "%{$q}%");
            });
        }

        $umkms = $query->with('items')->orderByDesc('rating')->get();

        return UmkmResource::collection($umkms);
    }

    /** Detail with menu items and reviews. */
    public function show(Request $request, Umkm $umkm)
    {
        $umkm->increment('views');
        $umkm->load(['items', 'reviews' => fn ($q) => $q->latest()]);

        if ($user = $request->user()) {
            $umkm->is_favorite = $user->favorites()->where('umkm_id', $umkm->id)->exists();
        }

        return new UmkmResource($umkm);
    }

    /** Owner submits a new UMKM (pending verification). */
    public function store(Request $request)
    {
        $data = $this->validateData($request);

        $umkm = Umkm::create([
            ...$data,
            'owner_id' => $request->user()->id,
            'verification' => 'menunggu',
            'status' => 'aktif',
        ]);

        if (! empty($data['items'] ?? [])) {
            $this->syncItems($umkm, $data['items']);
        }

        Submission::create([
            'umkm_id' => $umkm->id,
            'owner_id' => $request->user()->id,
            'name' => $umkm->name,
            'owner_name' => $request->user()->name,
            'category' => $umkm->category,
            'location' => $umkm->location,
            'status' => 'menunggu',
            'checks' => [],
            'files' => [],
        ]);

        return new UmkmResource($umkm->load('items'));
    }

    /** Owner edits their own UMKM. */
    public function update(Request $request, Umkm $umkm)
    {
        $this->authorizeOwner($request, $umkm);

        $data = $this->validateData($request, partial: true);
        $umkm->update($data);

        if (array_key_exists('items', $data)) {
            $this->syncItems($umkm, $data['items']);
        }

        return new UmkmResource($umkm->load('items'));
    }

    /** Soft delete (moves to Trash). */
    public function destroy(Request $request, Umkm $umkm)
    {
        $this->authorizeOwner($request, $umkm);
        $umkm->delete();

        return response()->json(['message' => 'UMKM dipindahkan ke sampah.']);
    }

    private function authorizeOwner(Request $request, Umkm $umkm): void
    {
        $user = $request->user();
        abort_unless($user->role === 'admin' || $umkm->owner_id === $user->id, 403, 'Bukan pemilik UMKM ini.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request, bool $partial = false): array
    {
        $req = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$req, 'string', 'max:255'],
            'category' => [$req, Rule::in(self::CATEGORIES)],
            'location' => [$req, Rule::in(self::LOCATIONS)],
            'price_label' => ['nullable', 'string', 'max:255'],
            'tag' => ['nullable', 'string'],
            'img_label' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'hours' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'ig' => ['nullable', 'string', 'max:255'],
            'list_label' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::in(['aktif', 'libur', 'tutup'])],
            'items' => ['sometimes', 'array'],
            'items.*.name' => ['required_with:items', 'string', 'max:255'],
            'items.*.price' => ['nullable', 'string', 'max:255'],
            'items.*.img' => ['nullable', 'string', 'max:255'],
            'items.*.available' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function syncItems(Umkm $umkm, array $items): void
    {
        $umkm->items()->delete();
        foreach ($items as $item) {
            $umkm->items()->create([
                'name' => $item['name'],
                'price' => $item['price'] ?? null,
                'img' => $item['img'] ?? null,
                'available' => $item['available'] ?? true,
            ]);
        }
    }
}
