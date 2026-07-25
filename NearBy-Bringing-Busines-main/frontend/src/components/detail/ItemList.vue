<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { PRODUCT_SUBCATEGORIES, DEFAULT_SUBCATEGORY } from '@/data/categories'
import PlaceholderThumb from '@/components/shared/PlaceholderThumb.vue'
import type { UmkmItem } from '@/types'

const props = defineProps<{ items: UmkmItem[] }>()
const ui = useUiStore()

interface Group {
  category: string
  items: { item: UmkmItem; index: number }[]
}

/** Kelompokkan item per sub-kategori, urut sesuai PRODUCT_SUBCATEGORIES. */
const groups = computed<Group[]>(() => {
  const byCat = new Map<string, { item: UmkmItem; index: number }[]>()
  props.items.forEach((item, index) => {
    const cat = item.category?.trim() || DEFAULT_SUBCATEGORY
    if (!byCat.has(cat)) byCat.set(cat, [])
    byCat.get(cat)!.push({ item, index })
  })

  const ordered = [
    ...PRODUCT_SUBCATEGORIES.filter((c) => byCat.has(c)),
    ...[...byCat.keys()].filter((c) => !PRODUCT_SUBCATEGORIES.includes(c)),
  ]
  return ordered.map((category) => ({ category, items: byCat.get(category)! }))
})

/** Kalau semua item tanpa kategori (satu grup "Lainnya"), tampil datar tanpa accordion. */
const flat = computed(
  () => groups.value.length <= 1 && groups.value[0]?.category === DEFAULT_SUBCATEGORY,
)

const collapsed = ref<Record<string, boolean>>({})
function toggle(cat: string) {
  collapsed.value[cat] = !collapsed.value[cat]
}

function available(item: UmkmItem, index: number) {
  return item.avail !== false && index % 4 !== 3
}

function zoom(item: UmkmItem) {
  ui.openLightbox('🍽', item.name)
}
</script>

<template>
  <div class="mb-[30px] flex flex-col gap-4">
    <div v-for="group in groups" :key="group.category">
      <!-- Header sub-kategori (accordion) -->
      <button
        v-if="!flat"
        type="button"
        class="mb-2.5 flex w-full items-center gap-2 text-left"
        @click="toggle(group.category)"
      >
        <span
          class="text-[11px] text-text-faint transition-transform"
          :class="{ '-rotate-90': collapsed[group.category] }"
        >
          ▼
        </span>
        <span class="text-[15px] font-extrabold text-brand-navy">{{ group.category }}</span>
        <span class="rounded-full bg-[#F4F0E7] px-2 py-0.5 text-[11px] font-bold text-text-faint">
          {{ group.items.length }}
        </span>
      </button>

      <div
        v-show="flat || !collapsed[group.category]"
        class="grid grid-cols-1 gap-3 mobile:grid-cols-2"
      >
        <div
          v-for="{ item: it, index: i } in group.items"
          :key="it.name + i"
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
    </div>
  </div>
</template>
