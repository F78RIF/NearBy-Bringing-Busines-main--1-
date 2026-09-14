/**
 * ## AUTHENTICATION (tipe data)
 *
 * ## Pengertian:
 * Tipe untuk identitas dan peran (role) pengguna yang sedang masuk.
 *
 * ## Alur:
 * Login/Register ke API Laravel → server mengembalikan token + data user →
 * store `auth` menormalkan role-nya menjadi `Role` dan menyimpan `AuthUser`.
 */

/** Peran akun. Menentukan menu & dashboard mana yang boleh diakses. */
export type Role = 'user' | 'owner' | 'admin'

export interface AuthUser {
  name: string
  role: Role
}
