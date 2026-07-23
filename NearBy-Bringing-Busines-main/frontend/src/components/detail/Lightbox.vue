<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') ui.closeLightbox()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    v-if="ui.lightbox"
    class="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(11,20,30,.86)] p-4 backdrop-blur-[3px] mobile:p-6"
    @click="ui.closeLightbox"
  >
    <button
      type="button"
      aria-label="Tutup"
      class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg text-white mobile:top-6 mobile:right-6"
      @click="ui.closeLightbox"
    >
      ✕
    </button>
    <div class="flex w-full max-w-[560px] flex-col items-center gap-4" @click.stop>
      <div
        class="flex h-[min(60vh,420px)] w-full flex-col items-center justify-center gap-2 rounded-2xl bg-[#1c2e3d] text-[#F3EEE4]"
      >
        <span class="text-5xl">{{ ui.lightbox.label }}</span>
        <span class="text-sm">foto belum diunggah</span>
      </div>
      <div class="px-2 text-center text-[16px] font-bold text-[#F3EEE4]">{{ ui.lightbox.caption }}</div>
    </div>
  </div>
</template>
