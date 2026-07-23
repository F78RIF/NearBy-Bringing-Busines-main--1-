<script setup lang="ts">
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { starsLabel } from '@/data/reviews'

const ui = useUiStore()
const replyText = ref('')

function sendReply() {
  const name = ui.modalItem?.name
  ui.closeModal()
  replyText.value = ''
  alert(`Balasan untuk ulasan ${name ?? ''} telah dikirim.`)
}
</script>

<template>
  <div class="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(15,30,45,.5)] p-6" @click="ui.closeModal">
    <div class="w-full max-w-[480px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_rgba(9,24,40,.4)]" @click.stop>
      <div class="flex items-center justify-between border-b border-border-divider px-6 py-[19px]">
        <div class="text-lg font-extrabold">Balas ulasan</div>
        <button type="button" class="text-2xl leading-none text-text-faint" @click="ui.closeModal">×</button>
      </div>
      <div class="px-6 py-[22px]">
        <div class="mb-4 rounded-[13px] border border-border-divider bg-cream px-4 py-3.5">
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="text-[14.5px] font-extrabold">{{ ui.modalItem?.name }}</div>
            <div class="text-[13px] font-bold text-gold">{{ starsLabel(ui.modalItem?.stars ?? 5) }}</div>
            <div class="text-xs font-semibold text-text-faint-3">· {{ ui.modalItem?.date }}</div>
          </div>
          <div class="mt-0.5 text-[12.5px] font-bold text-brand-blue">untuk {{ ui.modalItem?.umkm }}</div>
          <div class="mt-2 text-sm leading-relaxed text-text-secondary">{{ ui.modalItem?.text }}</div>
        </div>
        <label class="mb-1.5 block text-[13px] font-bold">Balasan kamu <span class="font-semibold text-text-faint">· tampil publik di bawah ulasan</span></label>
        <textarea
          v-model="replyText"
          placeholder="Terima kasih atas ulasannya! …"
          class="min-h-24 w-full resize-y rounded-xl border border-border-input bg-white px-3.5 py-3"
        />
      </div>
      <div class="flex justify-end gap-2.5 border-t border-border-divider px-6 py-[15px]">
        <button type="button" class="rounded-xl border border-border-input px-5 py-2.5 font-bold text-brand-navy" @click="ui.closeModal">Batal</button>
        <button type="button" class="rounded-xl bg-brand-blue px-[22px] py-2.5 font-extrabold text-white" @click="sendReply">Kirim balasan</button>
      </div>
    </div>
  </div>
</template>
