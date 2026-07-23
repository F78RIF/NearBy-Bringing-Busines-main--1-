<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { useUmkmStore } from '@/stores/umkm'
import { useDashboardStore } from '@/stores/dashboard'

const ui = useUiStore()
const umkm = useUmkmStore()
const dashboard = useDashboardStore()

function addUmkm() {
  ui.openModal('editUmkm', { isNew: true })
}
function manage(name: string) {
  const full = umkm.enrichedAll.find((r) => r.name === name)
  ui.openModal('editUmkm', full ?? { name })
}
</script>

<template>
  <div class="mb-[22px] flex flex-wrap items-center justify-between gap-4">
    <div>
      <h1 class="m-0 text-[29px] font-extrabold tracking-[-.02em]">UMKM Saya</h1>
      <p class="mt-1.5 text-text-muted">Kelola daftar usaha yang kamu miliki di NearBy Balikpapan.</p>
    </div>
    <button type="button" class="rounded-xl bg-brand-blue px-[22px] py-[13px] font-bold text-white shadow-[0_8px_20px_rgba(44,94,173,.25)]" @click="addUmkm">
      + Tambah UMKM
    </button>
  </div>

  <div class="flex flex-col gap-3.5">
    <div v-for="u in dashboard.myUmkm" :key="u.name" class="rounded-[18px] border border-border-card bg-white p-5 shadow-[0_4px_16px_rgba(19,50,77,.04)]">
      <div class="flex items-start gap-4">
        <div class="h-[72px] w-[72px] flex-none rounded-[14px]" style="background: repeating-linear-gradient(135deg, #ece6da 0 9px, #f4efe6 9px 18px)" />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="text-lg font-extrabold">{{ u.name }}</div>
            <span class="rounded-full px-[11px] py-1 text-[11.5px] font-bold" :style="{ background: u.catSoft, color: u.catAccent }">{{ u.cat }}</span>
            <span class="rounded-full px-[11px] py-1 text-[11.5px] font-bold" :style="{ background: u.statusBg, color: u.statusColor }">{{ u.status }}</span>
          </div>
          <div class="mt-1.5 text-[13.5px] font-semibold text-text-faint">{{ u.loc }}</div>
          <div class="mt-3.5 flex gap-6">
            <div>
              <div class="text-base font-extrabold text-gold">★ {{ u.rating }}</div>
              <div class="text-[11.5px] font-semibold text-text-faint">rating</div>
            </div>
            <div>
              <div class="text-base font-extrabold">{{ u.reviews }}</div>
              <div class="text-[11.5px] font-semibold text-text-faint">ulasan</div>
            </div>
            <div>
              <div class="text-base font-extrabold">{{ u.views }}</div>
              <div class="text-[11.5px] font-semibold text-text-faint">kunjungan</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 border-t border-border-divider-2 pt-[15px]">
        <div class="mb-3.5 flex flex-wrap items-center gap-[11px]">
          <span class="text-[13px] font-extrabold text-brand-navy">Status buka:</span>
          <div class="flex gap-1.5">
            <button
              v-for="o in u.statusOptions"
              :key="o.label"
              type="button"
              class="rounded-[9px] px-3.5 py-1.5 text-[12.5px] font-bold"
              :style="{ background: o.bg, color: o.color }"
              @click="o.onClick"
            >
              {{ o.label }}
            </button>
          </div>
          <span class="text-xs font-semibold text-text-faint">UMKM tetap tampil walau libur/tutup</span>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" class="rounded-[11px] bg-brand-blue px-5 py-2.5 font-bold text-white" @click="manage(u.name)">Kelola &amp; edit</button>
          <button
            type="button"
            class="rounded-[11px] border border-danger-border px-[18px] py-2.5 font-bold text-danger"
            @click="dashboard.ownerDeleteUmkm(u.name, u.cat, u.loc)"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
