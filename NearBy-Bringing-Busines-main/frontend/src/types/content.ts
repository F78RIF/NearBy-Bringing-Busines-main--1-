/**
 * ## KONTEN VIDEO (tipe data)
 *
 * ## Pengertian:
 * Tipe untuk konten promosi berupa video media sosial (Instagram Reels /
 * YouTube) yang tampil di section "Konten Terbaru" landing page.
 *
 * ## Alur:
 * Admin menambah/mengedit link di tab Konten Video → store `content`
 * menyimpannya → landing page menyematkan (embed) videonya.
 */

export type VideoPlatform = 'youtube' | 'instagram'

export interface SocialVideo {
  id: string
  platform: VideoPlatform
  /** Link asli dari platform (mis. URL Reels / YouTube). Diparse jadi URL embed. */
  url: string
  title: string
  /**
   * true = `url` masih link contoh bawaan seeder, bukan konten OLEHKITA asli.
   * Kartu akan menampilkan "Video belum tersedia" alih-alih menyematkan video
   * milik orang lain yang tidak nyambung dengan judulnya. Hapus flag ini (atau
   * ganti url lewat panel admin) begitu link aslinya dipasang.
   */
  placeholder?: boolean
}
