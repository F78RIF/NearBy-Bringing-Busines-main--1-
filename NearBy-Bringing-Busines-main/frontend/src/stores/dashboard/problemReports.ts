/**
 * ## DASHBOARD ADMIN — LAPORAN MASALAH
 *
 * ## Pengertian:
 * Kotak masuk keluhan/bug yang dikirim pengunjung lewat widget bantuan
 * (tombol melayang di pojok halaman). Tiap laporan punya status: Baru,
 * Ditinjau, atau Selesai.
 *
 * ## Alur:
 * Pengunjung menulis masalah di HelpWidget → `submitProblemReport()`
 * memasukkannya ke daftar dengan status "Baru" → jumlah laporan baru muncul
 * sebagai penanda di menu dashboard → admin membuka tab "Laporan Masalah",
 * membaca isinya, lalu mengubah statusnya menjadi Ditinjau atau Selesai.
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { PROBLEM_REPORTS_RAW } from '@/data/dashboardSeed'
import type { ProblemReport, ProblemReportStatus } from '@/types'

/** Warna badge per status laporan. */
const PROBLEM_STATUS_META: Record<ProblemReportStatus, { c: string; b: string }> = {
  Baru: { c: '#B07A1E', b: '#F7EDDC' },
  Ditinjau: { c: '#2C5EAD', b: '#E6EDF8' },
  Selesai: { c: '#2E7D6E', b: '#E3EFED' },
}

export const useProblemReportsStore = defineStore('dashboard/problemReports', () => {
  const problemReportsRaw = ref<ProblemReport[]>(PROBLEM_REPORTS_RAW)

  /** Laporan siap-tampil: yang berstatus "Baru" selalu naik ke atas. */
  const problemReports = computed(() =>
    [...problemReportsRaw.value]
      .sort((a, b) => (a.status === b.status ? 0 : a.status === 'Baru' ? -1 : b.status === 'Baru' ? 1 : 0))
      .map((r) => {
        const meta = PROBLEM_STATUS_META[r.status]
        return { ...r, statusColor: meta.c, statusBg: meta.b }
      }),
  )

  const newReportCount = computed(() => problemReportsRaw.value.filter((r) => r.status === 'Baru').length)

  function submitProblemReport(kind: string, text: string, name: string) {
    problemReportsRaw.value.unshift({
      id: `pr${Date.now()}`,
      kind,
      text,
      name: name.trim() || 'Anonim',
      status: 'Baru',
      when: 'Baru saja',
    })
  }

  function setProblemReportStatus(id: string, status: ProblemReportStatus) {
    const report = problemReportsRaw.value.find((r) => r.id === id)
    if (report) report.status = status
  }

  return { problemReports, newReportCount, submitProblemReport, setProblemReportStatus }
})
