<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; title: string; subtitle?: string }>(), {
  icon: '🔍',
})
</script>

<template>
  <div class="rounded-[18px] px-5 py-16 text-center text-text-faint">
    <div class="text-4xl">{{ icon }}</div>
    <div class="mt-2.5 font-bold text-brand-navy">{{ title }}</div>
    <div v-if="subtitle" class="mt-1">{{ subtitle }}</div>
    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </div>
</template>
