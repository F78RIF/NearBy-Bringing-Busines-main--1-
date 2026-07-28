import type { SocialVideo } from '@/types'

/**
 * Konten video promosi OLEHKITA dari akun media sosial.
 *
 * ⚠️ SEMUA URL DI BAWAH MASIH LINK CONTOH, BUKAN KONTEN OLEHKITA.
 *
 * Itulah sebabnya kartu "Cerita UMKM Kuliner Balikpapan" menampilkan video
 * milik akun lain yang sama sekali tidak berhubungan dengan judulnya —
 * `ScMzIvxBSi4` adalah video sampel YouTube, bukan liputan UMKM Balikpapan.
 *
 * CARA MENGGANTI DENGAN VIDEO ASLI:
 *   1. Ganti `url` di bawah dengan link asli dari akun OLEHKITA.
 *      - YouTube biasa : https://www.youtube.com/watch?v=XXXXXXXXXXX
 *      - YouTube Shorts: https://www.youtube.com/shorts/XXXXXXXXXXX
 *      - Instagram Reel: https://www.instagram.com/reel/XXXXXXXXXXX/
 *   2. HAPUS baris `placeholder: true` pada entri tersebut.
 *      Selama flag itu masih ada, kartu sengaja menampilkan
 *      "Video belum tersedia" dan tidak menyematkan video siapa pun.
 *
 * Alternatif tanpa menyentuh kode: login sebagai admin → Dashboard →
 * "Konten Video", tambahkan video di sana lalu hapus entri contoh ini.
 * Video yang ditambahkan lewat panel tidak pernah ber-flag placeholder.
 */
export const SOCIAL_VIDEOS_SEED: SocialVideo[] = [
  {
    id: 'v1',
    platform: 'youtube',
    url: 'https://www.youtube.com/shorts/aqz-KE-bpKQ',
    title: 'Jelajah Oleh-Oleh Khas Balikpapan',
    placeholder: true,
  },
  {
    id: 'v2',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/C2s6y6bML0S/',
    title: 'Amplang & Kerupuk Kuku Macan',
    placeholder: true,
  },
  {
    id: 'v3',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    title: 'Cerita UMKM Kuliner Balikpapan',
    placeholder: true,
  },
]
