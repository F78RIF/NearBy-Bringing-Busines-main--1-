<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUmkmStore } from '@/stores/umkm'

const router = useRouter()
const umkm = useUmkmStore()

function open(full: string) {
  umkm.filterByLocation(full)
  router.push({ name: 'daftar' })
}
</script>

<template>
  <section class="mx-auto max-w-[1200px] px-6 pt-[54px] pb-5">
    <div v-reveal class="mb-[26px]">
      <div class="text-[13px] font-bold tracking-[.08em] text-gold uppercase">Berdasarkan lokasi</div>
      <h2 class="mt-1.5 text-[24px] font-extrabold tracking-[-.02em] mobile:text-[28px] tablet:text-[32px]">Jelajahi per wilayah</h2>
    </div>
    <div class="grid grid-cols-2 gap-3.5 mobile:grid-cols-3 tablet:grid-cols-6">
      <div
        v-for="(r, i) in umkm.regionCards"
        :key="r.full"
        v-reveal="{ delay: i * 60 }"
        class="relative h-[150px] cursor-pointer overflow-hidden rounded-[18px]"
        style="background: repeating-linear-gradient(135deg, #26456b 0 12px, #2c5079 12px 24px)"
        @click="open(r.full)"
      >
        <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent 30%, rgba(9, 24, 40, 0.82))" />
        <div class="absolute bottom-3.5 left-[15px] text-white">
          <div class="text-[16px] font-extrabold">{{ r.short }}</div>
          <div class="text-[12.5px] font-semibold text-[#C6D6EC]">{{ r.count }} UMKM</div>
        </div>
      </div>
    </div>
  </section>
</template>
