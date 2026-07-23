<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

defineProps<{ navLinks: { name: string; label: string }[] }>()

const auth = useAuthStore()
const ui = useUiStore()
</script>

<template>
  <div class="flex flex-col border-t border-border-hairline bg-cream px-[18px] pt-2.5 pb-4 tablet:hidden">
    <RouterLink
      v-for="link in navLinks"
      :key="link.name"
      :to="{ name: link.name }"
      class="border-b border-[#EFE9DC] py-[13px] text-[15.5px] font-bold text-brand-navy"
      @click="ui.closeMobileNav"
    >
      {{ link.label }}
    </RouterLink>
    <RouterLink
      v-if="auth.isOwner || auth.isAdmin"
      :to="{ name: 'dashboard' }"
      class="border-b border-[#EFE9DC] py-[13px] text-[15.5px] font-bold text-brand-navy"
      @click="ui.closeMobileNav"
    >
      Dashboard
    </RouterLink>
    <div v-if="auth.isGuest" class="mt-3 flex gap-2.5">
      <RouterLink
        :to="{ name: 'login' }"
        class="flex-1 rounded-[11px] border border-[#D6CFC0] py-3 text-center font-bold text-brand-navy"
        @click="ui.closeMobileNav"
      >
        Masuk
      </RouterLink>
      <RouterLink
        :to="{ name: 'register' }"
        class="flex-1 rounded-[11px] bg-brand-blue py-3 text-center font-bold text-white"
        @click="ui.closeMobileNav"
      >
        Daftar
      </RouterLink>
    </div>
  </div>
</template>
