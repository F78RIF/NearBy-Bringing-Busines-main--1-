<?php

namespace App\Services;

use InvalidArgumentException;

/**
 * Kalkulator HPP, estimasi porsi, rekomendasi harga jual, dan masa tahan.
 *
 * Murni rule-based: aritmetika + lookup table dari config/food_rules.php.
 * Tidak ada panggilan ke layanan AI mana pun.
 *
 * Kelas ini sengaja bebas dari Eloquent dan Request supaya gampang dites
 * dan bisa dipakai ulang (preview tanpa simpan maupun saat menyimpan).
 */
class HppCalculator
{
    /**
     * @param  array{
     *     category: string,
     *     storage?: string,
     *     margin_percent?: int|float|null,
     *     yield_servings?: int|null,
     *     serving_weight_grams?: int|float|null,
     *     ingredients: array<int, array{name: string, qty: int|float, unit: string, price: int|float}>
     * }  $input
     * @return array<string, mixed>
     */
    public function calculate(array $input): array
    {
        $category = $input['category'];
        $rules = $this->categoryRules($category);
        $storage = $input['storage'] ?? 'suhu_ruang';

        $ingredients = $this->normalizeIngredients($input['ingredients'] ?? []);

        $totalCost = round(array_sum(array_column($ingredients, 'price')), 2);
        $totalWeight = round(array_sum(array_column($ingredients, 'weight_grams')), 2);

        // Berat per porsi: pakai override penjual kalau ada, kalau tidak ambil
        // standar kategori. Guard > 0 mencegah pembagian nol.
        $servingWeight = (float) ($input['serving_weight_grams'] ?? $rules['serving_grams']);
        if ($servingWeight <= 0) {
            $servingWeight = (float) $rules['serving_grams'];
        }

        // Bahan bersatuan pcs/butir tidak punya berat, jadi kalau SEMUA bahan
        // seperti itu totalWeight = 0 dan porsi mustahil diestimasi dari berat.
        $countableOnly = $totalWeight <= 0 && $ingredients !== [];

        $estimatedServings = $countableOnly
            ? null
            : max(1, (int) floor($totalWeight / $servingWeight));

        // Override manual menang atas hasil hitung — dan jadi satu-satunya
        // sumber angka kalau semua bahan bersatuan butir.
        $overrideServings = $input['yield_servings'] ?? null;
        $yieldServings = $overrideServings !== null && (int) $overrideServings > 0
            ? (int) $overrideServings
            : ($estimatedServings ?? 1);

        $costPerServing = round($totalCost / $yieldServings, 2);

        $margin = $this->normalizeMargin($input['margin_percent'] ?? null);
        $suggestedPrice = $this->suggestedPrice($costPerServing, $margin);

        $shelfLifeHours = $rules['shelf_life'][$storage] ?? null;

        return [
            'category' => $category,
            'storage' => $storage,
            'ingredients' => $ingredients,

            'total_cost' => $totalCost,
            'total_weight_grams' => $totalWeight,
            'serving_weight_grams' => $servingWeight,
            'yield_servings' => $yieldServings,
            'estimated_servings' => $estimatedServings,
            'servings_overridden' => $overrideServings !== null && (int) $overrideServings > 0,
            'cost_per_serving' => $costPerServing,

            'margin_percent' => $margin,
            'suggested_price' => $suggestedPrice,
            'profit_per_serving' => round($suggestedPrice - $costPerServing, 2),
            // Margin sesungguhnya SETELAH pembulatan ke Rp500. Bisa berbeda
            // jauh dari margin yang diminta pada harga kecil — mis. HPP Rp600
            // dengan margin 0% tetap dibulatkan jadi Rp1.000 (margin riil 40%).
            // Ditampilkan supaya penjual tahu angka yang sebenarnya berlaku.
            'effective_margin_percent' => $suggestedPrice > 0
                ? round((($suggestedPrice - $costPerServing) / $suggestedPrice) * 100, 1)
                : 0.0,

            'shelf_life_hours' => $shelfLifeHours,
            'shelf_life_label' => $this->humanizeHours($shelfLifeHours),
            'shelf_life_note' => $rules['note'] ?? null,

            'warnings' => $this->warnings($ingredients, $countableOnly, $shelfLifeHours, $storage, $category),
        ];
    }

    /** Daftar kategori + aturannya, untuk mengisi dropdown di frontend. */
    public function rules(): array
    {
        $categories = [];

        foreach (config('food_rules.categories') as $name => $rule) {
            $categories[] = [
                'name' => $name,
                'serving_grams' => $rule['serving_grams'],
                'note' => $rule['note'] ?? null,
                'shelf_life' => collect($rule['shelf_life'])
                    ->map(fn ($hours) => [
                        'hours' => $hours,
                        'label' => $this->humanizeHours($hours),
                    ])
                    ->all(),
            ];
        }

        return [
            'categories' => $categories,
            'storages' => [
                ['value' => 'suhu_ruang', 'label' => 'Suhu ruang'],
                ['value' => 'kulkas', 'label' => 'Kulkas'],
                ['value' => 'freezer', 'label' => 'Freezer'],
            ],
            'units' => array_merge(
                array_keys(config('food_rules.units')),
                config('food_rules.countable_units'),
            ),
            'countable_units' => config('food_rules.countable_units'),
            'pricing' => config('food_rules.pricing'),
        ];
    }

    /** Nama kategori yang valid — dipakai controller untuk Rule::in(). */
    public function categoryNames(): array
    {
        return array_keys(config('food_rules.categories'));
    }

    public function unitNames(): array
    {
        return array_merge(
            array_keys(config('food_rules.units')),
            config('food_rules.countable_units'),
        );
    }

    /**
     * Konversi tiap bahan ke gram dan bulatkan harganya.
     *
     * @param  array<int, array<string, mixed>>  $ingredients
     * @return array<int, array<string, mixed>>
     */
    private function normalizeIngredients(array $ingredients): array
    {
        $factors = config('food_rules.units');

        return array_values(array_map(function (array $row) use ($factors) {
            $unit = strtolower(trim((string) $row['unit']));
            $qty = (float) $row['qty'];

            // Satuan tak dikenal (pcs/butir/lembar) -> berat 0, bukan error:
            // bahannya tetap sah dan tetap masuk hitungan HPP.
            $weight = isset($factors[$unit]) ? $qty * $factors[$unit] : 0.0;

            return [
                'name' => trim((string) $row['name']),
                'qty' => round($qty, 2),
                'unit' => $unit,
                'weight_grams' => round($weight, 2),
                'price' => round((float) $row['price'], 2),
            ];
        }, $ingredients));
    }

    private function normalizeMargin(int|float|null $margin): int
    {
        $pricing = config('food_rules.pricing');

        if ($margin === null) {
            return (int) $pricing['default_margin_percent'];
        }

        // Batas atas mencegah pembagi (1 - margin/100) mendekati nol, yang
        // akan meledakkan harga jual jadi angka tak masuk akal.
        return (int) max(0, min((float) $margin, (float) $pricing['max_margin_percent']));
    }

    /**
     * Harga jual = HPP per porsi / (1 - margin), dibulatkan KE ATAS ke
     * kelipatan Rp500 supaya enak ditransaksikan tunai.
     *
     * Margin di sini margin atas harga jual (markup on selling price), bukan
     * markup atas modal — jadi margin 35% berarti 35% dari harga jual adalah
     * laba kotor.
     */
    private function suggestedPrice(float $costPerServing, int $marginPercent): float
    {
        $rounding = (int) config('food_rules.pricing.rounding');
        $divisor = 1 - ($marginPercent / 100);

        // margin 100% mustahil (pembagi 0); normalizeMargin sudah membatasi,
        // tapi guard ini menjaga kalau config diubah orang lain.
        $raw = $divisor > 0 ? $costPerServing / $divisor : $costPerServing;

        return $rounding > 0 ? (float) (ceil($raw / $rounding) * $rounding) : round($raw, 2);
    }

    /** 4 -> "4 jam", 48 -> "2 hari", 504 -> "3 minggu" */
    private function humanizeHours(?int $hours): ?string
    {
        if ($hours === null) {
            return null;
        }

        if ($hours < 24) {
            return $hours.' jam';
        }

        $days = $hours / 24;

        if ($days < 7) {
            return $this->trimNumber($days).' hari';
        }

        if ($days < 30) {
            return $this->trimNumber($days / 7).' minggu';
        }

        return $this->trimNumber($days / 30).' bulan';
    }

    private function trimNumber(float $value): string
    {
        return rtrim(rtrim(number_format($value, 1, ',', ''), '0'), ',');
    }

    /**
     * Peringatan yang perlu dibaca penjual. Sengaja dikembalikan sebagai data,
     * bukan dilempar sebagai error — hasil hitungnya tetap sah, penjual hanya
     * perlu tahu batasannya.
     *
     * @param  array<int, array<string, mixed>>  $ingredients
     * @return array<int, string>
     */
    private function warnings(array $ingredients, bool $countableOnly, ?int $shelfLifeHours, string $storage, string $category): array
    {
        $warnings = [];

        $countable = array_filter($ingredients, fn ($i) => $i['weight_grams'] <= 0);

        if ($countableOnly) {
            $warnings[] = 'Semua bahan memakai satuan yang tidak bisa dikonversi ke gram (mis. butir/pcs), '
                .'jadi jumlah porsi tidak bisa diestimasi dari berat. Isi jumlah porsi secara manual.';
        } elseif ($countable !== []) {
            $names = implode(', ', array_column($countable, 'name'));
            $warnings[] = "Bahan bersatuan butir/pcs ({$names}) tetap dihitung di HPP, "
                .'tapi tidak masuk berat total — jadi estimasi porsinya sedikit lebih kasar.';
        }

        if ($shelfLifeHours === null) {
            $storageLabel = ['suhu_ruang' => 'suhu ruang', 'kulkas' => 'kulkas', 'freezer' => 'freezer'][$storage] ?? $storage;
            $warnings[] = "Kategori \"{$category}\" tidak dianjurkan disimpan di {$storageLabel}.";
        }

        if ($ingredients === []) {
            $warnings[] = 'Belum ada bahan yang diisi.';
        }

        return $warnings;
    }

    /** @return array<string, mixed> */
    private function categoryRules(string $category): array
    {
        $rules = config("food_rules.categories.{$category}");

        if ($rules === null) {
            throw new InvalidArgumentException("Kategori makanan tidak dikenal: {$category}");
        }

        return $rules;
    }
}
