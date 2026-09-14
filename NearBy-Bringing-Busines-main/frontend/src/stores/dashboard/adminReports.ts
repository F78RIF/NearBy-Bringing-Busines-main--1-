/**
 * ## DASHBOARD ADMIN — LAPORAN & STATISTIK
 *
 * ## Pengertian:
 * Ringkasan angka untuk admin: sebaran jumlah UMKM per kategori (dalam
 * bentuk bar chart) dan peringkat 5 UMKM dengan rating tertinggi.
 *
 * ## Alur:
 * Admin membuka tab "Laporan" → data dihitung langsung dari store `umkm` →
 * jumlah per kategori diubah jadi persentase terhadap kategori terbanyak →
 * daftar UMKM diurutkan berdasarkan rating dan diambil 5 teratas.
 */

import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useUmkmStore } from '../umkm'

/** Berapa banyak UMKM yang masuk daftar peringkat teratas. */
const TOP_UMKM_LIMIT = 5

export const useAdminReportsStore = defineStore('dashboard/adminReports', () => {
  const umkm = useUmkmStore()

  /** Sebaran UMKM per kategori, dinormalkan jadi persentase untuk bar chart. */
  const catBreakdown = computed(() => {
    const counts = umkm.categoryCards
    const max = Math.max(...counts.map((c) => c.count))
    return counts.map((c) => ({ ...c, pct: Math.round((c.count / max) * 100) }))
  })

  /** UMKM dengan rating tertinggi, sudah diberi nomor peringkat. */
  const topUmkm = computed(() =>
    [...umkm.enrichedAll]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, TOP_UMKM_LIMIT)
      .map((u, i) => ({ ...u, rank: i + 1 })),
  )

  return { catBreakdown, topUmkm }
})
