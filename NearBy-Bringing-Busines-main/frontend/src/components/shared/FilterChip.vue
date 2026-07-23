<script setup lang="ts">
defineProps<{ label: string; active: boolean }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    class="cursor-pointer rounded-full px-4 py-[9px] text-[13.5px] font-bold transition-all duration-100"
    :class="
      active
        ? 'border border-brand-navy bg-brand-navy text-white'
        : 'border border-border-input bg-white text-text-secondary'
    "
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>
