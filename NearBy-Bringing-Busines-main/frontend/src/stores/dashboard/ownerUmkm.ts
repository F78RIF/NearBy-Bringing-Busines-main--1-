/**
 * ## DASHBOARD OWNER — UMKM SAYA & TEMPAT SAMPAH
 *
 * ## Pengertian:
 * Menyimpan daftar UMKM milik pemilik usaha (owner) yang sedang masuk, status
 * buka/libur/tutup tiap usaha, status verifikasi admin, serta Tempat Sampah
 * untuk UMKM yang dihapus sementara.
 *
 * ## Alur:
 * Owner login → buka tab "UMKM Saya" → daftar dibaca dari `myUmkmRaw` lalu
 * diperkaya warna kategori & badge status → owner bisa mengganti status buka,
 * atau menghapus UMKM → UMKM pindah ke Tempat Sampah → dari sana bisa
 * dipulihkan kembali atau dihapus permanen.
 *
 * Catatan: aksi lintas-fitur (kirim UMKM baru, setujui/tolak verifikasi)
 * tidak ada di sini, melainkan di `stores/dashboard/index.ts` supaya tidak
 * terjadi saling-impor antara modul owner dan modul verifikasi.
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useUmkmStore } from '../umkm'
import { CAT } from '@/data/categories'
import { MY_UMKM_RAW } from '@/data/dashboardSeed'
import type { MyUmkmRaw, OwnerTrashEntry, UmkmStatus } from '@/types'

/** Warna badge untuk tiap status buka/tutup. */
const STATUS_META: Record<UmkmStatus, { c: string; b: string }> = {
  Aktif: { c: '#2E7D6E', b: '#E3EFED' },
  Libur: { c: '#B07A1E', b: '#F7EDDC' },
  Tutup: { c: '#C0472F', b: '#F8E6E0' },
}

export const useOwnerUmkmStore = defineStore('dashboard/ownerUmkm', () => {
  const umkm = useUmkmStore()

  /**
   * Salinan seed yang bisa ditulis. Sebelumnya `myUmkm` membaca MY_UMKM_RAW
   * (array modul statis) langsung, jadi UMKM baru tidak punya tempat untuk
   * disimpan sama sekali.
   */
  const myUmkmRaw = ref<MyUmkmRaw[]>([...MY_UMKM_RAW])

  /** Nama UMKM yang sedang berada di Tempat Sampah (disembunyikan dari daftar). */
  const deletedMyUmkm = ref<string[]>([])
  const ownerTrash = ref<OwnerTrashEntry[]>([])

  /* ---- Daftar siap-tampil ------------------------------------------- */

  const myUmkm = computed(() =>
    myUmkmRaw.value
      .filter((u) => !deletedMyUmkm.value.includes(u.name))
      .map((u) => {
        const status = umkm.statusOf(u.name)
        const sm = STATUS_META[status]
        return {
          ...u,
          status,
          statusColor: sm.c,
          statusBg: sm.b,
          catAccent: CAT[u.cat].accent,
          catSoft: CAT[u.cat].soft,
          statusOptions: (['Aktif', 'Libur', 'Tutup'] as UmkmStatus[]).map((opt) => ({
            label: opt,
            active: opt === status,
            bg: opt === status ? STATUS_META[opt].b : '#F4F0E7',
            color: opt === status ? STATUS_META[opt].c : '#8A8578',
            onClick: () => {
              umkm.umkmStatus[u.name] = opt
            },
          })),
        }
      }),
  )

  /* ---- Dipakai alur "Tambah UMKM" & "Verifikasi" ---------------------- */

  /** Cek nama sudah dipakai salah satu UMKM milik owner ini. */
  function hasUmkmNamed(name: string) {
    return myUmkmRaw.value.some((u) => u.name.toLowerCase() === name.toLowerCase())
  }

  /** Tambahkan UMKM baru ke daftar owner, selalu berstatus menunggu verifikasi. */
  function addOwnedUmkm(entry: MyUmkmRaw) {
    myUmkmRaw.value.unshift(entry)
  }

  /** Tandai UMKM sudah disetujui admin (dipanggil dari alur verifikasi). */
  function markVerified(name: string) {
    const mine = myUmkmRaw.value.find((u) => u.name === name)
    if (mine) mine.verification = 'Disetujui'
  }

  /* ---- Tempat Sampah -------------------------------------------------- */

  function ownerDeleteUmkm(name: string, cat: string, loc: string) {
    if (!confirm(`Pindahkan UMKM "${name}" ke Tempat Sampah?`)) return
    deletedMyUmkm.value.push(name)
    ownerTrash.value.unshift({ tid: `t${Date.now()}`, name, sub: `${cat} · ${loc}`, when: 'Baru saja' })
  }

  function ownerRestoreUmkm(tid: string) {
    const entry = ownerTrash.value.find((t) => t.tid === tid)
    if (!entry) return
    ownerTrash.value = ownerTrash.value.filter((t) => t.tid !== tid)
    deletedMyUmkm.value = deletedMyUmkm.value.filter((n) => n !== entry.name)
  }

  function ownerPurgeUmkm(tid: string, name: string) {
    if (!confirm(`Hapus permanen "${name}"? Data tidak bisa dipulihkan lagi.`)) return
    ownerTrash.value = ownerTrash.value.filter((t) => t.tid !== tid)
  }

  function emptyOwnerTrash() {
    if (!ownerTrash.value.length) return
    if (!confirm('Kosongkan Tempat Sampah? Semua item akan dihapus permanen dan tidak bisa dipulihkan.')) return
    ownerTrash.value = []
  }

  return {
    myUmkmRaw,
    myUmkm,
    hasUmkmNamed,
    addOwnedUmkm,
    markVerified,
    ownerTrash,
    ownerDeleteUmkm,
    ownerRestoreUmkm,
    ownerPurgeUmkm,
    emptyOwnerTrash,
  }
})
