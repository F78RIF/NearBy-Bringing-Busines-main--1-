<script setup lang="ts">
import { useContentStore } from '@/stores/content'
import SocialVideoEmbed from '@/components/shared/SocialVideoEmbed.vue'

const content = useContentStore()
</script>

<template>
  <section v-if="content.videos.length" class="mx-auto max-w-[1200px] px-6 pt-[54px] pb-5">
    <div v-reveal class="mb-[26px] flex items-end justify-between gap-5">
      <div>
        <div class="text-[13px] font-bold tracking-[.08em] text-gold uppercase">Konten Terbaru</div>
        <h2 class="mt-1.5 text-[24px] font-extrabold tracking-[-.02em] mobile:text-[28px] tablet:text-[32px]">
          Video dari medsos OLEHKITA
        </h2>
        <p class="mt-1.5 max-w-[560px] text-[14px] text-text-secondary">
          Cuplikan UMKM & oleh-oleh khas Balikpapan langsung dari Instagram &amp; YouTube kami.
        </p>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-5 mobile:grid-cols-2 tablet:grid-cols-3">
      <SocialVideoEmbed
        v-for="(v, i) in content.videos"
        :key="v.id"
        v-reveal="{ delay: i * 60 }"
        :video="v"
      />
    </div>
  </section>
</template>
