<script setup lang="ts">
import { computed } from 'vue'
import type { SocialVideo } from '@/types'

const props = defineProps<{ video: SocialVideo }>()

/** Ambil ID video YouTube dari berbagai bentuk URL (watch, youtu.be, shorts, embed). */
function youtubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

const isShorts = computed(() => props.video.url.includes('/shorts/'))

/** Ambil shortcode Instagram dari URL reel/p/tv. */
function instagramCode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/)
  return m ? m[1] : null
}

/**
 * URL embed resmi (iframe) — tidak mengunduh/scrape video, hanya menyematkan
 * pemutar resmi platform sehingga aman terhadap hak cipta & ToS.
 */
const embedUrl = computed<string | null>(() => {
  if (props.video.platform === 'youtube') {
    const id = youtubeId(props.video.url)
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  const code = instagramCode(props.video.url)
  return code ? `https://www.instagram.com/reel/${code}/embed` : null
})

/** Reels & Shorts vertikal (9:16); video YouTube biasa 16:9. */
const portrait = computed(() => props.video.platform === 'instagram' || isShorts.value)

/**
 * Batas lebar kartu. Rasio dijaga oleh aspect-ratio pada media box, jadi lebar
 * inilah yang menentukan tinggi akhir video.
 *
 * - Landscape (16:9): dibatasi 780px supaya tidak melebar berlebihan di monitor
 *   lebar; pada 780px tingginya 439px.
 * - Portrait (9:16): dibatasi 400px, TAPI juga diikat ke tinggi viewport lewat
 *   `calc(72vh*9/16)`. Tanpa ikatan itu sebuah reel 400px akan setinggi 711px —
 *   lebih tinggi dari layar HP. Yang terkecil di antara keduanya yang menang,
 *   jadi reel tidak pernah lebih tinggi dari ~72% layar, termasuk saat HP
 *   diputar landscape.
 */
const widthClass = computed(() =>
  portrait.value ? 'max-w-[min(400px,calc(72vh*9/16))]' : 'max-w-[780px]',
)
</script>

<template>
  <figure
    class="mx-auto w-full overflow-hidden rounded-2xl border border-border-card bg-white shadow-[0_8px_24px_rgba(9,24,40,.06)]"
    :class="widthClass"
  >
    <!-- Media box: selalu 100% lebar induk + aspect-ratio, tidak pernah px tetap. -->
    <div class="relative w-full bg-[#0F1E2D]" :class="portrait ? 'aspect-[9/16]' : 'aspect-video'">
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        :title="video.title"
        class="absolute inset-0 h-full w-full"
        frameborder="0"
        loading="lazy"
        scrolling="no"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      />
      <div
        v-else
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-white/80"
      >
        <span class="text-2xl">⚠️</span>
        <span class="text-[13px] font-semibold">Link video tidak valid</span>
        <span class="text-[11px] text-white/50 break-all">{{ video.url }}</span>
      </div>
    </div>
    <figcaption class="flex items-center gap-2 px-3.5 py-3">
      <span
        class="flex-none rounded-full px-2 py-0.5 text-[10.5px] font-extrabold"
        :style="
          video.platform === 'instagram'
            ? { background: '#FCE7F0', color: '#C13584' }
            : { background: '#FBE4E4', color: '#C0392B' }
        "
      >
        {{ video.platform === 'instagram' ? 'Instagram' : 'YouTube' }}
      </span>
      <span class="min-w-0 flex-1 truncate text-[13.5px] font-bold text-brand-navy">{{ video.title }}</span>
    </figcaption>
  </figure>
</template>
