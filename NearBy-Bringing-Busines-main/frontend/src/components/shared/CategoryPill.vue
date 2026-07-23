<script setup lang="ts">
import { CAT } from '@/data/categories'
import type { CategoryName } from '@/types'

const props = withDefaults(defineProps<{ category: CategoryName; size?: 'sm' | 'md' }>(), {
  size: 'md',
})
const style = CAT[props.category]
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-bold whitespace-nowrap"
    :class="size === 'sm' ? 'px-[11px] py-[5px] text-[11.5px]' : 'px-[13px] py-[6px] text-[12.5px]'"
    :style="{ background: style.soft, color: style.accent }"
  >
    {{ category }}
  </span>
</template>
