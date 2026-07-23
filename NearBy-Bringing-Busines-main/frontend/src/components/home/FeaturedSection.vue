<script setup lang="ts">
import { useUmkmStore } from '@/stores/umkm'
import UmkmCard from '@/components/shared/UmkmCard.vue'

const umkm = useUmkmStore()
</script>

<template>
  <section class="mx-auto max-w-[1200px] px-6 pt-[54px] pb-5">
    <div v-reveal class="mb-[26px] flex items-end justify-between gap-5">
      <div>
        <div class="text-[13px] font-bold tracking-[.08em] text-gold uppercase">Pilihan warga</div>
        <h2 class="mt-1.5 text-[24px] font-extrabold tracking-[-.02em] mobile:text-[28px] tablet:text-[32px]">UMKM unggulan minggu ini</h2>
      </div>
      <RouterLink :to="{ name: 'daftar' }" class="font-bold whitespace-nowrap text-brand-blue">Jelajahi semua →</RouterLink>
    </div>
    <div class="grid grid-cols-1 gap-5 mobile:grid-cols-2 tablet:grid-cols-4">
      <UmkmCard v-for="(u, i) in umkm.featured" :key="u.id" v-reveal="{ delay: i * 60 }" :umkm="u" />
    </div>
  </section>
</template>
