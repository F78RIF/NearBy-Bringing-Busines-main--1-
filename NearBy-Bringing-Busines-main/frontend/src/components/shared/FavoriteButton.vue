<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUmkmStore } from '@/stores/umkm'

const props = withDefaults(defineProps<{ id: number; variant?: 'icon' | 'button' }>(), {
  variant: 'icon',
})

const router = useRouter()
const auth = useAuthStore()
const umkm = useUmkmStore()

const active = computed(() => umkm.isFavorite(props.id))

function onClick() {
  if (auth.isGuest) {
    router.push({ name: 'login' })
    return
  }
  umkm.toggleFavorite(props.id)
}
</script>

<template>
  <button
    v-if="variant === 'icon'"
    type="button"
    title="Simpan favorit"
    class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-base shadow-[0_4px_12px_rgba(9,24,40,.18)] transition-colors"
    :class="active ? 'bg-danger text-white' : 'bg-white text-danger'"
    @click.stop="onClick"
  >
    {{ active ? '♥' : '♡' }}
  </button>

  <button
    v-else
    type="button"
    class="flex w-full items-center justify-center gap-2 rounded-[12px] py-3 font-bold transition-colors"
    :class="
      active
        ? 'bg-danger text-white'
        : 'border border-[#E7E0D2] text-brand-navy hover:border-danger-border hover:bg-danger-tint hover:text-danger'
    "
    @click="onClick"
  >
    {{ active ? '♥ Tersimpan di favorit' : '♡ Simpan favorit' }}
  </button>
</template>
