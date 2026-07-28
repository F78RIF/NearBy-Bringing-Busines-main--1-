import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/reveal'
import { useAccessibilityStore } from './stores/accessibility'

const app = createApp(App).use(createPinia()).use(router).directive('reveal', vReveal)

// Terapkan preferensi aksesibilitas (skala tampilan, kecepatan animasi) sebelum
// halaman pertama dirender supaya tidak ada "kedip" ke ukuran default.
useAccessibilityStore().init()

app.mount('#app')
