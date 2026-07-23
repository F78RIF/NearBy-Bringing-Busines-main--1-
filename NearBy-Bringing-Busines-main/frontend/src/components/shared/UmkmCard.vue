<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PlaceholderThumb from './PlaceholderThumb.vue'
import CategoryPill from './CategoryPill.vue'
import FavoriteButton from './FavoriteButton.vue'
import StarRating from './StarRating.vue'
import type { EnrichedUmkm } from '@/stores/umkm'

withDefaults(defineProps<{ umkm: EnrichedUmkm; size?: 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <!--
    FavoriteButton must NOT be a descendant of the RouterLink's <a> — a
    <button> nested inside an <a> is invalid content and browsers can
    navigate the anchor on click regardless of stopPropagation. Render it
    as an absolutely-positioned sibling instead.
  -->
  <div
    class="relative overflow-hidden rounded-[18px] border border-border-card bg-white shadow-[0_4px_18px_rgba(19,50,77,.05)] transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(19,50,77,.12)]"
  >
    <RouterLink :to="{ name: 'detail', params: { id: umkm.id } }" class="block">
      <div class="relative" :class="size === 'lg' ? 'h-[160px]' : 'h-[150px]'">
        <PlaceholderThumb :label="umkm.imgLabel" rounded="rounded-none" />
        <div class="absolute top-3 left-3">
          <CategoryPill :category="umkm.cat" size="sm" />
        </div>
      </div>
      <div :class="size === 'lg' ? 'p-[17px]' : 'p-4'">
        <div class="font-extrabold tracking-tight" :class="size === 'lg' ? 'text-[17px]' : 'text-[16.5px]'">
          {{ umkm.name }}
        </div>
        <div class="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-text-faint">
          {{ umkm.loc }}
        </div>
        <p class="my-2.5 text-[13.5px] leading-normal text-[#5B6470]">{{ umkm.tag }}</p>
        <div class="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 border-t border-[#F2ECDF] pt-3">
          <StarRating :rating="umkm.rating" :reviews="umkm.reviews" />
          <div class="flex-none rounded-lg bg-[#F4F0E7] px-2.5 py-1 text-[12.5px] font-bold whitespace-nowrap text-brand-navy">
            {{ umkm.priceLabel }}
          </div>
        </div>
      </div>
    </RouterLink>
    <FavoriteButton :id="umkm.id" />
  </div>
</template>
