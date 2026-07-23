<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

function saveProfile() {
  alert('Profil berhasil disimpan.')
}
</script>

<template>
  <div class="rounded-2xl border border-border-card bg-white p-[22px]">
    <div class="mb-5 flex items-center gap-[15px]">
      <div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-brand-navy text-[22px] font-extrabold text-white">
        {{ auth.authInitial }}
      </div>
      <button type="button" class="rounded-[10px] border border-border-input px-[15px] py-2.5 text-[13px] font-bold text-brand-navy">
        Ganti foto
      </button>
    </div>
    <label class="mb-1.5 block text-[13px] font-bold text-brand-navy">Nama lengkap</label>
    <input v-model="auth.profileName" class="mb-3.5 w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5 text-brand-navy" />
    <label class="mb-1.5 block text-[13px] font-bold text-brand-navy">Email</label>
    <input v-model="auth.profileEmail" class="mb-3.5 w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5 text-brand-navy" />
    <label class="mb-1.5 block text-[13px] font-bold text-brand-navy">Nomor telepon</label>
    <input v-model="auth.profilePhone" class="mb-5 w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5 text-brand-navy" />
    <button type="button" class="rounded-[11px] bg-brand-blue px-[26px] py-3 font-extrabold text-white" @click="saveProfile">
      Simpan perubahan
    </button>
  </div>
</template>
