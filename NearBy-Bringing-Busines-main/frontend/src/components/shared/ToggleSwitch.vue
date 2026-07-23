<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <div
    class="relative h-[26px] w-11 flex-none cursor-pointer rounded-full transition-colors duration-150"
    :class="modelValue ? 'bg-brand-blue' : 'bg-[#D8D0C0]'"
    @click="emit('update:modelValue', !modelValue)"
  >
    <div
      class="absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.22)] transition-[left] duration-150"
      :class="modelValue ? 'left-[21px]' : 'left-[3px]'"
    />
  </div>
</template>
