/**
 * ## ROUTING — PENJAGA AKSES (GUARD)
 *
 * ## Pengertian:
 * Aturan siapa boleh membuka halaman apa. Saat ini hanya dashboard yang
 * dijaga: pengunjung biasa tidak boleh masuk ke sana.
 *
 * ## Alur:
 * Pengunjung menuju /dashboard → guard membaca sesi dari store `auth` →
 *   - belum login atau perannya 'user'  → dilempar ke halaman login
 *   - sudah login tapi tab belum dipilih → diarahkan ke tab bawaan
 *     ('verif' untuk admin, 'ringkasan' untuk pemilik UMKM)
 *   - selain itu                        → dipersilakan masuk
 */

import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/** Tab pertama yang dibuka tiap peran saat masuk dashboard tanpa parameter. */
const DEFAULT_TAB = { admin: 'verif', owner: 'ringkasan' } as const

export function installGuards(router: Router) {
  router.beforeEach((to) => {
    if (to.name === 'dashboard') {
      const auth = useAuthStore()

      // Hanya pemilik UMKM & administrator yang punya dashboard.
      if (!auth.user || auth.user.role === 'user') {
        return { name: 'login' }
      }

      if (!to.params.tab) {
        const defaultTab = auth.user.role === 'admin' ? DEFAULT_TAB.admin : DEFAULT_TAB.owner
        return { name: 'dashboard', params: { tab: defaultTab } }
      }
    }
    return true
  })
}
