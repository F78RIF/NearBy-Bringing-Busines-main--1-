<script setup lang="ts">
import { useUmkmStore } from '@/stores/umkm'
import { CATEGORY_FILTERS, LOCATION_FILTERS } from '@/data/categories'
import UmkmCard from '@/components/shared/UmkmCard.vue'
import FilterChip from '@/components/shared/FilterChip.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const umkm = useUmkmStore()
</script>

<template>
  <main class="mx-auto max-w-[1200px] px-6 pt-11 pb-20">
    <div class="mb-[26px]">
      <h1 class="m-0 text-[28px] font-extrabold tracking-[-.02em] mobile:text-[32px] tablet:text-[38px]">Daftar UMKM</h1>
      <p class="mt-2 text-base text-text-muted">Temukan usaha lokal terbaik berdasarkan kategori, jenis, dan wilayahnya.</p>
    </div>

    <div class="mb-[22px] flex items-center gap-2 rounded-[14px] border border-border-card bg-white p-[7px] shadow-[0_4px_18px_rgba(19,50,77,.04)]">
      <span class="pl-3 text-[17px] text-[#A79D89]">⌕</span>
      <input v-model="umkm.q" placeholder="Cari UMKM…" class="flex-1 border-none px-1 py-2.5 font-medium text-brand-navy" />
    </div>

    <div class="mb-3">
      <div class="mb-2.5 text-xs font-bold tracking-[.06em] text-text-faint uppercase">Kategori</div>
      <div class="flex flex-wrap gap-2.5">
        <FilterChip
          v-for="c in CATEGORY_FILTERS"
          :key="c"
          :label="c"
          :active="umkm.cat === c"
          @click="umkm.cat = c"
        />
      </div>
    </div>
    <div class="mb-6">
      <div class="my-3.5 mb-2.5 text-xs font-bold tracking-[.06em] text-text-faint uppercase">Wilayah</div>
      <div class="flex flex-wrap gap-2.5">
        <FilterChip
          v-for="l in LOCATION_FILTERS"
          :key="l"
          :label="l"
          :active="umkm.loc === l"
          @click="umkm.loc = l"
        />
      </div>
    </div>

    <div class="my-[26px] mb-4 flex items-center justify-between">
      <div class="font-bold text-brand-navy">{{ umkm.filteredDirectory.length }} UMKM ditemukan</div>
      <div class="text-[13px] font-semibold text-text-faint">Diurutkan: Rating tertinggi</div>
    </div>

    <div v-if="umkm.filteredDirectory.length" class="grid grid-cols-1 gap-5 mobile:grid-cols-2 tablet:grid-cols-3">
      <UmkmCard v-for="u in umkm.filteredDirectory" :key="u.id" :umkm="u" size="lg" />
    </div>
    <EmptyState v-else title="Tidak ada UMKM yang cocok" subtitle="Coba ubah kategori, wilayah, atau kata kunci." />
  </main>
</template>
