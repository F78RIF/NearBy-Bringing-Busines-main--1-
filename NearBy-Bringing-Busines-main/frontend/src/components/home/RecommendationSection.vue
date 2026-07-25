<script setup lang="ts">
import { computed } from 'vue'
import { useUmkmStore } from '@/stores/umkm'
import { useAuthStore } from '@/stores/auth'
import UmkmCard from '@/components/shared/UmkmCard.vue'

const umkm = useUmkmStore()
const auth = useAuthStore()

const greeting = computed(() =>
  auth.isAuthed ? `Rekomendasi untuk ${auth.authFirst}` : 'Rekomendasi untuk kamu',
)

/** Subjudul menjelaskan dasar rekomendasi (minat vs populer/fallback). */
const subtitle = computed(() =>
  umkm.recommendedByInterest
    ? 'Berdasarkan kategori UMKM yang kamu favoritkan'
    : 'UMKM populer dengan rating tertinggi — favoritkan beberapa UMKM untuk rekomendasi yang lebih personal',
)
</script>

<template>
  <section v-if="umkm.recommendations.length" class="mx-auto max-w-[1200px] px-6 pt-[54px] pb-5">
    <div v-reveal class="mb-[26px] flex items-end justify-between gap-5">
      <div>
        <div class="text-[13px] font-bold tracking-[.08em] text-gold uppercase">
          {{ umkm.recommendedByInterest ? 'Sesuai minatmu' : 'Untuk kamu' }}
        </div>
        <h2 class="mt-1.5 text-[24px] font-extrabold tracking-[-.02em] mobile:text-[28px] tablet:text-[32px]">
          {{ greeting }}
        </h2>
        <p class="mt-1.5 max-w-[560px] text-[14px] text-text-secondary">{{ subtitle }}</p>
      </div>
      <RouterLink :to="{ name: 'daftar' }" class="font-bold whitespace-nowrap text-brand-blue">
        Jelajahi semua →
      </RouterLink>
    </div>
    <div class="grid grid-cols-1 gap-5 mobile:grid-cols-2 tablet:grid-cols-4">
      <UmkmCard
        v-for="(u, i) in umkm.recommendations"
        :key="u.id"
        v-reveal="{ delay: i * 60 }"
        :umkm="u"
      />
    </div>
  </section>
</template>
