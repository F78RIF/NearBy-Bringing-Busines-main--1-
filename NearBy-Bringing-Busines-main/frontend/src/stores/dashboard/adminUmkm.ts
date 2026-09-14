/**
 * ## DASHBOARD ADMIN — SEMUA UMKM
 *
 * ## Pengertian:
 * Daftar seluruh UMKM di platform beserta status tayangnya: "Tampil",
 * "Disembunyikan" (dinonaktifkan admin), atau "Ditinjau".
 *
 * ## Alur:
 * Admin membuka tab "Semua UMKM" → daftar dibaca dari store `umkm` lalu
 * diberi badge status berdasarkan daftar `hiddenUmkm` → admin menekan
 * tombol nonaktifkan/aktifkan → UMKM masuk atau keluar dari `hiddenUmkm`
 * sehingga tampil/hilang dari katalog publik.
 */

import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useUmkmStore } from '../umkm'

/** Warna badge untuk tiap status tayang. */
const STATUS_LABEL_META: Record<string, { c: string; b: string }> = {
  Tampil: { c: '#2E7D6E', b: '#E3EFED' },
  Disembunyikan: { c: '#8A8578', b: '#EEEADF' },
  Ditinjau: { c: '#B07A1E', b: '#F7EDDC' },
}

export const useAdminUmkmStore = defineStore('dashboard/adminUmkm', () => {
  const umkm = useUmkmStore()

  const allUmkmAdmin = computed(() =>
    umkm.enrichedAll.map((u) => {
      const hidden = umkm.hiddenUmkm.includes(u.id)
      const status = hidden ? 'Disembunyikan' : u.id === 8 ? 'Ditinjau' : 'Tampil'
      const meta = STATUS_LABEL_META[status]
      return { ...u, status, statusColor: meta.c, statusBg: meta.b, hidden }
    }),
  )

  function adminToggleHidden(id: number, name: string) {
    const hidden = umkm.hiddenUmkm.includes(id)
    if (hidden) umkm.hiddenUmkm = umkm.hiddenUmkm.filter((x) => x !== id)
    else umkm.hiddenUmkm.push(id)
    alert(`UMKM "${name}" ${hidden ? 'diaktifkan kembali.' : 'dinonaktifkan.'}`)
  }

  return { allUmkmAdmin, adminToggleHidden }
})
