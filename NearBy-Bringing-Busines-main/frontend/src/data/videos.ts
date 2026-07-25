import type { SocialVideo } from '@/types'

/**
 * Konten video promosi OLEHKITA dari akun media sosial.
 * Data awal (seed) — admin bisa menambah/mengganti lewat panel "Konten Video".
 * Ganti URL di bawah dengan link Reels / YouTube milik akun OLEHKITA yang asli.
 */
export const SOCIAL_VIDEOS_SEED: SocialVideo[] = [
  {
    id: 'v1',
    platform: 'youtube',
    url: 'https://www.youtube.com/shorts/aqz-KE-bpKQ',
    title: 'Jelajah Oleh-Oleh Khas Balikpapan',
  },
  {
    id: 'v2',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/C2s6y6bML0S/',
    title: 'Amplang & Kerupuk Kuku Macan',
  },
  {
    id: 'v3',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    title: 'Cerita UMKM Kuliner Balikpapan',
  },
]
