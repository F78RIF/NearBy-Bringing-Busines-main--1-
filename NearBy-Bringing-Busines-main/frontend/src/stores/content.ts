import { ref } from 'vue'
import { defineStore } from 'pinia'
import { SOCIAL_VIDEOS_SEED } from '@/data/videos'
import type { SocialVideo, VideoPlatform } from '@/types'

/**
 * Konten promosi yang bisa dikelola admin — saat ini video medsos (Instagram
 * Reels & YouTube) untuk section "Konten Terbaru" di landing page.
 * Mengikuti pola app (mock/Pinia); di produksi ganti dengan panggilan API.
 */
export const useContentStore = defineStore('content', () => {
  const videos = ref<SocialVideo[]>([...SOCIAL_VIDEOS_SEED])

  function addVideo(platform: VideoPlatform, url: string, title: string) {
    videos.value.unshift({
      id: `v${Date.now()}`,
      platform,
      url: url.trim(),
      title: title.trim() || 'Konten OLEHKITA',
    })
  }

  function updateVideo(id: string, patch: Partial<Omit<SocialVideo, 'id'>>) {
    const v = videos.value.find((x) => x.id === id)
    if (v) Object.assign(v, patch)
  }

  function removeVideo(id: string) {
    videos.value = videos.value.filter((v) => v.id !== id)
  }

  return { videos, addVideo, updateVideo, removeVideo }
})
