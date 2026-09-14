/**
 * ## DASHBOARD ADMIN — MANAJEMEN PENGGUNA
 *
 * ## Pengertian:
 * Daftar seluruh akun (Pengguna, Pemilik UMKM, Administrator) beserta status
 * akunnya, termasuk akun yang sedang dalam masa tunggu penghapusan 30 hari.
 *
 * ## Alur:
 * Admin membuka tab "Pengguna" → daftar akun aktif digabung dengan daftar
 * akun terhapus dari store `account` → admin bisa mengaktifkan/menonaktifkan
 * akun, mengirim tautan reset password, atau memulihkan akun yang terhapus.
 *
 * Batasan yang disengaja: admin TIDAK bisa menghapus akun. Penghapusan hanya
 * lewat menu akun milik pengguna sendiri (DeleteAccountTab).
 */

import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useAccountStore } from '../account'
import { USERS_RAW } from '@/data/dashboardSeed'

/** Warna badge per peran. */
const ROLE_META = {
  Pengguna: { c: '#1591DC', b: '#E1F1FB' },
  'Pemilik UMKM': { c: '#3E8E82', b: '#E3EFED' },
  Administrator: { c: '#C98A2E', b: '#F7EDDC' },
} as const

/** Warna badge per status akun. */
const USER_STATUS_META = {
  Aktif: { c: '#2E7D6E', b: '#E3EFED' },
  Menunggu: { c: '#B07A1E', b: '#F7EDDC' },
  Nonaktif: { c: '#8A8578', b: '#EEEADF' },
} as const

export const useAdminUsersStore = defineStore('dashboard/adminUsers', () => {
  const account = useAccountStore()

  /** Perubahan status yang dilakukan admin, ditumpuk di atas data seed. */
  const userStatusOverride = reactive<Record<string, 'Aktif' | 'Nonaktif'>>({})

  const users = computed(() => {
    const active = USERS_RAW.map((u) => {
      const status = userStatusOverride[u.email] ?? u.status
      return {
        ...u,
        status,
        deleted: false,
        roleColor: ROLE_META[u.role].c,
        roleBg: ROLE_META[u.role].b,
        statusColor: USER_STATUS_META[status].c,
        statusBg: USER_STATUS_META[status].b,
      }
    })

    // Akun terhapus ikut ditampilkan lengkap dengan sisa hari masa pulih.
    const deletedRows = account.deletedAccounts.map((a) => {
      const days = Math.max(0, 30 - Math.floor((Date.now() - a.deletedAt) / 86400000))
      const rm = ROLE_META[a.role as keyof typeof ROLE_META] ?? ROLE_META['Pengguna']
      return {
        name: a.name,
        email: a.email,
        role: a.role,
        joined: '',
        initial: a.initial,
        deleted: true,
        roleColor: rm.c,
        roleBg: rm.b,
        status: `Dihapus · ${days} hr lagi`,
        statusColor: '#C0472F',
        statusBg: '#FBEEEA',
      }
    })

    return [...active, ...deletedRows]
  })

  function userRestore(email: string) {
    account.deletedAccounts = account.deletedAccounts.filter((a) => a.email !== email)
    if (account.myDeleted?.email === email) account.myDeleted = null
  }

  function userReset(email: string) {
    alert(`Tautan reset password dikirim ke ${email}`)
  }

  function userToggleActive(email: string, name: string) {
    const current = userStatusOverride[email] ?? USERS_RAW.find((u) => u.email === email)?.status ?? 'Aktif'
    const next = current === 'Nonaktif' ? 'Aktif' : 'Nonaktif'
    userStatusOverride[email] = next
    alert(`Akun "${name}" ${next === 'Nonaktif' ? 'dinonaktifkan.' : 'diaktifkan kembali.'}`)
  }

  return { users, userRestore, userReset, userToggleActive }
})
