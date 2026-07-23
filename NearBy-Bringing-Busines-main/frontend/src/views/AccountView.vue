<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

function saveProfile() {
  alert('Profil berhasil disimpan.')
}
</script>

<template>
  <main>
    <section style="background: linear-gradient(160deg, #16324b 0%, #1e4372 100%)">
      <div class="mx-auto max-w-[820px] px-6 pt-14 pb-12">
        <div class="mb-3 text-xs font-bold tracking-[.14em] text-gold-bright uppercase">Akun</div>
        <h1 class="m-0 text-[28px] font-extrabold tracking-[-.02em] text-white mobile:text-[32px] tablet:text-[38px]">Edit Profil</h1>
        <p class="mt-3 text-base leading-relaxed text-[#C6D6EC]">Perbarui informasi akunmu di NearBy Balikpapan.</p>
      </div>
    </section>
    <section class="mx-auto max-w-[560px] px-6 pt-11 pb-[70px]">
      <div class="rounded-[20px] border border-border-card bg-white p-7 shadow-[0_8px_26px_rgba(19,50,77,.06)]">
        <div class="mb-6 flex items-center gap-[15px]">
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
        <input v-model="auth.profileName" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />
        <label class="mb-1.5 block text-[13px] font-bold">Email</label>
        <input v-model="auth.profileEmail" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />
        <label class="mb-1.5 block text-[13px] font-bold">Nomor telepon</label>
        <input v-model="auth.profilePhone" class="mb-[22px] w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />
        <div class="flex flex-col gap-2.5 mobile:flex-row">
          <button type="button" class="rounded-xl bg-brand-blue px-7 py-3 text-center font-extrabold text-white" @click="saveProfile">
            Simpan perubahan
          </button>
          <RouterLink
            :to="{ name: 'beranda' }"
            class="rounded-xl border border-border-input px-[22px] py-3 text-center font-bold text-brand-navy"
          >
            Batal
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
