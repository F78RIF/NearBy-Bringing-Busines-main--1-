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
