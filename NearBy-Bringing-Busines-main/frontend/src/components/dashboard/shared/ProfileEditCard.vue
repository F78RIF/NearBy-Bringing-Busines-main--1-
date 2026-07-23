<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>()
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

function saveProfile() {
  alert('Profil berhasil disimpan.')
}
</script>

<template>
  <div class="mb-[22px]">
    <h1 class="m-0 text-[29px] font-extrabold tracking-[-.02em]">{{ title }}</h1>
    <p class="mt-1.5 text-text-muted">{{ subtitle }}</p>
  </div>
  <div class="max-w-[560px] rounded-[18px] border border-border-card bg-white p-[26px]">
    <div class="mb-[22px] flex items-center gap-[15px]">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-navy text-2xl font-extrabold text-white">
        {{ auth.authInitial }}
      </div>
      <div>
        <div class="text-lg font-extrabold">{{ auth.user?.name }}</div>
        <div class="text-[13px] font-bold text-gold">{{ auth.authRoleLabel }}</div>
        <button type="button" class="mt-2 rounded-[10px] border border-border-input px-3.5 py-2 text-[13px] font-bold text-brand-navy">
          Ganti foto
        </button>
      </div>
    </div>
    <label class="mb-1.5 block text-[13px] font-bold">Nama lengkap</label>
    <input v-model="auth.profileName" class="mb-3.5 w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5" />
    <label class="mb-1.5 block text-[13px] font-bold">Email</label>
    <input v-model="auth.profileEmail" class="mb-3.5 w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5" />
    <label class="mb-1.5 block text-[13px] font-bold">Nomor telepon</label>
    <input v-model="auth.profilePhone" class="mb-5 w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5" />
    <button type="button" class="rounded-[11px] bg-brand-blue px-7 py-3 font-extrabold text-white" @click="saveProfile">
      Simpan perubahan
    </button>
  </div>
</template>
