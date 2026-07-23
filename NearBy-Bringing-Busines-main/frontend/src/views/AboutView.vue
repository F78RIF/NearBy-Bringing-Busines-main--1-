<script setup lang="ts">
import logo from '@/assets/logo-nearby.png'

const steps = [
  { no: '1', title: 'Cari & jelajahi', body: 'Telusuri UMKM berdasarkan kategori, jenis, atau wilayah di Balikpapan.' },
  { no: '2', title: 'Kunjungi & nikmati', body: 'Lihat detail, menu, alamat, dan kontak. Kunjungi langsung usaha lokalnya.' },
  { no: '3', title: 'Beri ulasan', body: 'Bagikan pengalamanmu lewat rating & komentar untuk membantu warga lain.' },
]

const techs = [
  'Antarmuka Web Responsif',
  'Komponen Modular',
  'Palet Biru Balikpapan',
  'Peran Pengguna & Pemilik',
  'Sistem Ulasan & Rating',
]
</script>

<template>
  <main>
    <section class="px-6 py-20" style="background: linear-gradient(160deg, #16324b, #2c5ead)">
      <div class="mx-auto max-w-[820px] text-center">
        <img :src="logo" class="mx-auto mb-[18px] h-[78px] w-[78px] rounded-[50px] bg-white object-contain" />
        <h1 class="m-0 text-[32px] font-extrabold tracking-[-.02em] text-white tablet:text-[44px]">
          Tentang NearBy Balikpapan
        </h1>
        <p class="mt-[18px] text-[17px] leading-[1.65] text-[#C6D6EC] tablet:text-[19px]">
          <em class="font-bold text-gold-bright not-italic">NearBy</em> berarti "terdekat" atau "sekitaran kita"
          sebuah direktori rekomendasi untuk UMKM di sekitaran Kota Balikpapan, membantu warga menemukan usaha lokal
          terbaik di dekat mereka.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-[1000px] px-6 py-16">
      <div class="grid grid-cols-1 gap-6 mobile:grid-cols-2">
        <div class="rounded-[18px] border border-border-card bg-white p-7">
          <div class="flex h-12 w-12 items-center justify-center rounded-[13px] bg-[#F7EDDC] text-[22px] font-extrabold text-gold">
            ◎
          </div>
          <h3 class="mt-4 mb-2 text-[21px] font-extrabold">Misi kami</h3>
          <p class="m-0 leading-[1.65] text-text-secondary">
            Mengangkat UMKM Balikpapan agar mudah ditemukan warga sekitaran bukan hanya kuliner dan barang, tapi juga
            penginapan, jasa, dan usaha lokal lainnya.
          </p>
        </div>
        <div class="rounded-[18px] border border-border-card bg-white p-7">
          <div class="flex h-12 w-12 items-center justify-center rounded-[13px] bg-teal-tint text-[22px] font-extrabold text-teal">
            ♡
          </div>
          <h3 class="mt-4 mb-2 text-[21px] font-extrabold">Untuk siapa</h3>
          <p class="m-0 leading-[1.65] text-text-secondary">
            Untuk warga yang mencari rekomendasi tepercaya, dan untuk pemilik UMKM yang ingin usahanya dikenal lebih
            luas semua dalam satu platform.
          </p>
        </div>
      </div>

      <div class="mt-11">
        <h2 class="m-0 mb-2 text-[28px] font-extrabold tracking-[-.02em]">Bagaimana cara kerjanya</h2>
        <p class="m-0 mb-[26px] text-text-muted">Tiga langkah sederhana untuk warga maupun pemilik usaha.</p>
        <div class="grid grid-cols-1 gap-[18px] mobile:grid-cols-2 tablet:grid-cols-3">
          <div v-for="s in steps" :key="s.no" class="rounded-2xl border border-border-card bg-white p-6">
            <div class="text-[13px] font-extrabold text-gold">LANGKAH {{ s.no }}</div>
            <h4 class="mt-2.5 mb-1.5 text-[18px] font-extrabold">{{ s.title }}</h4>
            <p class="m-0 text-[14.5px] leading-[1.6] text-text-secondary">{{ s.body }}</p>
          </div>
        </div>
      </div>

      <div class="mt-11 rounded-[20px] border border-border-card bg-white p-[34px]">
        <h2 class="m-0 mb-1.5 text-[26px] font-extrabold tracking-[-.02em]">Dibuat dengan</h2>
        <p class="m-0 mb-[22px] text-text-muted">
          Platform ini dirancang sebagai purwarupa modern berbasis web, mengutamakan kecepatan dan kemudahan
          pemakaian.
        </p>
        <div class="flex flex-wrap gap-2.5">
          <span
            v-for="t in techs"
            :key="t"
            class="rounded-full border border-border-hairline bg-[#F4F0E7] px-4 py-2.5 text-sm font-bold text-brand-navy"
          >
            {{ t }}
          </span>
        </div>
      </div>
    </section>
  </main>
</template>
