<script setup lang="ts">
import { useAccountStore } from '@/stores/account'
import { useAuthStore } from '@/stores/auth'

const account = useAccountStore()
const auth = useAuthStore()

function restore() {
  const restored = account.restoreMyAccount()
  if (restored) auth.login(restored.name, restored.role)
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
