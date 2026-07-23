<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import ToggleSwitch from '@/components/shared/ToggleSwitch.vue'
import ComputerIcon from '@/components/shared/ComputerIcon.vue'
import MobileIcon from '@/components/shared/MobileIcon.vue'

const account = useAccountStore()

const sessions = [
  { device: 'Chrome · Windows', loc: 'Balikpapan, ID', when: 'Aktif sekarang', current: true, mobile: false },
  { device: 'Safari · iPhone 14', loc: 'Balikpapan, ID', when: '2 hari lalu', current: false, mobile: true },
]

function endSession() {
  alert('Sesi perangkat telah dikeluarkan.')
}

const pwOld = ref('')
const pwNew = ref('')
const pwConfirm = ref('')

function submitPassword() {
  if (!pwOld.value || !pwNew.value) {
    alert('Lengkapi kata sandi saat ini dan yang baru.')
    return
  }
  if (pwNew.value.length < 8) {
    alert('Kata sandi baru minimal 8 karakter.')
    return
  }
  if (pwNew.value !== pwConfirm.value) {
    alert('Konfirmasi kata sandi tidak cocok.')
    return
  }
  pwOld.value = ''
  pwNew.value = ''
  pwConfirm.value = ''
  alert('Kata sandi berhasil diperbarui.')
}
</script>

<template>
  <div class="mb-[18px] rounded-2xl border border-border-card bg-white px-5 py-2">
    <div class="flex items-center gap-3.5 border-b border-[#F4EFE4] py-4 last:border-b-0">
      <div class="flex-1">
        <div class="text-sm font-extrabold text-brand-navy">Verifikasi dua langkah</div>
        <div class="mt-0.5 text-[12.5px] text-text-faint">Minta kode tambahan setiap kali masuk</div>
      </div>
      <ToggleSwitch v-model="account.security.twofa" />
    </div>
  </div>

  <div class="mb-2.5 text-[14.5px] font-extrabold text-brand-navy">Sesi aktif</div>
  <div class="rounded-2xl border border-border-card bg-white px-5 py-2">
    <div v-for="s in sessions" :key="s.device" class="flex items-center gap-3.5 border-b border-[#F4EFE4] py-3.5 last:border-b-0">
      <div class="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-[#EEF2F7] text-[17px] text-brand-navy">
        <MobileIcon v-if="s.mobile" size="18px" />
        <ComputerIcon v-else size="18px" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-[13.5px] font-bold text-brand-navy">{{ s.device }}</div>
        <div class="text-xs text-text-faint">{{ s.loc }} · {{ s.when }}</div>
      </div>
      <span v-if="s.current" class="rounded-full bg-teal-tint px-[11px] py-1 text-[11.5px] font-bold whitespace-nowrap text-teal-deep">
        Perangkat ini
      </span>
      <button
        v-else
        type="button"
        class="rounded-[9px] border border-danger-border px-[13px] py-1.5 text-[12.5px] font-bold whitespace-nowrap text-danger"
        @click="endSession"
      >
        Keluar
      </button>
    </div>
  </div>

  <div class="mt-[22px] mb-2.5 text-[14.5px] font-extrabold text-brand-navy">Ganti kata sandi</div>
  <div class="max-w-[460px] rounded-2xl border border-border-card bg-white p-[22px]">
    <label class="mb-1.5 block text-[13px] font-bold text-brand-navy">Kata sandi saat ini</label>
    <input v-model="pwOld" type="password" placeholder="••••••••" class="mb-3.5 w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5 text-brand-navy" />
    <label class="mb-1.5 block text-[13px] font-bold text-brand-navy">Kata sandi baru</label>
    <input
      v-model="pwNew"
      type="password"
      placeholder="Minimal 8 karakter"
      class="mb-3.5 w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5 text-brand-navy"
    />
    <label class="mb-1.5 block text-[13px] font-bold text-brand-navy">Ulangi kata sandi baru</label>
    <input
      v-model="pwConfirm"
      type="password"
      placeholder="Ketik ulang kata sandi baru"
      class="mb-[18px] w-full rounded-[11px] border border-border-input bg-white px-3.5 py-2.5 text-brand-navy"
    />
    <button type="button" class="rounded-[11px] bg-brand-blue px-[26px] py-3 font-extrabold text-white" @click="submitPassword">
      Perbarui kata sandi
    </button>
  </div>
</template>
