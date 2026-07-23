<script setup lang="ts">
import { useAccountStore } from '@/stores/account'
import ToggleSwitch from '@/components/shared/ToggleSwitch.vue'

const account = useAccountStore()

const permDefs: { key: keyof typeof account.perms; label: string; desc: string }[] = [
  { key: 'emailNotif', label: 'Notifikasi email', desc: 'Email tentang aktivitas akun & ulasan baru' },
  { key: 'pushNotif', label: 'Notifikasi push', desc: 'Pemberitahuan langsung di perangkatmu' },
  { key: 'location', label: 'Akses lokasi', desc: 'Tampilkan UMKM terdekat berdasarkan lokasimu' },
  { key: 'promo', label: 'Email promosi', desc: 'Info promo & UMKM pilihan tiap minggu' },
  { key: 'dataShare', label: 'Personalisasi rekomendasi', desc: 'Gunakan aktivitasku untuk rekomendasi' },
]
</script>

<template>
  <div class="rounded-2xl border border-border-card bg-white px-5 py-2">
    <div v-for="p in permDefs" :key="p.key" class="flex items-center gap-3.5 border-b border-[#F4EFE4] py-4 last:border-b-0">
      <div class="flex-1">
        <div class="text-sm font-extrabold text-brand-navy">{{ p.label }}</div>
        <div class="mt-0.5 text-[12.5px] text-text-faint">{{ p.desc }}</div>
      </div>
      <ToggleSwitch v-model="account.perms[p.key]" />
    </div>
  </div>
</template>
