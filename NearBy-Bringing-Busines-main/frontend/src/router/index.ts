/**
 * ## ROUTING (pintu masuk tunggal)
 *
 * ## Pengertian:
 * Merakit router aplikasi dari dua bagian: daftar halaman (`routes.ts`) dan
 * penjaga akses (`guards.ts`).
 *
 * ## Alur:
 * `main.ts` memasang router ini ke aplikasi → setiap perpindahan halaman
 * diperiksa guard dulu → halaman baru selalu dibuka dari posisi paling atas.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { installGuards } from './guards'

const router = createRouter({
  history: createWebHistory(),
  // Setiap pindah halaman, gulir kembali ke atas.
  scrollBehavior() {
    return { top: 0 }
  },
  routes,
})

installGuards(router)

export default router
