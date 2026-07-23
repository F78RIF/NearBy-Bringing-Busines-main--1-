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
  initial: string
  name: string
  stars: number
  date: string
  text: string
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
