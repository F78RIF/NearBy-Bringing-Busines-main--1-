<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUmkmStore } from '@/stores/umkm'

const router = useRouter()
const umkm = useUmkmStore()

function open(name: string) {
  umkm.filterByCategory(name)
  router.push({ name: 'daftar' })
}
</script>

<template>
  <section class="mx-auto max-w-[1200px] px-6 pt-[70px] pb-5">
    <div v-reveal class="mb-[26px] flex items-end justify-between gap-5">
      <div>
        <div class="text-[13px] font-bold tracking-[.08em] text-gold uppercase">Jelajahi kategori</div>
        <h2 class="mt-1.5 text-[24px] font-extrabold tracking-[-.02em] mobile:text-[28px] tablet:text-[32px]">Mau cari apa hari ini?</h2>
      </div>
      <RouterLink :to="{ name: 'daftar' }" class="font-bold whitespace-nowrap text-brand-blue">Lihat semua →</RouterLink>
    </div>
    <div class="grid grid-cols-2 gap-4 mobile:grid-cols-3 tablet:grid-cols-5">
      <div
        v-for="(c, i) in umkm.categoryCards"
        :key="c.name"
        v-reveal="{ delay: i * 60 }"
        class="cursor-pointer rounded-[18px] border border-border-card bg-white p-[22px] px-[18px] shadow-[0_4px_18px_rgba(19,50,77,.04)] transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(19,50,77,.1)]"
        @click="open(c.name)"
      >
        <div
          class="flex h-[54px] w-[54px] items-center justify-center rounded-[15px]"
          :style="{ background: c.soft }"
        >
          <img :src="c.icon" :alt="c.name" class="h-7 w-7 object-contain" />
        </div>
        <div class="mt-4 text-[16px] font-extrabold">{{ c.name }}</div>
        <div class="mt-0.5 text-[13px] font-semibold text-text-faint">{{ c.count }} tempat</div>
      </div>
    </div>
  </section>
</template>
