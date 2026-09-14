/**
 * ## KALKULATOR HPP & MASA TAHAN (tipe data)
 *
 * ## Pengertian:
 * Tipe untuk fitur hitung Harga Pokok Penjualan (HPP) dan perkiraan masa
 * tahan makanan. Ini satu-satunya fitur yang benar-benar membaca/menulis ke
 * database lewat API Laravel.
 *
 * ## Alur:
 * Owner membuka tab Kalkulator → aturan dimuat dari `GET /food-rules` →
 * bahan diisi → `POST /hpp/calculate` mengembalikan `HppResult` →
 * bila disimpan, `POST /recipes` mengembalikan `Recipe`.
 *
 * Catatan bentuk data: mengikuti response API Laravel — snake_case untuk
 * endpoint /hpp/calculate (hasil hitung mentah), camelCase untuk resource
 * /recipes.
 */

export type StorageMode = 'suhu_ruang' | 'kulkas' | 'freezer'

/** Satu baris bahan di form. `price` = total harga untuk qty tersebut. */
export interface IngredientInput {
  name: string
  qty: number | string
  unit: string
  price: number | string
}

export interface FoodCategoryRule {
  name: string
  serving_grams: number
  note: string | null
  shelf_life: Record<StorageMode, { hours: number | null; label: string | null }>
}

/** Aturan rule-based dari server (GET /food-rules). */
export interface FoodRules {
  categories: FoodCategoryRule[]
  storages: { value: StorageMode; label: string }[]
  units: string[]
  countable_units: string[]
  pricing: {
    default_margin_percent: number
    max_margin_percent: number
    rounding: number
  }
}

/** Hasil POST /api/hpp/calculate — belum tersimpan. */
export interface HppResult {
  category: string
  storage: StorageMode
  ingredients: {
    name: string
    qty: number
    unit: string
    weight_grams: number
    price: number
  }[]
  total_cost: number
  total_weight_grams: number
  serving_weight_grams: number
  yield_servings: number
  /** null kalau semua bahan bersatuan butir/pcs sehingga berat tak terhitung. */
  estimated_servings: number | null
  servings_overridden: boolean
  cost_per_serving: number
  margin_percent: number
  suggested_price: number
  profit_per_serving: number
  /** Margin riil setelah pembulatan Rp500 — bisa beda dari margin yang diminta. */
  effective_margin_percent: number
  shelf_life_hours: number | null
  shelf_life_label: string | null
  shelf_life_note: string | null
  warnings: string[]
}

/** Resep tersimpan — hasil GET/POST /api/recipes. */
export interface Recipe {
  id: number
  umkmId: number | null
  name: string
  category: string
  storage: StorageMode
  totalWeightGrams: number
  servingWeightGrams: number
  yieldServings: number
  totalCost: number
  costPerServing: number
  marginPercent: number
  suggestedPrice: number
  profitPerServing: number
  shelfLifeHours: number | null
  shelfLifeNote: string | null
  ingredients: {
    id: number
    name: string
    qty: number
    unit: string
    weightGrams: number
    price: number
  }[]
  createdAt: string | null
  updatedAt: string | null
}
