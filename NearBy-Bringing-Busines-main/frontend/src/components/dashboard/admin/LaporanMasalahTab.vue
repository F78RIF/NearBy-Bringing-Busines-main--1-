<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import type { ProblemReportStatus } from '@/types'

const dashboard = useDashboardStore()

const STATUS_OPTIONS: ProblemReportStatus[] = ['Baru', 'Ditinjau', 'Selesai']

const KIND_META: Record<string, { c: string; b: string }> = {
  'Tampilan / UI': { c: '#2C5EAD', b: '#E6EDF8' },
  'Fungsi tidak jalan': { c: '#C0472F', b: '#F8E6E0' },
  'Data UMKM salah': { c: '#C98A2E', b: '#F7EDDC' },
  'Login / akun': { c: '#5B6672', b: '#EEF0F2' },
  Lainnya: { c: '#8A8578', b: '#EEEADF' },
}
function kindMeta(kind: string) {
  return KIND_META[kind] ?? KIND_META.Lainnya
}
</script>

<template>
  <div class="mb-[22px] flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="m-0 text-[29px] font-extrabold tracking-[-.02em]">Laporan Masalah</h1>
      <p class="mt-[7px] text-text-muted">
        Laporan bug &amp; kendala yang dikirim pengguna lewat tombol Bantuan.
        <span v-if="dashboard.newReportCount" class="font-bold text-gold">{{ dashboard.newReportCount }} baru</span>
      </p>
    </div>
  </div>

  <div v-if="!dashboard.problemReports.length" class="rounded-[18px] border border-border-card bg-white px-6 py-16 text-center">
    <div class="text-[42px]">🛠️</div>
    <div class="mt-3 text-[19px] font-extrabold text-brand-navy">Belum ada laporan masalah</div>
    <p class="mx-auto mt-2 max-w-[420px] text-[14.5px] leading-relaxed text-text-muted">
      Laporan yang dikirim pengguna lewat "Pusat Bantuan → Laporkan masalah" akan muncul di sini.
    </p>
  </div>

  <div v-else class="flex flex-col gap-3.5">
    <div v-for="r in dashboard.problemReports" :key="r.id" class="rounded-[18px] border border-border-card bg-white p-5 shadow-[0_4px_16px_rgba(19,50,77,.04)]">
      <div class="flex flex-wrap items-center gap-2.5">
        <span class="rounded-full px-[11px] py-1 text-[11.5px] font-bold" :style="{ background: kindMeta(r.kind).b, color: kindMeta(r.kind).c }">
          {{ r.kind }}
        </span>
        <span class="rounded-full px-[11px] py-1 text-[11.5px] font-bold" :style="{ background: r.statusBg, color: r.statusColor }">
          {{ r.status }}
        </span>
        <span class="ml-auto text-[12.5px] font-semibold text-text-faint">{{ r.when }}</span>
      </div>

      <p class="mt-3 text-[14.5px] leading-relaxed text-text-secondary">{{ r.text }}</p>

      <div class="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-border-divider-2 pt-3.5">
        <div class="text-[13px] font-semibold text-text-faint">Dilaporkan oleh <span class="font-bold text-brand-navy">{{ r.name }}</span></div>
        <div class="flex gap-1.5">
          <button
            v-for="opt in STATUS_OPTIONS"
            :key="opt"
            type="button"
            class="rounded-[9px] px-3.5 py-1.5 text-[12.5px] font-bold"
            :class="opt === r.status ? '' : 'text-text-faint'"
            :style="opt === r.status ? { background: r.statusBg, color: r.statusColor } : { background: '#F4F0E7' }"
            @click="dashboard.setProblemReportStatus(r.id, opt)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
