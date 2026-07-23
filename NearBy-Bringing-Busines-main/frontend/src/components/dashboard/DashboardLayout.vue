<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useDashboardStore } from '@/stores/dashboard'
import logo from '@/assets/logo-nearby.png'

const props = defineProps<{ tab: string }>()

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const dashboard = useDashboardStore()

const isAdmin = computed(() => auth.user?.role === 'admin')

const adminMenu = computed(() => [
  { key: 'verif', label: 'Verifikasi UMKM' },
  { key: 'all', label: 'Semua UMKM' },
  { key: 'users', label: 'Pengguna' },
  { key: 'report', label: 'Laporan' },
  { key: 'masalah', label: dashboard.newReportCount ? `Laporan Masalah (${dashboard.newReportCount})` : 'Laporan Masalah' },
])
const ownerMenu = computed(() => [
  { key: 'ringkasan', label: 'Ringkasan' },
  { key: 'myumkm', label: 'UMKM Saya' },
  { key: 'ulasan', label: 'Ulasan' },
  { key: 'trash', label: dashboard.ownerTrash.length ? `Tempat Sampah (${dashboard.ownerTrash.length})` : 'Tempat Sampah' },
])
const menu = computed(() => (isAdmin.value ? adminMenu.value : ownerMenu.value))

function goTab(key: string) {
  router.push({ name: 'dashboard', params: { tab: key } })
}

function logout() {
  ui.closeProfileMenu()
  auth.logout()
  router.push({ name: 'beranda' })
}
</script>

<template>
  <div class="min-h-screen bg-dash-bg">
    <header class="sticky top-0 z-40 border-b border-[#E9E2D4] bg-white">
      <div class="mx-auto flex h-16 max-w-[1300px] items-center gap-3.5 px-6">
        <img :src="logo" class="h-9 w-9 object-contain" />
        <div class="leading-[1.1]">
          <div class="text-[15px] font-extrabold">
            Near<span class="text-brand-blue">By</span>
            <span class="font-bold text-text-faint-3"> · </span>
            <span class="text-sm font-bold text-text-faint">Panel</span>
          </div>
          <div class="text-[11px] font-bold tracking-[.03em] text-gold">{{ auth.authRoleLabel }}</div>
        </div>
        <div class="ml-auto flex items-center gap-2.5">
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2.5 rounded-full border border-[#EEE7D9] bg-white py-1.5 pr-3 pl-1.5"
              @click="ui.toggleProfileMenu"
            >
              <div class="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                {{ auth.authInitial }}
              </div>
              <div class="text-[13px] font-bold">{{ auth.user?.name }}</div>
              <span class="ml-0.5 text-[11px] text-text-faint-3">▾</span>
            </button>
            <div
              v-if="ui.profileMenuOpen"
              class="absolute top-[calc(100%+8px)] right-0 z-[60] min-w-[178px] rounded-[13px] border border-border-hairline bg-white p-1.5 shadow-[0_14px_34px_rgba(9,24,40,.16)]"
            >
              <button
                type="button"
                class="block w-full rounded-[9px] px-[13px] py-2.5 text-left text-[13.5px] font-bold text-brand-navy hover:bg-surface-alt"
                @click="ui.openSettings"
              >
                Pengaturan
              </button>
              <button
                type="button"
                class="block w-full rounded-[9px] px-[13px] py-2.5 text-left text-[13.5px] font-bold text-danger hover:bg-danger-tint"
                @click="logout"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="mx-auto grid max-w-[1300px] grid-cols-1 items-start gap-[26px] px-6 pt-[26px] pb-[70px] tablet:grid-cols-[224px_1fr]">
      <aside class="static rounded-[18px] border border-border-card bg-white p-3.5 tablet:sticky tablet:top-[88px]">
        <div class="px-3 pt-1.5 pb-2.5 text-[11px] font-extrabold tracking-[.08em] text-[#B0A990] uppercase">Menu</div>
        <button
          v-for="m in menu"
          :key="m.key"
          type="button"
          class="mb-[3px] block w-full rounded-[11px] px-3.5 py-2.5 text-left text-sm font-bold transition-colors duration-150"
          :class="props.tab === m.key ? 'bg-brand-blue-tint-2 text-brand-blue' : 'text-[#4B5563]'"
          @click="goTab(m.key)"
        >
          {{ m.label }}
        </button>
      </aside>

      <div><slot /></div>
    </div>
  </div>
</template>
