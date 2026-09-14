/**
 * ## DASHBOARD (tipe data)
 *
 * ## Pengertian:
 * Tipe untuk seluruh tab dashboard, baik milik Pemilik UMKM (owner) maupun
 * Administrator: ringkasan statistik, UMKM saya, verifikasi, pengguna,
 * tempat sampah, dan laporan masalah.
 *
 * ## Alur:
 * Owner/Admin masuk dashboard → store di `stores/dashboard/` membaca data
 * mentah bertipe `*Raw` → mengubahnya menjadi baris siap-tampil (lengkap
 * dengan warna badge) → komponen tab menampilkannya.
 */

import type { CategoryName, LocationName, UmkmStatus } from './umkm'

/* ---------------------------------------------------------------- *
 * Ringkasan / statistik
 * ---------------------------------------------------------------- */

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

/* ---------------------------------------------------------------- *
 * Owner: UMKM Saya
 * ---------------------------------------------------------------- */

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

/** Satu entri di Tempat Sampah milik owner. */
export interface OwnerTrashEntry {
  tid: string
  name: string
  sub: string
  when: string
}

/* ---------------------------------------------------------------- *
 * Admin: Verifikasi pengajuan UMKM
 * ---------------------------------------------------------------- */

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

/* ---------------------------------------------------------------- *
 * Admin: Pengguna
 * ---------------------------------------------------------------- */

export interface UserRaw {
  name: string
  email: string
  role: 'Pengguna' | 'Pemilik UMKM' | 'Administrator'
  status: 'Aktif' | 'Menunggu' | 'Nonaktif'
  joined: string
  initial: string
}

/* ---------------------------------------------------------------- *
 * Admin: Laporan Masalah
 * ---------------------------------------------------------------- */

export type ProblemReportStatus = 'Baru' | 'Ditinjau' | 'Selesai'

export interface ProblemReport {
  id: string
  kind: string
  text: string
  name: string
  status: ProblemReportStatus
  when: string
}
