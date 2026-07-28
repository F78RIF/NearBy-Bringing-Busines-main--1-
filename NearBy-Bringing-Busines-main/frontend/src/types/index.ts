export type CategoryName = 'Kuliner' | 'Penginapan' | 'Fashion' | 'Oleh-Oleh' | 'Jasa'

export type LocationName =
  | 'Balikpapan Kota'
  | 'Balikpapan Utara'
  | 'Balikpapan Selatan'
  | 'Balikpapan Timur'
  | 'Balikpapan Barat'
  | 'Balikpapan Tengah'

export interface CategoryStyle {
  accent: string
  soft: string
  initial: string
  icon: string
}

export interface UmkmItem {
  name: string
  /** Sub-katalog produk, mis. "Makanan Kering". Kosong = "Lainnya". */
  category?: string
  price: string
  img?: string
  avail?: boolean
}

export interface Umkm {
  id: number
  name: string
  cat: CategoryName
  loc: LocationName
  rating: number
  reviews: number
  priceLabel: string
  tag: string
  imgLabel: string
  address: string
  hours: string
  phone: string
  ig: string
  listLabel: string
  items: UmkmItem[]
}

export type UmkmStatus = 'Aktif' | 'Libur' | 'Tutup'

export interface Review {
  id: string
  umkmId: number
  /**
   * Identitas penulis. Prototype belum punya user id, jadi nama yang
   * dinormalkan (lihat `authorKey()`) yang dipakai sebagai kunci — padanan
   * `user_id` di backend. Satu userKey hanya boleh punya satu ulasan per UMKM.
   */
  userKey: string
  initial: string
  name: string
  stars: number
  date: string
  text: string
}

// ---- Konten video medsos (embed) ----

export type VideoPlatform = 'youtube' | 'instagram'

export interface SocialVideo {
  id: string
  platform: VideoPlatform
  /** Link asli dari platform (mis. URL Reels / YouTube). Diparse jadi URL embed. */
  url: string
  title: string
  /**
   * true = `url` masih link contoh bawaan seeder, bukan konten OLEHKITA asli.
   * Kartu akan menampilkan "Video belum tersedia" alih-alih menyematkan video
   * milik orang lain yang tidak nyambung dengan judulnya. Hapus flag ini (atau
   * ganti url lewat panel admin) begitu link aslinya dipasang.
   */
  placeholder?: boolean
}

export type Role = 'user' | 'owner' | 'admin'

export interface AuthUser {
  name: string
  role: Role
}

// ---- Dashboard ----

export interface StatCard {
  icon: string
  value: string
  label: string
  delta?: string
  accent: string
  soft: string
}

export interface ChartBar {
  label: string
  pct: number
}

export interface SimpleReview {
  initial: string
  name: string
  stars: number
  text: string
}

export interface MyUmkmRaw {
  name: string
  cat: CategoryName
  loc: LocationName
  rating: number
  reviews: number
  views: string
  status: UmkmStatus
  /**
   * Status verifikasi admin — beda dengan `status` (buka/libur/tutup).
   * UMKM baru selalu 'Menunggu' sampai admin menyetujui di /dashboard/verif.
   * Padanan kolom `umkms.verification` di backend.
   */
  verification?: 'Menunggu' | 'Disetujui'
}

/** Isi form "Tambah UMKM" (EditUmkmModal) yang dikirim ke dashboard store. */
export interface UmkmDraft {
  name: string
  cat: CategoryName
  loc: LocationName
  wa: string
  ig: string
  address: string
  hours: string
  desc: string
  photos: { name: string; img: string }[]
  menu: { name: string; category: string; price: string; img: string; avail: boolean }[]
}

export interface OwnerReview {
  initial: string
  name: string
  umkm: string
  stars: number
  date: string
  text: string
}

export interface SubmissionFile {
  name: string
  kind: 'image' | 'doc'
  ok: boolean
  meta: string
}

export interface SubmissionRaw {
  name: string
  owner: string
  cat: CategoryName
  loc: LocationName
  date: string
  checks: [string, boolean][]
  files: SubmissionFile[]
}

export interface UserRaw {
  name: string
  email: string
  role: 'Pengguna' | 'Pemilik UMKM' | 'Administrator'
  status: 'Aktif' | 'Menunggu' | 'Nonaktif'
  joined: string
  initial: string
}

export interface OwnerTrashEntry {
  tid: string
  name: string
  sub: string
  when: string
}

export type ProblemReportStatus = 'Baru' | 'Ditinjau' | 'Selesai'

export interface ProblemReport {
  id: string
  kind: string
  text: string
  name: string
  status: ProblemReportStatus
  when: string
}

/* ------------------------------------------------------------------ *
 * Kalkulator HPP & masa tahan (Fitur 1)
 * Bentuknya mengikuti response API Laravel — snake_case untuk endpoint
 * /hpp/calculate (hasil hitung mentah), camelCase untuk resource /recipes.
 * ------------------------------------------------------------------ */

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
