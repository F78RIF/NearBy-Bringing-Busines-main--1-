<script setup lang="ts">
import { RouterLink } from 'vue-router'
import logo from '@/assets/logo-nearby.png'
</script>

<template>
  <footer class="mt-5 bg-[#12283C] text-[#B9C6D6]">
    <div class="mx-auto grid max-w-[1200px] grid-cols-1 gap-[34px] px-6 pt-[52px] pb-[30px] tablet:grid-cols-[1.8fr_1fr_1fr] mobile:grid-cols-1">
      <div>
        <div class="flex items-center gap-2.5">
          <img :src="logo" alt="NearBy" class="h-10 w-10 rounded-[10px] bg-white p-[3px] object-contain" />
          <div class="text-[17px] font-extrabold">
            Near<span class="text-gold-bright">By</span> Balikpapan
          </div>
        </div>
        <p class="mt-3 max-w-[320px] text-[#94A5B8]">
          Direktori UMKM lokal Balikpapan — kuliner, penginapan, fashion, oleh-oleh, hingga jasa, semua dalam satu
          tempat.
        </p>
      </div>
      <div>
        <div class="mb-3 font-bold text-white">Jelajahi</div>
        <div class="flex flex-col gap-2.5 font-semibold">
          <RouterLink :to="{ name: 'beranda' }">Beranda</RouterLink>
          <RouterLink :to="{ name: 'daftar' }">Daftar UMKM</RouterLink>
          <RouterLink :to="{ name: 'panduan' }">Panduan Daftar UMKM</RouterLink>
          <RouterLink :to="{ name: 'tentang' }">Tentang</RouterLink>
        </div>
      </div>
      <div>
        <div class="mb-3 font-bold text-white">Legal</div>
        <div class="flex flex-col gap-2.5 font-semibold">
          <RouterLink :to="{ name: 'privacy' }">Kebijakan Privasi</RouterLink>
          <RouterLink :to="{ name: 'terms' }">Syarat &amp; Ketentuan</RouterLink>
        </div>
      </div>
    </div>
    <div
      class="mx-auto flex max-w-[1200px] items-center justify-between border-t border-white/10 px-6 pt-[18px] pb-[100px] text-[13px] text-[#7E90A5]"
    >
      <div>© 2026 NearBy Balikpapan. Dibuat untuk UMKM Balikpapan.</div>
      <div>Yang terdekat, yang terbaik.</div>
    </div>
  </footer>
</template>
