<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function goRegisterOwner() {
  auth.regRole = 'owner'
  router.push({ name: 'register' })
}
</script>

<template>
  <section class="mx-auto max-w-[1200px] px-6 pt-[60px] pb-20">
    <div
      v-reveal
      class="relative flex flex-wrap items-center justify-between gap-[30px] overflow-hidden rounded-[26px] p-9 px-14"
      style="background: linear-gradient(120deg, #3e8e82, #2c5ead)"
    >
      <div class="absolute -top-[60px] right-[120px] h-[240px] w-[240px] rounded-full bg-[rgba(240,184,87,.28)]" />
      <div class="relative max-w-[560px]">
        <h2 class="m-0 text-[34px] font-extrabold tracking-[-.02em] text-white">Punya usaha di Balikpapan?</h2>
        <p class="mt-3 text-[17px] leading-[1.55] text-[#E7F0EE]">
          Daftarkan UMKM-mu gratis dan biarkan warga sekitaran menemukanmu. Kelola profil, menu, dan ulasan lewat satu
          dashboard.
        </p>
        <RouterLink
          :to="{ name: 'panduan' }"
          class="mt-3.5 inline-flex items-center gap-1.5 border-b-[1.5px] border-white/50 pb-0.5 text-[15px] font-bold text-white"
        >
          📘 Lihat panduan langkah-langkah →
        </RouterLink>
      </div>
      <button
        type="button"
        class="relative rounded-2xl bg-white px-[30px] py-[17px] text-base font-extrabold text-brand-navy shadow-[0_14px_30px_rgba(9,24,40,.25)]"
        @click="goRegisterOwner"
      >
        Daftarkan UMKM →
      </button>
    </div>
  </section>
</template>
