<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUmkmStore } from '@/stores/umkm'
import UmkmCard from '@/components/shared/UmkmCard.vue'

const auth = useAuthStore()
const umkm = useUmkmStore()
</script>

<template>
  <main class="mx-auto max-w-[1200px] px-6 pt-11 pb-20">
    <div class="mb-[26px]">
      <h1 class="m-0 text-[38px] font-extrabold tracking-[-.02em]">Favorit Saya</h1>
      <p class="mt-2 text-base text-text-muted">UMKM yang kamu simpan untuk dikunjungi nanti.</p>
    </div>

    <div v-if="auth.isGuest" class="rounded-[20px] border border-border-card bg-white px-6 py-16 text-center shadow-[0_4px_18px_rgba(19,50,77,.05)]">
      <div class="text-[46px] text-danger">♡</div>
      <div class="mt-3 text-xl font-extrabold text-brand-navy">Silakan daftar atau masuk terlebih dahulu</div>
      <p class="mx-auto mt-2.5 mb-6 max-w-[440px] text-[15.5px] leading-relaxed text-text-muted">
        Kamu perlu memiliki akun untuk menyimpan UMKM sebagai favorit. Masuk atau daftar dulu, lalu tekan ikon hati
        pada UMKM yang kamu suka.
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <RouterLink :to="{ name: 'login' }" class="rounded-xl bg-brand-navy px-[26px] py-3.5 font-bold text-white">Masuk</RouterLink>
        <RouterLink
          :to="{ name: 'register' }"
          class="rounded-xl bg-brand-blue px-[26px] py-3.5 font-bold text-white shadow-[0_8px_20px_rgba(44,94,173,.25)]"
        >
          Daftar gratis
        </RouterLink>
      </div>
    </div>

    <div v-else-if="umkm.favCount > 0" class="grid grid-cols-1 gap-5 mobile:grid-cols-2 tablet:grid-cols-3">
      <UmkmCard v-for="u in umkm.favList" :key="u.id" :umkm="u" size="lg" />
    </div>

    <div v-else class="rounded-[20px] border border-border-card bg-white px-6 py-16 text-center shadow-[0_4px_18px_rgba(19,50,77,.05)]">
      <div class="text-[46px] text-[#D6CFC0]">♡</div>
      <div class="mt-3 text-xl font-extrabold text-brand-navy">Belum ada favorit</div>
      <p class="mx-auto mt-2.5 mb-6 max-w-[420px] text-[15.5px] leading-relaxed text-text-muted">
        Jelajahi UMKM dan tekan ikon hati untuk menyimpannya di sini.
      </p>
      <RouterLink :to="{ name: 'daftar' }" class="rounded-xl bg-brand-blue px-[26px] py-3.5 font-bold text-white">
        Jelajahi UMKM
      </RouterLink>
    </div>
  </main>
</template>
