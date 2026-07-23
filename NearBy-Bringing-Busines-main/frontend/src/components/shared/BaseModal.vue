<script setup lang="ts">
withDefaults(defineProps<{ maxWidth?: string }>(), { maxWidth: 'max-w-[480px]' })
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div
    class="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(15,30,45,.5)] p-5"
    @click="emit('close')"
  >
    <div
      class="w-full animate-[floatUp_.18s_ease_both] rounded-[18px] bg-white shadow-[0_30px_70px_rgba(9,24,40,.4)]"
      :class="maxWidth"
      @click.stop
    >
      <slot />
    </div>
  </div>
</template>
