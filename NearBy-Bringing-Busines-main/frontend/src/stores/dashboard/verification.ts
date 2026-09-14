/**
 * ## DASHBOARD ADMIN — VERIFIKASI PENGAJUAN UMKM
 *
 * ## Pengertian:
 * Mengelola antrian "Menunggu ditinjau": UMKM baru yang diajukan pemilik dan
 * belum disetujui admin. Tiap pengajuan punya checklist kelengkapan data
 * (deskripsi, alamat, telepon, foto, jam buka, kategori) yang dihitung
 * menjadi persentase dan penilaian ("Data lengkap" / "Kurang lengkap" /
 * "Data belum memadai").
 *
 * ## Alur:
 * Owner mengirim form Tambah UMKM → pengajuan masuk antrian (`enqueue`) →
 * admin membuka tab Verifikasi dan melihat checklist → admin memilih
 * setujui / tolak (keduanya mengeluarkan pengajuan dari antrian) atau minta
 * perbaikan data (pengajuan tetap di antrian).
 *
 * Catatan: aksi setujui/tolak ada di `stores/dashboard/index.ts` karena juga
 * menyentuh daftar UMKM milik owner.
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { CAT } from '@/data/categories'
import { SUBMISSIONS_RAW } from '@/data/dashboardSeed'
import type { SubmissionRaw } from '@/types'

export const useVerificationStore = defineStore('dashboard/verification', () => {
  /**
   * Antrian verifikasi. Sumbernya `ref` dan turunannya `computed` — sebelumnya
   * ini konstanta biasa (`SUBMISSIONS_RAW.map(...)`) yang dihitung sekali saat
   * store dibuat, sehingga pengajuan baru mustahil muncul walaupun datanya ada.
   */
  const submissionsRaw = ref<SubmissionRaw[]>([...SUBMISSIONS_RAW])

  const pendingSubmissions = computed(() =>
    submissionsRaw.value.map((sub) => {
      const okCount = sub.checks.filter((c) => c[1]).length
      const total = sub.checks.length
      const complete = okCount === total
      const minor = okCount >= total - 2
      return {
        ...sub,
        checks: sub.checks.map(([label, ok]) => ({
          label,
          mark: ok ? '✓' : '✕',
          color: ok ? '#2E7D6E' : '#C0472F',
          bg: ok ? '#E3EFED' : '#F8E6E0',
        })),
        okCount,
        total,
        pct: Math.round((okCount / total) * 100),
        barColor: complete ? '#3E8E82' : minor ? '#C98A2E' : '#C0472F',
        verdict: complete ? 'Data lengkap' : minor ? 'Kurang lengkap' : 'Data belum memadai',
        verdictColor: complete ? '#2E7D6E' : minor ? '#B07A1E' : '#C0472F',
        verdictBg: complete ? '#E3EFED' : minor ? '#F7EDDC' : '#F8E6E0',
        catAccent: CAT[sub.cat].accent,
        catSoft: CAT[sub.cat].soft,
      }
    }),
  )

  /** Cek nama sudah ada di antrian (menghindari pengajuan ganda). */
  function hasSubmissionNamed(name: string) {
    return submissionsRaw.value.some((s) => s.name.toLowerCase() === name.toLowerCase())
  }

  /** Masukkan satu pengajuan baru ke urutan teratas antrian. */
  function enqueue(submission: SubmissionRaw) {
    submissionsRaw.value.unshift(submission)
  }

  /** Keluarkan satu pengajuan dari antrian "Menunggu ditinjau". */
  function dequeue(name: string) {
    submissionsRaw.value = submissionsRaw.value.filter((s) => s.name !== name)
  }

  function requestFix(name: string) {
    // Tetap di antrian — pemilik diminta melengkapi data, belum diputuskan.
    alert(`Permintaan perbaikan data dikirim ke pemilik "${name}".`)
  }

  return {
    submissionsRaw,
    pendingSubmissions,
    hasSubmissionNamed,
    enqueue,
    dequeue,
    requestFix,
  }
})
