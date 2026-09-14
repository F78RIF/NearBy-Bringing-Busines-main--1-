/**
 * ## ROUTING — DAFTAR HALAMAN
 *
 * ## Pengertian:
 * Peta alamat (URL) ke komponen halaman. Dikelompokkan per fitur supaya
 * mudah dicari saat menambah halaman baru.
 *
 * ## Alur:
 * Pengunjung membuka sebuah alamat → Vue Router mencocokkannya di daftar ini
 * → komponen halamannya dimuat secara lazy (hanya diunduh saat dibutuhkan)
 * → guard di `guards.ts` memutuskan boleh masuk atau tidak.
 *
 * Catatan `meta.chrome`: false berarti header/footer/widget bantuan situs
 * publik TIDAK ikut dirender (dipakai halaman login, register, dashboard).
 */

import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Whether the public site chrome (header/footer/help widget) renders. Defaults to true. */
    chrome?: boolean
  }
}

/* ------------------------------------------------------------------ *
 * KATALOG UMKM — beranda, daftar usaha, detail, favorit
 * ------------------------------------------------------------------ */
const catalogRoutes: RouteRecordRaw[] = [
  { path: '/', name: 'beranda', component: () => import('@/views/HomeView.vue') },
  { path: '/daftar', name: 'daftar', component: () => import('@/views/DirectoryView.vue') },
  { path: '/umkm/:id', name: 'detail', component: () => import('@/views/DetailView.vue'), props: true },
  { path: '/favorit', name: 'favorit', component: () => import('@/views/FavoritesView.vue') },
]

/* ------------------------------------------------------------------ *
 * HALAMAN INFORMASI — tentang, panduan, privasi, syarat & ketentuan
 * ------------------------------------------------------------------ */
const infoRoutes: RouteRecordRaw[] = [
  { path: '/tentang', name: 'tentang', component: () => import('@/views/AboutView.vue') },
  { path: '/panduan', name: 'panduan', component: () => import('@/views/GuideView.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('@/views/PrivacyView.vue') },
  { path: '/terms', name: 'terms', component: () => import('@/views/TermsView.vue') },
]

/* ------------------------------------------------------------------ *
 * AUTHENTICATION — login & pendaftaran akun
 * Tanpa chrome situs supaya tampil sebagai halaman penuh.
 * ------------------------------------------------------------------ */
const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { chrome: false },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { chrome: false },
  },
]

/* ------------------------------------------------------------------ *
 * AKUN PENGGUNA — halaman profil & pengaturan akun
 * ------------------------------------------------------------------ */
const accountRoutes: RouteRecordRaw[] = [
  { path: '/akun', name: 'akun', component: () => import('@/views/AccountView.vue') },
]

/* ------------------------------------------------------------------ *
 * DASHBOARD — satu rute untuk owner & admin, tab dipilih lewat parameter
 * Akses dijaga oleh `installGuards()` di guards.ts.
 * ------------------------------------------------------------------ */
const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard/:tab?',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { chrome: false },
    props: true,
  },
]

export const routes: RouteRecordRaw[] = [
  ...catalogRoutes,
  ...infoRoutes,
  ...authRoutes,
  ...accountRoutes,
  ...dashboardRoutes,
]
