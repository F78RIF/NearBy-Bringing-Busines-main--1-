<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import ProfileTab from './tabs/ProfileTab.vue'
import SecurityTab from './tabs/SecurityTab.vue'
import PermissionsTab from './tabs/PermissionsTab.vue'
import HistoryTab from './tabs/HistoryTab.vue'
import DeleteAccountTab from './tabs/DeleteAccountTab.vue'

const auth = useAuthStore()
const ui = useUiStore()

const NAV_DEFS = [
  { key: 'profil', label: 'Edit Profil', desc: 'Perbarui nama, email, dan nomor teleponmu.' },
  { key: 'keamanan', label: 'Keamanan', desc: 'Verifikasi dua langkah, perangkat, dan ganti kata sandi.' },
  { key: 'izin', label: 'Izin & Privasi', desc: 'Atur izin notifikasi, lokasi, dan penggunaan data.' },
  { key: 'history', label: 'History', desc: 'Riwayat komentar & kunjungan UMKM-mu.' },
  { key: 'hapus', label: 'Hapus Akun', desc: 'Nonaktifkan akunmu — bisa dipulihkan dalam 30 hari.' },
]

const showHistory = computed(() => auth.isAuthed && auth.user?.role === 'user')
const navItems = computed(() => NAV_DEFS.filter((d) => d.key !== 'history' || showHistory.value))
const current = computed(() => NAV_DEFS.find((d) => d.key === ui.settingsTab) ?? NAV_DEFS[0])
</script>

<template>
  <div
    class="fixed inset-0 z-[95] flex items-center justify-center bg-[rgba(11,20,30,.55)] p-6 backdrop-blur-[3px]"
    @click="ui.closeSettings"
  >
    <div
      class="grid h-[640px] max-h-[88vh] w-[940px] max-w-full grid-cols-[76px_1fr] overflow-hidden rounded-2xl bg-[#F7F3EA] shadow-[0_30px_80px_rgba(9,24,40,.42)] mobile:grid-cols-[210px_1fr]"
      @click.stop
    >
      <!-- Buttons: always the left column, at every screen size. Compact icon-only rail below `mobile`, full icon+label sidebar from `mobile` up. -->
      <div class="flex flex-col overflow-y-auto bg-brand-navy p-2 pt-4 mobile:p-[15px] mobile:pt-5">
        <div class="hidden items-center gap-[11px] px-2 pt-1 pb-4 mobile:flex">
          <div class="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-gold-bright text-[17px] font-extrabold text-brand-navy">
            {{ auth.authInitial }}
          </div>
          <div class="min-w-0">
            <div class="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-extrabold text-white">{{ auth.user?.name }}</div>
            <div class="text-[11.5px] font-semibold text-[#AFC3DC]">{{ auth.authRoleLabel }}</div>
          </div>
        </div>
        <button
          v-for="n in navItems"
          :key="n.key"
          type="button"
          :title="n.label"
          class="mb-[3px] flex flex-col items-center gap-1 rounded-[11px] px-1 py-2.5 text-center text-[10px] leading-tight font-bold mobile:flex-row mobile:gap-[11px] mobile:px-[13px] mobile:text-left mobile:text-[13.5px]"
          :class="
            ui.settingsTab === n.key
              ? 'bg-white/14 text-white'
              : n.key === 'hapus'
                ? 'text-[#F1A99B]'
                : 'text-[#C6D6EC]'
          "
          @click="ui.settingsTab = n.key"
        >
          {{ n.label }}
        </button>
      </div>

      <!-- Results: always the right column. -->
      <div class="overflow-y-auto px-4 pt-5 pb-6 mobile:px-6 mobile:pt-[26px] mobile:pb-[34px] tablet:px-[30px]">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="m-0 text-[19px] font-extrabold tracking-[-.02em] text-brand-navy mobile:text-[22px]">{{ current.label }}</h2>
            <p class="mt-1.5 text-[13.5px] leading-relaxed text-text-muted">{{ current.desc }}</p>
          </div>
          <button type="button" class="flex-none text-2xl leading-none text-text-faint-3" @click="ui.closeSettings">×</button>
        </div>

        <ProfileTab v-if="ui.settingsTab === 'profil'" />
        <SecurityTab v-else-if="ui.settingsTab === 'keamanan'" />
        <PermissionsTab v-else-if="ui.settingsTab === 'izin'" />
        <HistoryTab v-else-if="ui.settingsTab === 'history'" />
        <DeleteAccountTab v-else-if="ui.settingsTab === 'hapus'" />
      </div>
    </div>
  </div>
</template>
