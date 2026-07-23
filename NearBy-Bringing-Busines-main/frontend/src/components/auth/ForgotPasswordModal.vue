<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ initialEmail: string }>()
const emit = defineEmits<{ close: [] }>()

const email = ref(props.initialEmail)
const sent = ref(false)

function submit() {
  if (!email.value.trim() || !email.value.includes('@')) {
    alert('Masukkan alamat email yang valid.')
    return
  }
  sent.value = true
}
</script>

<template>
  <div
    class="fixed inset-0 z-[97] flex items-center justify-center bg-[rgba(11,20,30,.55)] p-6 backdrop-blur-[3px]"
    @click="emit('close')"
  >
    <div class="w-[420px] max-w-full overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(9,24,40,.42)]" @click.stop>
      <div class="flex items-center justify-between bg-brand-navy px-[22px] py-[18px] text-white">
        <div class="text-base font-extrabold">Lupa password</div>
        <button type="button" class="text-2xl leading-none text-[#AFC3DC]" @click="emit('close')">×</button>
      </div>

      <div v-if="!sent" class="p-[22px]">
        <p class="mb-4 text-[13.5px] leading-relaxed text-[#5B6470]">
          Masukkan email akunmu. Kami akan mengirim tautan untuk mengatur ulang kata sandi ke email tersebut.
        </p>
        <label class="mb-1.5 block text-[13px] font-bold text-brand-navy">Email</label>
        <input
          v-model="email"
          placeholder="nama@email.com"
          class="mb-[18px] w-full rounded-[11px] border border-border-input px-3.5 py-3 text-brand-navy"
        />
        <div class="flex justify-end gap-2">
          <button type="button" class="rounded-[11px] border border-border-input px-4 py-2.5 font-bold text-text-muted" @click="emit('close')">
            Batal
          </button>
          <button type="button" class="rounded-[11px] bg-brand-blue px-5 py-2.5 font-extrabold text-white" @click="submit">
            Kirim tautan
          </button>
        </div>
      </div>

      <div v-else class="p-[22px] pt-[26px] text-center">
        <div class="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-tint text-2xl text-teal-deep">✓</div>
        <div class="text-[17px] font-extrabold text-brand-navy">Cek email kamu</div>
        <p class="mt-2 text-[13.5px] leading-relaxed text-[#5B6470]">
          Kami sudah mengirim tautan atur ulang kata sandi ke <b class="text-brand-navy">{{ email }}</b>. Buka email
          itu dan ikuti langkahnya. Tautan berlaku 1 jam.
        </p>
        <p class="mt-3.5 text-[12.5px] leading-relaxed text-text-faint">
          Tidak menerima email? Cek folder spam, atau kirim ulang.
        </p>
        <div class="mt-[18px] flex justify-center gap-2">
          <button type="button" class="rounded-[11px] border border-border-input px-[18px] py-2.5 font-bold text-brand-navy" @click="submit">
            Kirim ulang
          </button>
          <button type="button" class="rounded-[11px] bg-brand-blue px-[22px] py-2.5 font-extrabold text-white" @click="emit('close')">
            Mengerti
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
