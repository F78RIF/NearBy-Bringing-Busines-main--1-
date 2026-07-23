<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { useDashboardStore } from '@/stores/dashboard'

const ui = useUiStore()
const dashboard = useDashboardStore()
</script>

<template>
  <div class="mb-[22px]">
    <h1 class="m-0 text-[29px] font-extrabold tracking-[-.02em]">Pengguna</h1>
    <p class="mt-[7px] text-text-muted">Kelola akun pengguna yang terdaftar di NearBy Balikpapan.</p>
  </div>

  <div class="overflow-x-auto rounded-[18px] border border-border-card bg-white px-5 pt-2 pb-3.5">
    <div class="grid min-w-[560px] grid-cols-[2fr_1.1fr_.9fr_auto] gap-3 border-b border-border-divider px-1.5 py-3.5 text-xs font-extrabold tracking-[.04em] text-[#B0A990] uppercase">
      <div>Pengguna</div>
      <div>Peran</div>
      <div>Status</div>
      <div class="text-right">Aksi</div>
    </div>
    <div
      v-for="u in dashboard.users"
      :key="u.email"
      class="grid min-w-[560px] grid-cols-[2fr_1.1fr_.9fr_auto] items-center gap-3 border-b border-[#F4EFE4] px-1.5 py-3 last:border-b-0"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <div class="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-brand-blue-tint font-extrabold text-brand-blue">
          {{ u.initial }}
        </div>
        <div class="min-w-0">
          <div class="overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap">{{ u.name }}</div>
          <div class="overflow-hidden text-[12.5px] text-ellipsis whitespace-nowrap text-text-faint">{{ u.email }}</div>
        </div>
      </div>
      <div><span class="rounded-full px-2.5 py-1 text-[11.5px] font-bold" :style="{ background: u.roleBg, color: u.roleColor }">{{ u.role }}</span></div>
      <div><span class="rounded-full px-2.5 py-1 text-[11.5px] font-bold" :style="{ color: u.statusColor, background: u.statusBg }">{{ u.status }}</span></div>
      <div class="text-right">
        <button
          v-if="u.deleted"
          type="button"
          class="rounded-[9px] bg-brand-blue-tint px-[13px] py-2 text-[13px] font-bold whitespace-nowrap text-brand-blue"
          @click="dashboard.userRestore(u.email)"
        >
          Pulihkan akun
        </button>
        <button v-else type="button" class="rounded-[9px] border border-[#E7E0D2] px-[13px] py-2 text-[13px] font-bold text-brand-navy" @click="ui.openModal('manageUser', u)">
          Kelola
        </button>
      </div>
    </div>
  </div>
</template>
