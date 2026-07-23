<script setup lang="ts">
import PlaceholderThumb from '@/components/shared/PlaceholderThumb.vue'
import { useUiStore } from '@/stores/ui'

const props = defineProps<{ imgLabel: string }>()

const ui = useUiStore()

function zoom(caption: string) {
  ui.openLightbox('🖼', caption)
}
</script>

<template>
  <div class="mb-[26px] grid grid-rows-[200px_84px] gap-3 tablet:h-[340px] tablet:grid-rows-none tablet:grid-cols-[2fr_1fr]">
    <button
      type="button"
      class="relative block h-full w-full cursor-zoom-in overflow-hidden rounded-[20px] text-left"
      title="Klik untuk perbesar"
      @click="zoom(`${imgLabel} · utama`)"
    >
      <PlaceholderThumb :label="`${imgLabel} · utama`" variant="warm" rounded="rounded-[20px]" />
      <span class="absolute right-2.5 bottom-2.5 flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-[rgba(15,30,45,.66)] text-xs text-white">
        ⤢
      </span>
    </button>
    <div class="grid grid-cols-2 gap-3 tablet:grid-cols-1 tablet:grid-rows-2">
      <button
        type="button"
        class="relative block h-full w-full cursor-zoom-in overflow-hidden rounded-[20px] text-left"
        title="Klik untuk perbesar"
        @click="zoom('Galeri 2')"
      >
        <PlaceholderThumb label="galeri 2" variant="teal" rounded="rounded-[20px]" />
        <span class="absolute right-2 bottom-2 flex h-[22px] w-[22px] items-center justify-center rounded-md bg-[rgba(15,30,45,.66)] text-[10px] text-white">
          ⤢
        </span>
      </button>
      <button
        type="button"
        class="relative block h-full w-full cursor-zoom-in overflow-hidden rounded-[20px] text-left"
        title="Klik untuk perbesar"
        @click="zoom('Galeri 3')"
      >
        <PlaceholderThumb label="galeri 3" variant="blue" rounded="rounded-[20px]" />
        <span class="absolute right-2 bottom-2 flex h-[22px] w-[22px] items-center justify-center rounded-md bg-[rgba(15,30,45,.66)] text-[10px] text-white">
          ⤢
        </span>
      </button>
    </div>
  </div>
</template>
