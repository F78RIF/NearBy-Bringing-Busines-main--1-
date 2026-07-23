<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <main class="mx-auto max-w-[720px] px-6 py-24 text-center">
    <div class="text-sm font-bold uppercase tracking-[.14em] text-gold">Segera hadir</div>
    <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy">{{ title }}</h1>
    <p class="mt-3 text-text-muted">Halaman ini sedang dalam tahap pengembangan berikutnya.</p>
    <RouterLink
      to="/"
      class="mt-6 inline-flex items-center gap-2 rounded-[11px] bg-brand-blue px-5 py-2.5 font-bold text-white shadow-[0_6px_16px_rgba(44,94,173,.28)]"
    >
      Kembali ke beranda
    </RouterLink>
  </main>
</template>
