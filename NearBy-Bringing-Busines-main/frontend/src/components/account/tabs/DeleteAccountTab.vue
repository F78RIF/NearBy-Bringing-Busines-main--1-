<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAccountStore } from '@/stores/account'
import { useUmkmStore } from '@/stores/umkm'
import { useUiStore } from '@/stores/ui'

const auth = useAuthStore()
const account = useAccountStore()
const umkm = useUmkmStore()
const ui = useUiStore()
const router = useRouter()

const delConfirm = ref('')
const canDelete = computed(() => delConfirm.value.trim().toUpperCase() === 'HAPUS')

function confirmDelete() {
  if (!canDelete.value || !auth.user) return
  account.deleteMyAccount(auth.user.name, auth.profileEmail, auth.user.role, auth.authRoleLabel, auth.authInitial)
  auth.logout()
  umkm.favorites = []
  ui.closeSettings()
  delConfirm.value = ''
  router.push({ name: 'beranda' })
}
</script>

<template>
  <div class="rounded-2xl border border-danger-border bg-danger-tint-2 p-[22px]">
    <div class="mb-2 text-[15px] font-extrabold text-[#8A2818]">Hapus akun ini</div>
    <p class="mb-3.5 text-[13.5px] leading-relaxed text-[#7A4A40]">
      Akunmu akan dinonaktifkan dan tidak lagi bisa diakses. Data profil, ulasan, dan riwayatmu akan disembunyikan.
    </p>
    <div class="mb-[18px] flex items-start gap-[11px] rounded-xl border border-danger-border bg-white px-4 py-3.5">
      <span class="text-lg">🕒</span>
      <div class="text-[13px] leading-[1.55] text-[#5B4A44]">
        <b class="text-brand-navy">Masih bisa dikembalikan.</b> Setelah dihapus, akun disimpan selama
        <b>maksimal 30 hari</b>. Dalam periode itu kamu (atau admin) dapat memulihkannya kapan saja. Lewat 30 hari,
        akun terhapus permanen.
      </div>
    </div>
    <label class="mb-1.5 block text-[13px] font-bold text-brand-navy">Ketik <b>HAPUS</b> untuk konfirmasi</label>
    <input
      v-model="delConfirm"
      placeholder="HAPUS"
      class="mb-[18px] w-full max-w-[280px] rounded-[11px] border border-border-input bg-white px-3.5 py-2.5 text-brand-navy"
    />
    <div>
      <button
        type="button"
        class="rounded-[11px] px-6 py-3 font-extrabold"
        :class="canDelete ? 'cursor-pointer bg-danger text-white' : 'cursor-not-allowed bg-[#E7C9C1] text-white'"
        @click="confirmDelete"
      >
        Hapus akun saya
      </button>
    </div>
  </div>
</template>
