<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use App\Models\Umkm;
use App\Services\HppCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RecipeController extends Controller
{
    public function __construct(private readonly HppCalculator $calculator)
    {
    }

    /** Kategori, satuan, dan aturan masa tahan — untuk mengisi form di frontend. */
    public function rules()
    {
        return response()->json($this->calculator->rules());
    }

    /**
     * Hitung tanpa menyimpan. Dipakai untuk pratinjau langsung saat penjual
     * masih mengetik, supaya tidak mengotori tabel dengan resep percobaan.
     */
    public function calculate(Request $request)
    {
        $data = $this->validateData($request);

        return response()->json($this->calculator->calculate($data));
    }

    /** Daftar resep milik owner yang sedang login. */
    public function index(Request $request)
    {
        $recipes = Recipe::query()
            ->where('owner_id', $request->user()->id)
            ->with('ingredients')
            ->latest()
            ->get();

        return RecipeResource::collection($recipes);
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $this->authorizeUmkm($request, $data['umkm_id'] ?? null);

        $result = $this->calculator->calculate($data);

        // Transaksi: resep tanpa bahannya (atau sebaliknya) adalah data rusak.
        $recipe = DB::transaction(function () use ($request, $data, $result) {
            $recipe = Recipe::create([
                'owner_id' => $request->user()->id,
                'umkm_id' => $data['umkm_id'] ?? null,
                'name' => $data['name'],
                'category' => $result['category'],
                'storage' => $result['storage'],
                'total_weight_grams' => $result['total_weight_grams'],
                'serving_weight_grams' => $result['serving_weight_grams'],
                'yield_servings' => $result['yield_servings'],
                'total_cost' => $result['total_cost'],
                'cost_per_serving' => $result['cost_per_serving'],
                'margin_percent' => $result['margin_percent'],
                'suggested_price' => $result['suggested_price'],
                'shelf_life_hours' => $result['shelf_life_hours'],
                'shelf_life_note' => $result['shelf_life_note'],
            ]);

            $recipe->ingredients()->createMany($result['ingredients']);

            return $recipe;
        });

        return (new RecipeResource($recipe->load('ingredients')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Recipe $recipe)
    {
        $this->authorizeOwner($request, $recipe);

        return new RecipeResource($recipe->load('ingredients'));
    }

    public function update(Request $request, Recipe $recipe)
    {
        $this->authorizeOwner($request, $recipe);

        $data = $this->validateData($request);
        $this->authorizeUmkm($request, $data['umkm_id'] ?? null);

        $result = $this->calculator->calculate($data);

        DB::transaction(function () use ($recipe, $data, $result) {
            $recipe->update([
                'umkm_id' => $data['umkm_id'] ?? null,
                'name' => $data['name'],
                'category' => $result['category'],
                'storage' => $result['storage'],
                'total_weight_grams' => $result['total_weight_grams'],
                'serving_weight_grams' => $result['serving_weight_grams'],
                'yield_servings' => $result['yield_servings'],
                'total_cost' => $result['total_cost'],
                'cost_per_serving' => $result['cost_per_serving'],
                'margin_percent' => $result['margin_percent'],
                'suggested_price' => $result['suggested_price'],
                'shelf_life_hours' => $result['shelf_life_hours'],
                'shelf_life_note' => $result['shelf_life_note'],
            ]);

            // Ganti total: bahan tidak punya identitas stabil dari sisi form.
            $recipe->ingredients()->delete();
            $recipe->ingredients()->createMany($result['ingredients']);
        });

        return new RecipeResource($recipe->load('ingredients'));
    }

    public function destroy(Request $request, Recipe $recipe)
    {
        $this->authorizeOwner($request, $recipe);
        $recipe->delete();

        return response()->json(['message' => 'Resep dihapus.']);
    }

    /**
     * Validasi bersama untuk calculate/store/update.
     *
     * @return array<string, mixed>
     */
    private function validateData(Request $request): array
    {
        $isCalculateOnly = $request->routeIs('recipes.calculate');

        return $request->validate([
            // Pratinjau belum butuh nama; penyimpanan wajib punya.
            'name' => [$isCalculateOnly ? 'nullable' : 'required', 'string', 'max:255'],
            'umkm_id' => ['nullable', 'integer', 'exists:umkms,id'],
            'category' => ['required', 'string', Rule::in($this->calculator->categoryNames())],
            'storage' => ['nullable', Rule::in(['suhu_ruang', 'kulkas', 'freezer'])],
            'margin_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'yield_servings' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'serving_weight_grams' => ['nullable', 'numeric', 'min:1'],

            'ingredients' => ['required', 'array', 'min:1', 'max:100'],
            'ingredients.*.name' => ['required', 'string', 'max:255'],
            'ingredients.*.qty' => ['required', 'numeric', 'min:0.01'],
            'ingredients.*.unit' => ['required', 'string', Rule::in($this->calculator->unitNames())],
            'ingredients.*.price' => ['required', 'numeric', 'min:0'],
        ], [
            // Pesan bawaan Laravel berbahasa Inggris, sedangkan seluruh UI
            // aplikasi ini berbahasa Indonesia — pesan error yang muncul ke
            // penjual harus ikut bahasa yang sama.
            'name.required' => 'Nama makanan wajib diisi.',
            'category.required' => 'Kategori makanan wajib dipilih.',
            'category.in' => 'Kategori makanan tidak dikenal.',
            'storage.in' => 'Cara penyimpanan tidak valid.',
            'margin_percent.numeric' => 'Margin harus berupa angka.',
            'margin_percent.min' => 'Margin tidak boleh kurang dari 0%.',
            'margin_percent.max' => 'Margin tidak boleh lebih dari 100%.',
            'yield_servings.min' => 'Jumlah porsi minimal 1.',
            'umkm_id.exists' => 'UMKM yang dipilih tidak ditemukan.',
            'ingredients.required' => 'Isi minimal satu bahan.',
            'ingredients.min' => 'Isi minimal satu bahan.',
            'ingredients.max' => 'Bahan terlalu banyak (maksimal 100).',
            'ingredients.*.name.required' => 'Nama bahan wajib diisi.',
            'ingredients.*.qty.required' => 'Jumlah bahan wajib diisi.',
            'ingredients.*.qty.min' => 'Jumlah bahan harus lebih dari 0.',
            'ingredients.*.unit.required' => 'Satuan bahan wajib dipilih.',
            'ingredients.*.unit.in' => 'Satuan bahan tidak dikenal.',
            'ingredients.*.price.required' => 'Harga bahan wajib diisi.',
            'ingredients.*.price.min' => 'Harga bahan tidak boleh negatif.',
        ]);
    }

    /** Resep hanya boleh diakses pemiliknya (admin boleh semuanya). */
    private function authorizeOwner(Request $request, Recipe $recipe): void
    {
        $user = $request->user();
        abort_unless(
            $user->role === 'admin' || $recipe->owner_id === $user->id,
            403,
            'Bukan pemilik resep ini.'
        );
    }

    /** Cegah menautkan resep ke UMKM milik orang lain. */
    private function authorizeUmkm(Request $request, ?int $umkmId): void
    {
        if ($umkmId === null) {
            return;
        }

        $user = $request->user();
        $umkm = Umkm::findOrFail($umkmId);

        abort_unless(
            $user->role === 'admin' || $umkm->owner_id === $user->id,
            403,
            'Bukan pemilik UMKM ini.'
        );
    }
}
