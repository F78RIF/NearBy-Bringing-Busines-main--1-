<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import RolePicker from '@/components/auth/RolePicker.vue'
import logo from '@/assets/logo-nearby.png'

const router = useRouter()
const auth = useAuthStore()

const regName = ref('')
const regEmail = ref('')
const regPass = ref('')

const roleWord = computed(() => (auth.regRole === 'owner' ? 'Pemilik UMKM' : 'Pengguna'))

function doRegister() {
  auth.register(regName.value.trim(), auth.regRole)
  router.push({ name: auth.regRole === 'owner' ? 'dashboard' : 'beranda' })
}
</script>

<template>
  <AuthLayout brand-gradient="linear-gradient(165deg, #3e8e82, #16324b)" footer-color="#A9C7C1">
    <template #brand-decor>
      <div
        class="animate-drift absolute -top-20 -right-[60px] h-80 w-80 rounded-full"
        style="background: radial-gradient(circle, rgba(240, 184, 87, 0.28), transparent 70%)"
      />
    </template>
    <template #brand-middle>
      <div class="animate-float-up">
        <h2 class="m-0 text-[33px] leading-[1.2] font-extrabold tracking-[-.02em] text-white">
          Bergabung dengan<br />komunitas sekitaran
        </h2>
        <div class="mt-[26px] flex flex-col gap-3.5">
          <div
            v-for="(item, i) in [
              'Simpan & ulas UMKM favoritmu',
              'Daftarkan UMKM-mu sendiri, gratis',
              'Kelola profil & ulasan lewat dashboard',
            ]"
            :key="item"
            class="animate-float-up flex items-center gap-[11px] text-[#E7F0EE]"
            :style="{ animationDelay: `${0.15 + i * 0.1}s` }"
          >
            <span class="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-white/16 font-extrabold">✓</span>
            {{ item }}
          </div>
        </div>
      </div>
    </template>

    <template #form>
      <div class="w-full max-w-[410px]">
        <div class="animate-float-up mb-[22px] text-center">
          <img :src="logo" class="mx-auto mb-2.5 h-[58px] w-[58px] object-contain" />
          <h1 class="m-0 text-[26px] font-extrabold tracking-[-.02em]">Buat akun baru</h1>
          <p class="mt-1.5 text-text-faint">Pilih tipe akun yang sesuai untukmu.</p>
        </div>

        <div class="animate-float-up" style="animation-delay: .12s">
          <RolePicker v-model="auth.regRole" />

          <label class="mb-1.5 block text-[13.5px] font-bold">Nama lengkap</label>
          <input v-model="regName" placeholder="Nama kamu" class="mb-[13px] w-full rounded-xl border border-border-input bg-white px-[15px] py-3 transition-shadow duration-150" />
          <label class="mb-1.5 block text-[13.5px] font-bold">Email</label>
          <input v-model="regEmail" placeholder="nama@email.com" class="mb-[13px] w-full rounded-xl border border-border-input bg-white px-[15px] py-3 transition-shadow duration-150" />
          <label class="mb-1.5 block text-[13.5px] font-bold">Password</label>
          <input
            v-model="regPass"
            type="password"
            placeholder="Minimal 8 karakter"
            class="mb-[18px] w-full rounded-xl border border-border-input bg-white px-[15px] py-3 transition-shadow duration-150"
          />
          <button
            type="button"
            class="w-full rounded-xl bg-brand-blue py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_10px_24px_rgba(44,94,173,.28)] transition-transform duration-150 hover:scale-[1.015] active:scale-[0.98]"
            @click="doRegister"
          >
            Daftar sebagai {{ roleWord }}
          </button>
        </div>

        <p class="animate-float-up mt-5 text-center font-semibold text-text-muted" style="animation-delay: .2s">
          Sudah punya akun?
          <RouterLink :to="{ name: 'login' }" class="font-extrabold text-brand-blue">Masuk di sini</RouterLink>
        </p>
      </div>
    </template>
  </AuthLayout>
</template>
