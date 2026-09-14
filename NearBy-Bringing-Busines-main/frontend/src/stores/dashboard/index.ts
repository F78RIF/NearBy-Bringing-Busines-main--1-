/**
 * ## DASHBOARD (pintu masuk tunggal)
 *
 * ## Pengertian:
 * Dashboard punya dua wajah — Pemilik UMKM (owner) dan Administrator — dengan
 * total enam tab yang datanya berbeda-beda. Tiap tab sudah punya store-nya
 * sendiri di folder ini. File ini menyatukan semuanya menjadi satu store
 * `useDashboardStore` supaya komponen tab cukup memanggil satu store saja,
 * persis seperti sebelum kode dipecah.
 *
 * ## Alur:
 * Owner/Admin login → router mengarahkan ke /dashboard/:tab → DashboardView
 * memilih komponen tab sesuai peran → komponen memanggil `useDashboardStore()`
 * → store ini meneruskan permintaannya ke store fitur yang bersangkutan.
 *
 * Peta modul:
 * - ownerUmkm.ts      → UMKM Saya + Tempat Sampah (owner)
 * - verification.ts   → Verifikasi pengajuan UMKM (admin)
 * - adminUmkm.ts      → Semua UMKM (admin)
 * - adminUsers.ts     → Manajemen pengguna (admin)
 * - adminReports.ts   → Laporan & statistik (admin)
 * - problemReports.ts → Laporan masalah dari pengunjung (admin)
 *
 * Di file ini hanya tinggal aksi LINTAS-FITUR, yaitu yang menyentuh lebih
 * dari satu modul sekaligus (kirim UMKM baru, setujui/tolak pengajuan).
 * Menaruhnya di sini mencegah modul owner dan modul verifikasi saling impor.
 */

import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '../auth'
import { useOwnerUmkmStore } from './ownerUmkm'
import { useVerificationStore } from './verification'
import { useAdminUmkmStore } from './adminUmkm'
import { useAdminUsersStore } from './adminUsers'
import { useAdminReportsStore } from './adminReports'
import { useProblemReportsStore } from './problemReports'
import type { UmkmDraft } from '@/types'

// Modul per fitur juga diekspor ulang, kalau suatu saat ada komponen yang
// ingin memakai satu fitur saja tanpa lewat store gabungan ini.
export { useOwnerUmkmStore } from './ownerUmkm'
export { useVerificationStore } from './verification'
export { useAdminUmkmStore } from './adminUmkm'
export { useAdminUsersStore } from './adminUsers'
export { useAdminReportsStore } from './adminReports'
export { useProblemReportsStore } from './problemReports'

const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export const useDashboardStore = defineStore('dashboard', () => {
  const auth = useAuthStore()
  const owner = useOwnerUmkmStore()
  const verification = useVerificationStore()
  const adminUmkm = useAdminUmkmStore()
  const adminUsers = useAdminUsersStore()
  const adminReports = useAdminReportsStore()
  const problems = useProblemReportsStore()

  /* ================================================================== *
   * AKSI LINTAS-FITUR: TAMBAH UMKM
   * ================================================================== */

  /**
   * Kirim UMKM baru dari form "Tambah UMKM" (owner).
   *
   * Satu aksi menulis ke DUA tempat, meniru `UmkmController::store()` di
   * backend yang membuat baris `umkms` (verification 'menunggu') sekaligus
   * baris `submissions` (status 'menunggu'):
   *   1. daftar "UMKM Saya" milik owner, bertanda Menunggu verifikasi
   *   2. antrian "Menunggu ditinjau" milik admin
   *
   * Mengembalikan hasil, bukan melempar/diam — pemanggil wajib menampilkan
   * pesan kalau gagal.
   */
  function submitUmkm(draft: UmkmDraft): { ok: true } | { ok: false; message: string } {
    const name = draft.name.trim()
    if (!name) {
      return { ok: false, message: 'Nama UMKM wajib diisi.' }
    }

    if (owner.hasUmkmNamed(name) || verification.hasSubmissionNamed(name)) {
      return { ok: false, message: `UMKM bernama "${name}" sudah terdaftar atau sedang menunggu verifikasi.` }
    }

    const filledPhotos = draft.photos.filter((p) => p.img)

    // Checklist yang dilihat admin dihitung dari isi form yang sebenarnya,
    // bukan nilai karangan — jadi meter "data lengkap" memang bermakna.
    const checks: [string, boolean][] = [
      ['Deskripsi usaha', !!draft.desc.trim()],
      ['Alamat lengkap', !!draft.address.trim()],
      ['Nomor telepon', !!draft.wa.trim()],
      ['Foto (min. 3)', filledPhotos.length >= 3],
      ['Jam operasional', !!draft.hours.trim()],
      ['Kategori & wilayah', !!draft.cat && !!draft.loc],
    ]

    // 1. Antrian admin.
    verification.enqueue({
      name,
      owner: auth.user?.name ?? 'Pemilik UMKM',
      cat: draft.cat,
      loc: draft.loc,
      date: dateFormatter.format(new Date()),
      checks,
      files: draft.photos.map((p, i) => ({
        name: p.name.trim() || `Foto ${i + 1}`,
        kind: 'image' as const,
        ok: !!p.img,
        meta: p.img ? 'Diunggah dari form' : 'Belum diunggah',
      })),
    })

    // 2. Daftar UMKM milik owner.
    owner.addOwnedUmkm({
      name,
      cat: draft.cat,
      loc: draft.loc,
      rating: 0,
      reviews: 0,
      views: '0',
      status: 'Aktif',
      verification: 'Menunggu',
    })

    return { ok: true }
  }

  /* ================================================================== *
   * AKSI LINTAS-FITUR: KEPUTUSAN VERIFIKASI
   * ================================================================== */

  /** Setujui pengajuan: keluar dari antrian, lalu ditandai Disetujui di daftar owner. */
  function approveSubmission(name: string) {
    verification.dequeue(name)
    owner.markVerified(name)
    alert(`UMKM "${name}" disetujui dan akan ditampilkan di website.`)
  }

  /** Tolak pengajuan: cukup keluar dari antrian admin. */
  function rejectSubmission(name: string) {
    verification.dequeue(name)
    alert(`Pengajuan "${name}" ditolak.`)
  }

  /* ================================================================== *
   * API GABUNGAN — bentuknya sengaja sama persis dengan versi sebelumnya
   * supaya seluruh komponen dashboard tidak perlu diubah sama sekali.
   * ================================================================== */

  return {
    // -- Owner: UMKM Saya & Tempat Sampah --
    myUmkm: computed(() => owner.myUmkm),
    submitUmkm,
    ownerTrash: computed(() => owner.ownerTrash),
    ownerDeleteUmkm: owner.ownerDeleteUmkm,
    ownerRestoreUmkm: owner.ownerRestoreUmkm,
    ownerPurgeUmkm: owner.ownerPurgeUmkm,
    emptyOwnerTrash: owner.emptyOwnerTrash,

    // -- Admin: Semua UMKM --
    allUmkmAdmin: computed(() => adminUmkm.allUmkmAdmin),
    adminToggleHidden: adminUmkm.adminToggleHidden,

    // -- Admin: Pengguna --
    users: computed(() => adminUsers.users),
    userRestore: adminUsers.userRestore,
    userReset: adminUsers.userReset,
    userToggleActive: adminUsers.userToggleActive,

    // -- Admin: Laporan & statistik --
    catBreakdown: computed(() => adminReports.catBreakdown),
    topUmkm: computed(() => adminReports.topUmkm),

    // -- Admin: Laporan Masalah --
    problemReports: computed(() => problems.problemReports),
    newReportCount: computed(() => problems.newReportCount),
    submitProblemReport: problems.submitProblemReport,
    setProblemReportStatus: problems.setProblemReportStatus,

    // -- Admin: Verifikasi --
    pendingSubmissions: computed(() => verification.pendingSubmissions),
    approveSubmission,
    rejectSubmission,
    requestFix: verification.requestFix,
  }
})
