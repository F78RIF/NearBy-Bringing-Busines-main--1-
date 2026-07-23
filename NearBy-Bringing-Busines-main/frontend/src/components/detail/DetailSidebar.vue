<script setup lang="ts">
import PlaceholderThumb from '@/components/shared/PlaceholderThumb.vue'
import FavoriteButton from '@/components/shared/FavoriteButton.vue'
import type { Umkm } from '@/types'

defineProps<{ umkm: Umkm; waLink: string }>()
</script>

<template>
  <aside class="sticky top-[90px] rounded-[18px] border border-border-card bg-white p-[22px] shadow-[0_8px_26px_rgba(19,50,77,.06)]">
    <div class="mb-1 font-extrabold">Informasi kontak</div>

    <div class="border-b border-[#F2ECDF] py-[11px]">
      <div class="text-xs font-bold text-text-faint uppercase">Alamat</div>
      <div class="text-[14px] text-brand-navy">{{ umkm.address }}</div>
    </div>
    <div class="border-b border-[#F2ECDF] py-[11px]">
      <div class="text-xs font-bold text-text-faint uppercase">Jam buka</div>
      <div class="text-[14px] text-brand-navy">{{ umkm.hours }}</div>
    </div>
    <div class="border-b border-[#F2ECDF] py-[11px]">
      <div class="text-xs font-bold text-text-faint uppercase">Telepon</div>
      <div class="text-[14px] text-brand-navy">{{ umkm.phone }}</div>
    </div>
    <div class="py-[11px]">
      <div class="text-xs font-bold text-text-faint uppercase">Sosial Media</div>
      <a
        :href="`https://instagram.com/${umkm.ig.replace('@', '')}`"
        target="_blank"
        class="text-[14px] font-semibold text-brand-blue"
      >
        {{ umkm.ig }}
      </a>
    </div>

    <div class="my-3.5 h-[130px]">
      <PlaceholderThumb label="peta lokasi" variant="blue" rounded="rounded-[13px]" />
    </div>

    <a
      :href="waLink"
      target="_blank"
      class="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 font-bold text-white"
    >
      Hubungi via WhatsApp
    </a>
    <FavoriteButton :id="umkm.id" variant="button" />
  </aside>
</template>
