<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rating?: number
    reviews?: number
    interactive?: boolean
    modelValue?: number
  }>(),
  { rating: 0, interactive: false, modelValue: 5 },
)

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div v-if="interactive" class="flex gap-1">
    <span
      v-for="n in 5"
      :key="n"
      class="cursor-pointer text-[28px] leading-none"
      :style="{ color: n <= (modelValue ?? 0) ? '#E7A83A' : '#E2DBCB' }"
      @click="emit('update:modelValue', n)"
    >
      ★
    </span>
  </div>
  <div v-else class="inline-flex flex-none items-center gap-1 font-extrabold whitespace-nowrap text-gold">
    <span>★ {{ rating.toFixed(1) }}</span>
    <span v-if="reviews !== undefined" class="font-semibold text-text-faint-3">({{ reviews }})</span>
  </div>
</template>
