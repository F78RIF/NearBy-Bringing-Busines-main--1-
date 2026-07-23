<script setup lang="ts">
import { useRouter } from 'vue-router'
import logo from '@/assets/logo-nearby.png'

withDefaults(defineProps<{ brandGradient: string; footerColor?: string }>(), {
  footerColor: '#8FA6C6',
})
const router = useRouter()
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 tablet:grid-cols-2">
    <div
      class="relative hidden flex-col justify-between overflow-hidden p-14 tablet:flex"
      :style="{ background: brandGradient }"
    >
      <slot name="brand-decor" />
      <div class="relative flex cursor-pointer items-center gap-[11px]" @click="router.push({ name: 'beranda' })">
        <img :src="logo" class="h-11 w-11 rounded-xl bg-white object-contain p-1" />
        <div class="text-[19px] font-extrabold text-white">Near<span class="text-gold-bright">By</span> Balikpapan</div>
      </div>
      <div class="relative">
        <slot name="brand-middle" />
      </div>
      <div class="relative text-[13px] font-semibold" :style="{ color: footerColor }">
        Yang terdekat, yang terbaik sekitaran Balikpapan.
      </div>
    </div>

    <div class="flex items-center justify-center bg-cream px-6 py-10">
      <slot name="form" />
    </div>
  </div>
</template>
