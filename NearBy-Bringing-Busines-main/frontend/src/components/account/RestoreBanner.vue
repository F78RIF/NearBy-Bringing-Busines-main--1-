<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'

const account = useAccountStore()
const router = useRouter()

// Pemulihan akun tidak membuat sesi baru: user harus masuk kembali dengan
// kredensial aslinya lewat halaman login.
function restore() {
  if (account.restoreMyAccount()) router.push({ name: 'login' })
}
</script>

<template>
  <div
    v-if="account.myDeleted"
    class="fixed inset-x-0 top-0 z-[96] flex flex-wrap items-center justify-center gap-4 bg-[#7A1F12] px-5 py-2.5 text-[13.5px] font-semibold text-white"
  >
    <span>
      Akun <b>{{ account.myDeleted.name }}</b> dijadwalkan dihapus. Kamu masih bisa memulihkannya dalam
      <b>{{ account.myDeletedDaysLeft }} hari</b>.
    </span>
    <button type="button" class="rounded-[9px] bg-white px-4 py-2 font-extrabold whitespace-nowrap text-[#7A1F12]" @click="restore">
      Pulihkan akun
    </button>
  </div>
</template>
