<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    emoji?: string
    variant?: 'warm' | 'teal' | 'blue' | 'navy'
    rounded?: string
  }>(),
  { variant: 'warm', rounded: 'rounded-[16px]' },
)

const gradients: Record<string, [string, string]> = {
  warm: ['#ECE6DA', '#F4EFE6'],
  teal: ['#E7EFEC', '#F1F6F3'],
  blue: ['#E7EDF6', '#F1F5FB'],
  navy: ['#33517A', '#3A5A85'],
}

const textColors: Record<string, string> = {
  warm: '#A79D89',
  teal: '#98A8A2',
  blue: '#93A2BC',
  navy: '#B9CBE6',
}

const bgStyle = computed(() => {
  const [c1, c2] = gradients[props.variant]
  return {
    background: `repeating-linear-gradient(135deg, ${c1} 0 12px, ${c2} 12px 24px)`,
    color: textColors[props.variant],
  }
})
</script>

<template>
  <div
    class="flex h-full w-full items-center justify-center gap-1 font-mono text-[11px] font-semibold"
    :class="rounded"
    :style="bgStyle"
  >
    <span v-if="emoji">{{ emoji }}</span>
    <span v-if="label">{{ label }}</span>
  </div>
</template>
