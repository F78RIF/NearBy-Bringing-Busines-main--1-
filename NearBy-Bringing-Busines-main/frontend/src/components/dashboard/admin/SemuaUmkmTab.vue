<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'

const dashboard = useDashboardStore()
</script>

<template>
  <div class="mb-[22px]">
    <h1 class="m-0 text-[29px] font-extrabold tracking-[-.02em]">Semua UMKM</h1>
    <p class="mt-[7px] text-text-muted">Pantau seluruh UMKM yang terdaftar. Edit &amp; hapus dilakukan oleh pemilik UMKM masing-masing.</p>
  </div>

  <div class="overflow-x-auto rounded-[18px] border border-border-card bg-white px-5 pt-2 pb-3.5">
    <div class="grid min-w-[660px] grid-cols-[2.2fr_1fr_1fr_.7fr_1fr] gap-3 border-b border-border-divider px-1.5 py-3.5 text-xs font-extrabold tracking-[.04em] text-[#B0A990] uppercase">
      <div>Nama UMKM</div>
      <div>Kategori</div>
      <div>Wilayah</div>
      <div>Rating</div>
      <div class="text-right">Aksi</div>
    </div>
    <div
      v-for="u in dashboard.allUmkmAdmin"
      :key="u.id"
      class="grid min-w-[660px] grid-cols-[2.2fr_1fr_1fr_.7fr_1fr] items-center gap-3 border-b border-[#F4EFE4] px-1.5 py-3 last:border-b-0"
    >
      <div class="flex min-w-0 items-center gap-3">
        <div class="h-[42px] w-[42px] flex-none rounded-[10px]" style="background: repeating-linear-gradient(135deg, #ece6da 0 8px, #f4efe6 8px 16px)" />
        <div class="min-w-0">
          <div class="overflow-hidden text-[14.5px] font-extrabold text-ellipsis whitespace-nowrap">{{ u.name }}</div>
          <span class="rounded-md px-2 py-0.5 text-[11.5px] font-bold" :style="{ color: u.statusColor, background: u.statusBg }">{{ u.status }}</span>
        </div>
      </div>
      <div><span class="rounded-full px-2.5 py-1 text-xs font-bold" :style="{ background: u.soft, color: u.accent }">{{ u.cat }}</span></div>
      <div class="text-[13.5px] font-semibold text-text-secondary">{{ u.loc }}</div>
      <div class="text-sm font-extrabold text-gold">★ {{ u.rating }}</div>
      <div class="flex justify-end">
        <button
          type="button"
          class="rounded-[9px] border px-[13px] py-2 text-[13px] font-bold whitespace-nowrap"
          :class="u.hidden ? 'border-[#8FC3B8] text-teal-deep hover:bg-teal-tint' : 'border-[#E7C97F] text-[#B07A1E] hover:bg-[#FBF3E4]'"
          @click="dashboard.adminToggleHidden(u.id, u.name)"
        >
          {{ u.hidden ? 'Aktifkan' : 'Nonaktifkan' }}
        </button>
      </div>
    </div>
  </div>
</template>
