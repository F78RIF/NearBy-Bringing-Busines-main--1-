/**
 * ## TIPE DATA (pintu masuk tunggal)
 *
 * ## Pengertian:
 * File ini hanya "meja penerima" (barrel). Definisi tipe yang sebenarnya
 * tinggal di file per-fitur di folder yang sama, supaya tiap fitur mudah
 * dicari dan tidak menumpuk dalam satu file panjang.
 *
 * ## Alur:
 * Komponen/store cukup menulis `import type { Umkm } from '@/types'` →
 * file ini meneruskan ke file fitur yang tepat. Boleh juga mengimpor
 * langsung dari file fiturnya, mis. `@/types/calculator`.
 *
 * Daftar isi:
 * - umkm.ts        → Katalog & data UMKM
 * - review.ts      → Ulasan UMKM
 * - content.ts     → Konten video media sosial
 * - auth.ts        → Autentikasi & peran pengguna
 * - dashboard.ts   → Dashboard owner & admin
 * - calculator.ts  → Kalkulator HPP & masa tahan
 */

export type * from './umkm'
export type * from './review'
export type * from './content'
export type * from './auth'
export type * from './dashboard'
export type * from './calculator'
