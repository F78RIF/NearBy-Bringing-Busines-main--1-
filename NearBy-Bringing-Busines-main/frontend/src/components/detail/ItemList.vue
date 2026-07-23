<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import PlaceholderThumb from '@/components/shared/PlaceholderThumb.vue'
import type { UmkmItem } from '@/types'

defineProps<{ items: UmkmItem[] }>()
const ui = useUiStore()

function available(item: UmkmItem, index: number) {
  return item.avail !== false && index % 4 !== 3
}

function zoom(item: UmkmItem) {
  ui.openLightbox('🍽', item.name)
}
</script>

<template>
  <div class="mb-[30px] grid grid-cols-1 gap-3 mobile:grid-cols-2">
    <div
      v-for="(it, i) in items"
      :key="it.name"
      class="flex items-center gap-[13px] rounded-xl border border-border-card bg-white px-3.5 py-2.5"
    >
      <div class="relative h-[60px] w-[60px] flex-none cursor-zoom-in" title="Klik untuk perbesar" @click="zoom(it)">
        <PlaceholderThumb emoji="🍽" rounded="rounded-[10px]" />
        <span class="absolute right-[3px] bottom-[3px] flex h-[17px] w-[17px] items-center justify-center rounded-[6px] bg-[rgba(15,30,45,.66)] text-[10px] text-white">
          ⤢
        </span>
      </div>
      <div class="flex min-w-0 flex-1 flex-col gap-[3px]">
        <div class="text-[14.5px] font-bold">{{ it.name }}</div>
        <div class="text-[14px] font-extrabold whitespace-nowrap text-teal">{{ it.price }}</div>
      </div>
      <span
        class="flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold whitespace-nowrap"
        :style="
          available(it, i)
            ? { background: '#E3EFED', color: '#2E7D6E' }
            : { background: '#FBEEEA', color: '#C0472F' }
        "
      >
        {{ available(it, i) ? 'Tersedia' : 'Habis' }}
      </span>
    </div>
  </div>
</template>
