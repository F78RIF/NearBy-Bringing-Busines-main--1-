import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/reveal'
import { useAccessibilityStore } from './stores/accessibility'
import { useAuthStore } from './stores/auth'

const app = createApp(App).use(createPinia()).use(router).directive('reveal', vReveal)

// Terapkan preferensi aksesibilitas (skala tampilan, kecepatan animasi) sebelum
// halaman pertama dirender supaya tidak ada "kedip" ke ukuran default.
useAccessibilityStore().init()

// Pulihkan sesi dari token Sanctum yang tersimpan sebelum render pertama,
// supaya guard router tahu peran user yang sebenarnya setelah reload.
useAuthStore()
  .restoreSession()
  .finally(() => app.mount('#app'))
