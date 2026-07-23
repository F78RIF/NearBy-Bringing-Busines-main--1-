<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { OWNER_REVIEWS } from '@/data/dashboardSeed'
import { starsLabel } from '@/data/reviews'

const ui = useUiStore()
</script>

<template>
  <div class="mb-[22px]">
    <h1 class="m-0 text-[29px] font-extrabold tracking-[-.02em]">Ulasan</h1>
    <p class="mt-1.5 text-text-muted">Semua ulasan dari warga untuk usaha-usahamu.</p>
  </div>

  <div class="rounded-[18px] border border-border-card bg-white px-6 pt-2 pb-3">
    <div v-for="r in OWNER_REVIEWS" :key="`${r.name}-${r.date}`" class="flex gap-3.5 border-t border-border-divider-2 py-4.5 first:border-t-0">
      <div class="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#F7EDDC] text-[15px] font-extrabold text-gold">{{ r.initial }}</div>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="text-[15px] font-extrabold">{{ r.name }}</div>
          <div class="text-[13px] font-bold text-gold">{{ starsLabel(r.stars) }}</div>
          <div class="text-[12.5px] font-semibold text-[#B0A990]">· {{ r.date }}</div>
        </div>
        <div class="mt-0.5 text-[12.5px] font-bold text-brand-blue">untuk {{ r.umkm }}</div>
        <div class="mt-[7px] text-sm leading-relaxed text-[#5B6470]">{{ r.text }}</div>
        <button
          type="button"
          class="mt-[11px] rounded-[10px] border border-[#E7E0D2] px-4 py-2 text-[13px] font-bold text-brand-navy"
          @click="ui.openModal('replyReview', r)"
        >
          ↩ Balas
        </button>
      </div>
    </div>
  </div>
</template>
