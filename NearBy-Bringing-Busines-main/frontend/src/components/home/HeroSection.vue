<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUmkmStore } from '@/stores/umkm'
import { CATEGORY_FILTERS } from '@/data/categories'
import PlaceholderThumb from '@/components/shared/PlaceholderThumb.vue'
import HeroCanvas from '@/components/home/HeroCanvas.vue'

const router = useRouter()
const umkm = useUmkmStore()
const heroCat = ref('Semua')

function doHeroSearch() {
  umkm.cat = heroCat.value
  umkm.loc = 'Semua'
  router.push({ name: 'daftar' })
}
</script>

<template>
  <section
    class="relative overflow-hidden"
    style="background: linear-gradient(160deg, #16324b 0%, #1e4372 55%, #2c5ead 100%)"
  >
    <div class="pointer-events-none absolute inset-0 z-0">
      <HeroCanvas />
    </div>

    <div
      class="pointer-events-none absolute -top-[120px] -right-20 z-0 h-[420px] w-[420px] rounded-full animate-drift"
      style="background: radial-gradient(circle, rgba(214, 162, 74, 0.35), transparent 70%)"
    />
    <div
      class="pointer-events-none absolute -bottom-[140px] -left-[60px] z-0 h-[360px] w-[360px] rounded-full animate-drift"
      style="background: radial-gradient(circle, rgba(62, 142, 130, 0.4), transparent 70%); animation-delay: -4.5s"
    />

    <div
      class="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 py-[76px] pb-[88px] tablet:grid-cols-[1.15fr_.85fr]"
    >
      <div class="animate-float-up">
        <div
          class="mb-[22px] inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-[7px] text-[13px] font-semibold text-[#DCE9FB]"
        >
          <span class="h-[7px] w-[7px] rounded-full bg-[#57C785]" /> Direktori UMKM sekitaranmu
        </div>
        <h1 class="m-0 text-[33px] leading-[1.05] font-extrabold tracking-[-.03em] text-white text-balance tablet:text-[52px]">
          Temukan UMKM terbaik<br />
          di sekitaran <span class="text-gold-bright">Balikpapan</span>
        </h1>
        <p class="my-5 max-w-[480px] text-lg leading-relaxed text-[#C6D6EC]">
          Dari kuliner, penginapan, fashion, oleh-oleh hingga jasa semua usaha lokal terdekat, dalam satu tempat.
          <em class="font-semibold text-white not-italic">NearBy Balikpapan</em> yang terdekat, yang terbaik.
        </p>

        <div class="flex max-w-[560px] gap-1.5 rounded-2xl bg-white p-2 shadow-[0_20px_50px_rgba(9,24,40,.35)] mobile:gap-2">
          <div class="flex min-w-0 flex-1 items-center gap-1.5 px-2 mobile:gap-2.5 mobile:px-3">
            <span class="text-[15px] text-[#A79D89] mobile:text-[17px]">⌕</span>
            <input
              v-model="umkm.q"
              placeholder="Cari UMKM…"
              class="w-full min-w-0 border-none py-3 text-sm font-medium text-brand-navy mobile:text-base"
            />
          </div>
          <select
            v-model="heroCat"
            class="max-w-[84px] cursor-pointer border-l border-[#EEE8DB] px-1.5 text-sm font-semibold text-text-secondary mobile:max-w-none mobile:px-3 mobile:text-base"
          >
            <option v-for="c in CATEGORY_FILTERS" :key="c">{{ c }}</option>
          </select>
          <button
            type="button"
            class="cursor-pointer rounded-[11px] bg-gold px-3.5 py-2.5 text-sm font-bold whitespace-nowrap text-white mobile:px-6 mobile:py-[13px] mobile:text-base"
            @click="doHeroSearch"
          >
            Cari
          </button>
        </div>

        <div class="mt-[34px] flex gap-[26px]">
          <div>
            <div class="text-[26px] font-extrabold text-white">{{ umkm.all.length }}+</div>
            <div class="text-[13px] font-semibold text-[#9FB4D0]">UMKM terdaftar</div>
          </div>
          <div class="w-px bg-white/15" />
          <div>
            <div class="text-[26px] font-extrabold text-white">5</div>
            <div class="text-[13px] font-semibold text-[#9FB4D0]">Kategori</div>
          </div>
          <div class="w-px bg-white/15" />
          <div>
            <div class="text-[26px] font-extrabold text-white">6</div>
            <div class="text-[13px] font-semibold text-[#9FB4D0]">Kecamatan</div>
          </div>
        </div>
      </div>

      <div class="relative animate-float-up">
        <div class="rounded-3xl border border-white/16 bg-white/8 p-[18px] backdrop-blur-[6px]">
          <div class="relative h-[200px]">
            <div class="h-full w-full overflow-hidden rounded-2xl">
              <PlaceholderThumb label="foto suasana UMKM" variant="navy" rounded="rounded-none" />
            </div>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <div class="rounded-[14px] bg-white p-3.5">
              <div class="h-[74px] rounded-[9px]" style="background: repeating-linear-gradient(135deg, #ece6da 0 10px, #f4efe6 10px 20px)" />
              <div class="mt-2.5 text-[13px] font-bold">Kepiting Kenari</div>
              <div class="text-[12px] font-bold text-gold">★ 4.8 · Kuliner</div>
            </div>
            <div class="rounded-[14px] bg-white p-3.5">
              <div class="h-[74px] rounded-[9px]" style="background: repeating-linear-gradient(135deg, #ece6da 0 10px, #f4efe6 10px 20px)" />
              <div class="mt-2.5 text-[13px] font-bold">Amplang Bahari</div>
              <div class="text-[12px] font-bold text-[#1591DC]">★ 4.9 · Oleh-Oleh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
