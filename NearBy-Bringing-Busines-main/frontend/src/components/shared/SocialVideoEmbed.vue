<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
 * Kartu masih data contoh bawaan seeder (lihat `data/videos.ts`), atau link-nya
 * tidak bisa diparse jadi URL embed. Dua-duanya ditampilkan sebagai pesan yang
 * jelas, bukan thumbnail video orang lain yang membingungkan.
 */
const unavailableReason = computed<'placeholder' | 'invalid' | null>(() => {
  if (props.video.placeholder) return 'placeholder'
  if (!embedUrl.value) return 'invalid'
  return null
})

/**
 * Latar blur diambil dari thumbnail video itu sendiri supaya area letterbox
 * tidak terasa seperti ruang kosong. Instagram tidak menyediakan URL thumbnail
 * publik, jadi reel jatuh ke latar gelap solid — sama-sama rapi.
 */
const backdropFailed = ref(false)
watch(() => props.video.url, () => (backdropFailed.value = false))

const backdropUrl = computed<string | null>(() => {
  if (backdropFailed.value || unavailableReason.value) return null
  if (props.video.platform !== 'youtube') return null
  const id = youtubeId(props.video.url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
})
</script>

<template>
  <!-- Lebar kartu seragam untuk semua orientasi — syarat supaya deretan kartu
       terlihat rapi; yang membedakan reel dan video biasa hanya isi panggung. -->
  <figure
    class="mx-auto w-full max-w-[440px] overflow-hidden rounded-2xl border border-border-card bg-white shadow-[0_8px_24px_rgba(9,24,40,.06)]"
  >
    <!--
      Panggung (stage) bertinggi TETAP — inilah yang menyamakan tinggi semua
      kartu. Tingginya dipegang variabel `--stage-h` supaya bisa diubah per
      breakpoint dan tetap bisa dipakai calc() oleh frame di dalamnya.
    -->
    <div
      class="relative grid w-full place-items-center overflow-hidden bg-[#0F1E2D] [--stage-h:400px] mobile:[--stage-h:430px] tablet:[--stage-h:440px]"
      style="height: var(--stage-h)"
    >
      <img
        v-if="backdropUrl"
        :src="backdropUrl"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-2xl"
        @error="backdropFailed = true"
      />

      <!--
        Frame: rasio asli video, di-"contain" ke dalam panggung.
        Lebarnya `min(100%, tinggi-panggung × rasio)` — dua batas sekaligus,
        jadi sisi mana pun yang lebih dulu mentok, sisi itu yang menentukan.
        Hasilnya letterbox (atas-bawah) untuk 16:9 dan pillarbox (kiri-kanan)
        untuk 9:16, tanpa crop dan tanpa rasio yang gepeng.
      -->
      <div v-if="!unavailableReason" class="relative" :class="portrait ? 'frame-portrait' : 'frame-landscape'">
        <iframe
          :src="embedUrl!"
          :title="video.title"
          class="absolute inset-0 h-full w-full"
          frameborder="0"
          loading="lazy"
          scrolling="no"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div v-else class="relative flex flex-col items-center justify-center gap-2 p-5 text-center">
        <span class="text-[26px]" aria-hidden="true">{{ unavailableReason === 'placeholder' ? '🎬' : '⚠️' }}</span>
        <span class="text-[14px] font-extrabold text-white">
          {{ unavailableReason === 'placeholder' ? 'Video belum tersedia' : 'Link video tidak valid' }}
        </span>
        <span class="max-w-[260px] text-[11.5px] leading-relaxed text-white/60">
          <template v-if="unavailableReason === 'placeholder'">
            Konten ini masih memakai link contoh. Admin bisa menggantinya lewat Dashboard → Konten Video.
          </template>
          <template v-else>Link tidak bisa dibaca sebagai video {{ video.platform === 'instagram' ? 'Instagram' : 'YouTube' }}.</template>
        </span>
        <span v-if="unavailableReason === 'invalid'" class="max-w-full text-[10.5px] break-all text-white/35">
          {{ video.url }}
        </span>
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

<style scoped>
/*
 * Rumusnya sama untuk kedua orientasi, hanya rasionya yang berbeda:
 *   lebar = min(lebar kartu, tinggi panggung × rasio)
 * Karena `aspect-ratio` yang menurunkan tinggi dari lebar, video mustahil
 * gepeng — batas kedua hanya mengecilkan lebarnya, bukan meregangkan tinggi.
 */
.frame-landscape {
  aspect-ratio: 16 / 9;
  width: min(100%, calc(var(--stage-h) * 16 / 9));
}

.frame-portrait {
  aspect-ratio: 9 / 16;
  width: min(100%, calc(var(--stage-h) * 9 / 16));
}
</style>
