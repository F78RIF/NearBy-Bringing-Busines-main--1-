<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HelpWidget from '@/components/layout/HelpWidget.vue'
import SettingsModal from '@/components/account/SettingsModal.vue'
import RestoreBanner from '@/components/account/RestoreBanner.vue'

const route = useRoute()
const ui = useUiStore()
const showChrome = computed(() => route.meta.chrome !== false)
</script>

<template>
  <div class="min-h-screen bg-cream">
    <RestoreBanner />
    <AppHeader v-if="showChrome" />
    <div class="relative">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>
    <AppFooter v-if="showChrome" />
    <HelpWidget v-if="showChrome" />
    <SettingsModal v-if="ui.settingsOpen" />
  </div>
</template>
