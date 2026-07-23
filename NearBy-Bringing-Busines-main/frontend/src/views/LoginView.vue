<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal.vue'
import logo from '@/assets/logo-nearby.png'

const router = useRouter()
const auth = useAuthStore()

const loginEmail = ref('')
const loginPass = ref('')
const forgotOpen = ref(false)

function doLogin() {
  auth.doLogin()
  router.push({ name: 'beranda' })
}

function continueAsGuest() {
  auth.logout()
  router.push({ name: 'beranda' })
}

function loginAsUser() {
  auth.loginAsUser()
  router.push({ name: 'beranda' })
}
function loginAsOwner() {
  auth.loginAsOwner()
  router.push({ name: 'dashboard' })
}
function loginAsAdmin() {
  auth.loginAsAdmin()
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <AuthLayout brand-gradient="linear-gradient(165deg, #16324b, #2c5ead)">
    <template #brand-decor>
      <div
        class="animate-drift absolute -top-20 -right-[60px] h-80 w-80 rounded-full"
        style="background: radial-gradient(circle, rgba(240, 184, 87, 0.3), transparent 70%)"
      />
      <div
        class="animate-drift absolute -bottom-[120px] -left-10 h-[300px] w-[300px] rounded-full"
        style="background: radial-gradient(circle, rgba(62, 142, 130, 0.4), transparent 70%); animation-delay: 2.5s"
      />
    </template>
    <template #brand-middle>
      <div class="animate-float-up">
        <h2 class="m-0 text-[34px] leading-[1.2] font-extrabold tracking-[-.02em] text-white">
          Selamat datang kembali
        </h2>
        <p class="mt-4 max-w-[400px] text-[16.5px] leading-relaxed text-[#C6D6EC]">
          Masuk untuk menyimpan UMKM favorit, memberi rating, komentar, atau mengelola usahamu.
        </p>
      </div>
    </template>

    <template #form>
      <div class="w-full max-w-[390px]">
        <div class="animate-float-up mb-[26px] text-center">
          <img :src="logo" class="mx-auto mb-3 h-16 w-16 object-contain" />
          <h1 class="m-0 text-[27px] font-extrabold tracking-[-.02em]">Masuk ke akunmu</h1>
          <p class="mt-[7px] text-text-faint">Senang melihatmu lagi.</p>
        </div>

        <div class="animate-float-up" style="animation-delay: .12s">
          <label class="mb-1.5 block text-[13.5px] font-bold">Username / Email</label>
          <input
            v-model="loginEmail"
            placeholder="nama@email.com"
            class="mb-4 w-full rounded-xl border border-border-input bg-white px-[15px] py-[13px] transition-shadow duration-150"
          />
          <div class="mb-1.5 flex items-center justify-between">
            <label class="text-[13.5px] font-bold">Password</label>
            <button type="button" class="text-[13px] font-bold text-brand-blue" @click="forgotOpen = true">Lupa password?</button>
          </div>
          <input
            v-model="loginPass"
            type="password"
            placeholder="••••••••"
            class="mb-5 w-full rounded-xl border border-border-input bg-white px-[15px] py-[13px] transition-shadow duration-150"
          />
          <button
            type="button"
            class="w-full rounded-xl bg-brand-blue py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_10px_24px_rgba(44,94,173,.28)] transition-transform duration-150 hover:scale-[1.015] active:scale-[0.98]"
            @click="doLogin"
          >
            Masuk
          </button>

          <div class="relative my-[18px] text-center text-[12.5px] font-bold text-text-faint-3">
            <div class="absolute inset-x-0 top-1/2 -z-10 h-px bg-border-hairline" />
            <span class="bg-cream px-3">masuk cepat sebagai (demo)</span>
          </div>
          <div class="grid grid-cols-3 gap-[9px]">
            <button type="button" class="rounded-[11px] border border-border-input bg-white px-1.5 py-2.5 text-[13px] font-bold text-brand-navy transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0" @click="loginAsUser">
              Pengguna
            </button>
            <button type="button" class="rounded-[11px] border border-border-input bg-white px-1.5 py-2.5 text-[13px] font-bold text-brand-navy transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0" @click="loginAsOwner">
              Pemilik
            </button>
            <button type="button" class="rounded-[11px] border border-border-input bg-white px-1.5 py-2.5 text-[13px] font-bold text-brand-navy transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0" @click="loginAsAdmin">
              Admin
            </button>
          </div>
        </div>

        <p class="animate-float-up mt-6 text-center font-semibold text-text-muted" style="animation-delay: .2s">
          Belum punya akun?
          <RouterLink :to="{ name: 'register' }" class="font-extrabold text-brand-blue">Daftar sekarang</RouterLink>
        </p>

        <button
          type="button"
          class="animate-float-up mt-3 block w-full text-center text-[13.5px] font-bold text-text-faint transition-colors duration-150 hover:text-brand-navy"
          style="animation-delay: .28s"
          @click="continueAsGuest"
        >
          Masuk sebagai tamu →
        </button>
      </div>
    </template>
  </AuthLayout>

  <ForgotPasswordModal v-if="forgotOpen" :initial-email="loginEmail" @close="forgotOpen = false" />
</template>
