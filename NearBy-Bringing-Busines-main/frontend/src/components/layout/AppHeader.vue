<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUmkmStore } from '@/stores/umkm'
import { useUiStore } from '@/stores/ui'
import logo from '@/assets/logo-nearby.png'
import MobileNav from './MobileNav.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const umkm = useUmkmStore()
const ui = useUiStore()

const navLinks = computed(() => [
  { name: 'beranda', label: 'Beranda' },
  { name: 'daftar', label: 'Daftar UMKM' },
  { name: 'tentang', label: 'Tentang' },
  { name: 'panduan', label: 'Panduan' },
])

function linkClass(name: string) {
  const active = route.name === name
  return active
    ? 'rounded-[10px] px-[14px] py-[9px] text-[14.5px] font-semibold text-brand-blue bg-brand-blue-tint'
    : 'rounded-[10px] px-[14px] py-[9px] text-[14.5px] font-semibold text-[#4B5563] transition-transform duration-150 hover:-translate-y-px hover:bg-surface-alt hover:text-brand-navy'
}

function logout() {
  ui.closeProfileMenu()
  auth.logout()
  umkm.favorites = []
  router.push({ name: 'beranda' })
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-border-hairline backdrop-blur-[12px]"
    style="background: rgba(250, 247, 241, 0.86); backdrop-filter: saturate(160%) blur(12px)"
  >
    <div class="mx-auto flex h-[70px] max-w-[1200px] items-center gap-7 px-6">
      <RouterLink to="/" class="flex select-none items-center gap-[11px]">
        <img :src="logo" alt="NearBy" class="h-[42px] w-[42px] object-contain" />
        <div class="leading-[1.05]">
          <div class="text-[18px] font-extrabold tracking-[-.02em]">
            Near<span class="text-brand-blue">By</span>
          </div>
          <div class="text-[10px] font-bold tracking-[.16em] text-gold uppercase">Balikpapan</div>
        </div>
      </RouterLink>

      <nav class="ml-2 hidden gap-1.5 whitespace-nowrap tablet:flex">
        <RouterLink v-for="link in navLinks" :key="link.name" :to="{ name: link.name }" :class="linkClass(link.name)">
          {{ link.label }}
        </RouterLink>
        <RouterLink v-if="auth.isOwner || auth.isAdmin" :to="{ name: 'dashboard' }" :class="linkClass('dashboard')">
          Dashboard
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Menu"
          class="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border-input bg-white text-[19px] text-brand-navy tablet:hidden"
          @click="ui.toggleMobileNav"
        >
          ☰
        </button>

        <RouterLink
          :to="{ name: 'favorit' }"
          title="Favorit"
          class="relative flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border-input bg-white text-lg text-danger hover:bg-surface-alt"
        >
          ♡
          <span
            v-if="umkm.favCount > 0"
            class="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[11px] font-extrabold text-white"
          >
            {{ umkm.favCount }}
          </span>
        </RouterLink>

        <div v-if="auth.isAuthed" class="relative">
          <button
            type="button"
            class="flex items-center gap-[9px] rounded-full border border-border-hairline bg-white py-[5px] pr-3 pl-[5px]"
            @click="ui.toggleProfileMenu"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-[13px] font-bold text-white">
              {{ auth.authInitial }}
            </div>
            <div class="text-left leading-[1.1]">
              <div class="text-[13px] font-bold">{{ auth.user?.name }}</div>
              <div class="text-[10.5px] text-text-faint">{{ auth.authRoleLabel }}</div>
            </div>
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
        <div v-else class="hidden items-center gap-2.5 tablet:flex">
          <RouterLink
            :to="{ name: 'login' }"
            class="rounded-[11px] border border-[#D6CFC0] px-[18px] py-2.5 font-bold text-brand-navy"
          >
            Masuk
          </RouterLink>
          <RouterLink
            :to="{ name: 'register' }"
            class="rounded-[11px] bg-brand-blue px-[18px] py-2.5 font-bold text-white shadow-[0_6px_16px_rgba(44,94,173,.28)]"
          >
            Daftar
          </RouterLink>
        </div>
      </div>
    </div>

    <MobileNav v-if="ui.mobileNavOpen" :nav-links="navLinks" />
  </header>
</template>
