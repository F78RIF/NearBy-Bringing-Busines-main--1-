<script setup lang="ts">
/**
 * Keyboard virtual — dioperasikan penuh dengan mouse / tap.
 *
 * Setiap tombol memakai `@mousedown.prevent` supaya fokus tetap berada di
 * kolom isian yang sedang aktif (tidak ada tombol yang mencuri fokus), lalu
 * karakter disisipkan tepat di posisi caret dan sebuah event `input`
 * di-dispatch manual agar `v-model` Vue ikut ter-update.
 */
import { computed, ref } from 'vue'
import { useAccessibilityStore } from '@/stores/accessibility'

const a11y = useAccessibilityStore()

const shift = ref(false)
const capsLock = ref(false)
const numericMode = ref(false)

const upper = computed(() => shift.value !== capsLock.value)

const digitRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const letterRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]
const symbolRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '%', '&', '*', '-', '+', '(', ')'],
  ['!', '"', "'", ':', ';', '/', '?'],
]

const rows = computed(() => (numericMode.value ? symbolRows : letterRows))

const field = computed(() => a11y.activeField)

function label(key: string) {
  return upper.value ? key.toUpperCase() : key
}

/** Write `value` into the active field and let Vue know about it. */
function commit(el: HTMLInputElement | HTMLTextAreaElement, value: string, caret: number) {
  el.value = value
  el.setSelectionRange(caret, caret)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

function insert(text: string) {
  const el = field.value
  if (!el) return
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? start
  commit(el, el.value.slice(0, start) + text + el.value.slice(end), start + text.length)
  if (shift.value) shift.value = false
}

function pressKey(key: string) {
  insert(upper.value && !numericMode.value ? key.toUpperCase() : key)
}

function backspace() {
  const el = field.value
  if (!el) return
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? start
  if (start === end) {
    if (start === 0) return
    commit(el, el.value.slice(0, start - 1) + el.value.slice(end), start - 1)
  } else {
    commit(el, el.value.slice(0, start) + el.value.slice(end), start)
  }
}

function clearField() {
  const el = field.value
  if (!el) return
  commit(el, '', 0)
}

function moveCaret(delta: number) {
  const el = field.value
  if (!el) return
  const next = Math.min(el.value.length, Math.max(0, (el.selectionStart ?? 0) + delta))
  el.setSelectionRange(next, next)
  el.focus()
}

/** Pindah ke kolom isian berikutnya / sebelumnya (pengganti tombol Tab). */
function focusSibling(direction: 1 | -1) {
  const fields = Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'),
  ).filter((el) => !el.disabled && !el.readOnly && el.type !== 'hidden' && el.offsetParent !== null && !el.closest('[data-a11y-ui]'))
  if (!fields.length) return
  const index = field.value ? fields.indexOf(field.value) : -1
  const next = fields[(index + direction + fields.length) % fields.length]
  next?.focus()
}

function pressEnter() {
  const el = field.value
  if (!el) return
  if (el instanceof HTMLTextAreaElement) {
    insert('\n')
    return
  }
  // Untuk <input>, Enter berarti submit form-nya (kalau ada).
  const form = el.form
  if (form) {
    if (typeof form.requestSubmit === 'function') form.requestSubmit()
    else form.submit()
  } else {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  }
}
</script>

<template>
  <!-- data-a11y-ui menandai seluruh subtree agar diabaikan TTS & focus-tracking -->
  <div
    data-a11y-ui
    class="fixed inset-x-0 bottom-0 z-[101] border-t border-border-card bg-white/97 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-18px_45px_rgba(9,24,40,.22)] backdrop-blur-[10px] mobile:px-4 mobile:pt-3"
    style="--tw-duration: 200ms"
    role="group"
    aria-label="Keyboard virtual"
  >
    <div class="mx-auto max-w-[760px]">
      <div class="mb-2 flex items-center justify-between gap-2 px-1">
        <div class="truncate text-[11.5px] font-bold text-text-muted mobile:text-xs">
          <span v-if="field">Mengetik di kolom yang sedang aktif</span>
          <span v-else class="text-danger">Klik dulu kolom isian yang ingin diketik</span>
        </div>
        <button
          type="button"
          class="rounded-[9px] border border-border-input px-2.5 py-1 text-[11.5px] font-extrabold text-text-muted transition-colors hover:bg-cream"
          @mousedown.prevent
          @click="a11y.keyboardOpen = false"
        >
          Tutup ✕
        </button>
      </div>

      <!-- baris angka (hanya di mode huruf; mode simbol sudah punya angka) -->
      <div v-if="!numericMode" class="mb-1.5 flex gap-1 mobile:gap-1.5">
        <button
          v-for="d in digitRow"
          :key="d"
          type="button"
          class="vk-key flex-1"
          @mousedown.prevent
          @click="insert(d)"
        >
          {{ d }}
        </button>
      </div>

      <div v-for="(row, i) in rows" :key="i" class="mb-1.5 flex justify-center gap-1 mobile:gap-1.5">
        <button
          v-if="i === 2"
          type="button"
          class="vk-key vk-key-alt min-w-[54px] flex-[0_0_auto] mobile:min-w-[74px]"
          :class="{ 'vk-key-active': upper }"
          :aria-pressed="upper"
          @mousedown.prevent
          @click="shift = !shift"
          @dblclick="capsLock = !capsLock"
        >
          ⇧ Shift
        </button>

        <button
          v-for="key in row"
          :key="key"
          type="button"
          class="vk-key flex-1"
          @mousedown.prevent
          @click="pressKey(key)"
        >
          {{ numericMode ? key : label(key) }}
        </button>

        <button
          v-if="i === 2"
          type="button"
          class="vk-key vk-key-alt min-w-[54px] flex-[0_0_auto] mobile:min-w-[74px]"
          @mousedown.prevent
          @click="backspace"
        >
          ⌫ Hapus
        </button>
      </div>

      <div class="flex items-stretch gap-1 mobile:gap-1.5">
        <button
          type="button"
          class="vk-key vk-key-alt min-w-[52px] mobile:min-w-[68px]"
          @mousedown.prevent
          @click="numericMode = !numericMode"
        >
          {{ numericMode ? 'ABC' : '?123' }}
        </button>
        <button type="button" class="vk-key vk-key-alt" @mousedown.prevent @click="insert(',')">,</button>
        <button type="button" class="vk-key flex-[3]" @mousedown.prevent @click="insert(' ')">Spasi</button>
        <button type="button" class="vk-key vk-key-alt" @mousedown.prevent @click="insert('.')">.</button>
        <button type="button" class="vk-key vk-key-alt" @mousedown.prevent @click="moveCaret(-1)" aria-label="Geser kiri">◀</button>
        <button type="button" class="vk-key vk-key-alt" @mousedown.prevent @click="moveCaret(1)" aria-label="Geser kanan">▶</button>
        <button
          type="button"
          class="vk-key vk-key-primary min-w-[62px] mobile:min-w-[84px]"
          @mousedown.prevent
          @click="pressEnter"
        >
          ⏎ Enter
        </button>
      </div>

      <div class="mt-1.5 flex gap-1 mobile:gap-1.5">
        <button type="button" class="vk-key vk-key-alt flex-1" @mousedown.prevent @click="focusSibling(-1)">
          ↰ Kolom sebelumnya
        </button>
        <button type="button" class="vk-key vk-key-alt flex-1" @mousedown.prevent @click="focusSibling(1)">
          Kolom berikutnya ↳
        </button>
        <button type="button" class="vk-key vk-key-alt flex-1" @mousedown.prevent @click="clearField">
          Kosongkan
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vk-key {
  min-width: 0;
  height: 42px;
  border-radius: 10px;
  border: 1px solid var(--color-border-input);
  background: #fff;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-brand-navy);
  user-select: none;
  transition:
    background-color var(--a11y-dur, 500ms) var(--a11y-ease, cubic-bezier(0.4, 0, 0.2, 1)),
    transform var(--a11y-dur, 500ms) var(--a11y-ease, cubic-bezier(0.4, 0, 0.2, 1)),
    box-shadow var(--a11y-dur, 500ms) var(--a11y-ease, cubic-bezier(0.4, 0, 0.2, 1));
}
.vk-key:hover {
  background: var(--color-brand-blue-tint);
}
.vk-key:active {
  transform: translateY(1px) scale(0.97);
  background: var(--color-brand-blue-tint-2);
  transition-duration: 90ms; /* feedback tekan harus tetap instan */
}
.vk-key-alt {
  background: var(--color-cream);
  font-size: 12.5px;
  color: var(--color-text-secondary);
}
.vk-key-active {
  background: var(--color-brand-navy);
  border-color: var(--color-brand-navy);
  color: #fff;
}
.vk-key-primary {
  background: var(--color-brand-navy);
  border-color: var(--color-brand-navy);
  color: #fff;
  font-size: 12.5px;
}
.vk-key-primary:hover {
  background: var(--color-brand-blue-deep);
}

@media (min-width: 560px) {
  .vk-key {
    height: 48px;
    font-size: 15.5px;
  }
}
</style>
