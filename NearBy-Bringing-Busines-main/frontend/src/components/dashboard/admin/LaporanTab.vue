<script setup lang="ts">
import { computed } from 'vue'
import { useUmkmStore } from '@/stores/umkm'
import { useDashboardStore } from '@/stores/dashboard'
import { reportStats, GROWTH_BARS } from '@/data/dashboardSeed'

const umkm = useUmkmStore()
const dashboard = useDashboardStore()

const stats = computed(() => reportStats(umkm.all.length))
const maxGrowth = Math.max(...GROWTH_BARS.map((b) => b.val))
const growthBars = GROWTH_BARS.map((b) => ({ ...b, pct: Math.round((b.val / maxGrowth) * 100) }))
</script>

<template>
  <div class="mb-[22px]">
    <h1 class="m-0 text-[29px] font-extrabold tracking-[-.02em]">Laporan</h1>
    <p class="mt-[7px] text-text-muted">Ringkasan pertumbuhan dan statistik platform NearBy Balikpapan.</p>
  </div>

  <div class="mb-[22px] grid grid-cols-2 gap-4 tablet:grid-cols-4">
    <div v-for="s in stats" :key="s.label" class="rounded-2xl border border-border-card bg-white p-[18px]">
      <div class="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] text-[17px] font-extrabold" :style="{ background: s.soft, color: s.accent }">
        {{ s.icon }}
      </div>
      <div class="mt-[13px] text-[27px] font-extrabold tracking-[-.02em]">{{ s.value }}</div>
      <div class="text-[13px] font-semibold text-text-faint">{{ s.label }}</div>
    </div>
  </div>

  <div class="mb-[22px] grid grid-cols-1 gap-5 tablet:grid-cols-[1.4fr_1fr]">
    <div class="rounded-[18px] border border-border-card bg-white p-[22px]">
      <div class="text-[17px] font-extrabold">Pertumbuhan UMKM</div>
      <div class="text-[13px] font-semibold text-text-faint">6 bulan terakhir</div>
      <div class="mt-4 flex h-[170px] items-end gap-4">
        <div v-for="b in growthBars" :key="b.label" class="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div class="text-xs font-extrabold text-brand-blue">{{ b.val }}</div>
          <div class="w-full rounded-t-lg" style="background: linear-gradient(180deg, #4bb8fa, #2c5ead)" :style="{ height: `${b.pct}%` }" />
          <div class="text-[11.5px] font-bold text-text-faint">{{ b.label }}</div>
        </div>
      </div>
    </div>
    <div class="rounded-[18px] border border-border-card bg-white p-[22px]">
      <div class="mb-4 text-[17px] font-extrabold">UMKM per kategori</div>
      <div class="flex flex-col gap-3.5">
        <div v-for="c in dashboard.catBreakdown" :key="c.name">
          <div class="mb-1.5 flex justify-between text-[13.5px] font-bold">
            <span>{{ c.name }}</span>
            <span class="text-text-faint">{{ c.count }}</span>
          </div>
          <div class="h-[9px] overflow-hidden rounded-full bg-[#F0EADD]">
            <div class="h-full rounded-full" :style="{ background: c.accent, width: `${c.pct}%` }" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="rounded-[18px] border border-border-card bg-white p-[22px]">
    <div class="mb-3.5 text-[17px] font-extrabold">UMKM rating tertinggi</div>
    <div v-for="u in dashboard.topUmkm" :key="u.id" class="flex items-center gap-3.5 border-t border-border-divider-2 py-2.5 first:border-t-0">
      <div class="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-[#F4F0E7] text-[13px] font-extrabold">{{ u.rank }}</div>
      <div class="flex-1">
        <div class="text-[14.5px] font-bold">{{ u.name }}</div>
        <span class="rounded-full px-2.5 py-0.5 text-[11px] font-bold" :style="{ background: u.soft, color: u.accent }">{{ u.cat }}</span>
      </div>
      <div class="text-[13px] font-semibold text-text-faint">{{ u.reviews }} ulasan</div>
      <div class="font-extrabold text-gold">★ {{ u.rating }}</div>
    </div>
  </div>
</template>
