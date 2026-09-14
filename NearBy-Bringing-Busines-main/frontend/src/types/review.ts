/**
 * ## ULASAN UMKM (tipe data)
 *
 * ## Pengertian:
 * Tipe untuk ulasan/rating yang ditulis pengunjung pada halaman detail UMKM.
 *
 * ## Alur:
 * User mengisi form ulasan → store `reviews` melakukan upsert (satu penulis
 * hanya boleh punya satu ulasan per UMKM) → daftar ulasan diperbarui.
 */

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
