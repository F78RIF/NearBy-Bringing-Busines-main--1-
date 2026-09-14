/**
 * ## KATALOG UMKM (tipe data)
 *
 * ## Pengertian:
 * Tipe inti untuk data usaha (UMKM) beserta kategori, wilayah, dan daftar
 * menu/produknya. Dipakai hampir semua fitur: beranda, katalog, detail,
 * favorit, rekomendasi, sampai dashboard.
 *
 * ## Alur:
 * Seed/API mengirim objek `Umkm` → store `umkm` memperkaya dengan warna
 * kategori (`CategoryStyle`) → komponen kartu & halaman detail menampilkannya.
 */

export type CategoryName = 'Kuliner' | 'Penginapan' | 'Fashion' | 'Oleh-Oleh' | 'Jasa'

export type LocationName =
  | 'Balikpapan Kota'
  | 'Balikpapan Utara'
  | 'Balikpapan Selatan'
  | 'Balikpapan Timur'
  | 'Balikpapan Barat'
  | 'Balikpapan Tengah'

/** Warna & ikon per kategori, dipakai untuk mewarnai kartu UMKM. */
export interface CategoryStyle {
  accent: string
  soft: string
  initial: string
  icon: string
}

/** Satu baris menu/produk milik sebuah UMKM. */
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

/** Status buka/tutup usaha — beda dengan status verifikasi admin. */
export type UmkmStatus = 'Aktif' | 'Libur' | 'Tutup'
