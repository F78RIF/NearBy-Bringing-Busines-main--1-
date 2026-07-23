<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { useDashboardStore } from '@/stores/dashboard'

const ui = useUiStore()
const dashboard = useDashboardStore()

function reset() {
  const email = ui.modalItem?.email
  ui.closeModal()
  if (email) dashboard.userReset(email)
}
function toggleActive() {
  const item = ui.modalItem
  ui.closeModal()
  if (item) dashboard.userToggleActive(item.email, item.name)
}
</script>

<template>
  <div class="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(15,30,45,.5)] p-6" @click="ui.closeModal">
    <div class="w-full max-w-[410px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_rgba(9,24,40,.4)]" @click.stop>
      <div class="flex items-center justify-between border-b border-border-divider px-6 py-[19px]">
        <div class="text-lg font-extrabold">Kelola pengguna</div>
        <button type="button" class="text-2xl leading-none text-text-faint" @click="ui.closeModal">×</button>
      </div>
      <div class="px-6 py-[22px]">
        <div class="mb-5 flex items-center gap-[13px]">
          <div class="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-brand-blue-tint text-[19px] font-extrabold text-brand-blue">
            {{ ui.modalItem?.initial }}
          </div>
          <div class="min-w-0">
            <div class="text-base font-extrabold">{{ ui.modalItem?.name }}</div>
            <div class="text-[13px] text-text-faint">{{ ui.modalItem?.email }}</div>
          </div>
          <span
            class="ml-auto rounded-full px-[11px] py-1.5 text-[11.5px] font-bold whitespace-nowrap"
            :style="{ background: ui.modalItem?.roleBg, color: ui.modalItem?.roleColor }"
          >
            {{ ui.modalItem?.role }}
          </span>
        </div>
        <div class="flex flex-col gap-2.5">
          <button type="button" class="rounded-xl border border-[#E7E0D2] bg-white px-[15px] py-[13px] text-left text-sm font-bold text-brand-navy" @click="reset">
            Kirim tautan reset password
          </button>
          <button
            type="button"
            class="rounded-xl border border-[#E7C97F] bg-white px-[15px] py-[13px] text-left text-sm font-bold text-[#B07A1E]"
            @click="toggleActive"
          >
            {{ ui.modalItem?.status === 'Nonaktif' ? 'Aktifkan akun' : 'Nonaktifkan akun' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
