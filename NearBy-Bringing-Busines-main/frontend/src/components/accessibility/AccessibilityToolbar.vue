<script setup lang="ts">
/**
 * Toolbar aksesibilitas mengambang (desktop & mobile web).
 *
 * Dipasang sekali di root layout (App.vue). Seluruh markup di-`Teleport` ke
 * <body> supaya stacking context / overflow dari halaman manapun tidak pernah
 * memotongnya, dan ditandai `data-a11y-ui` agar tidak ikut dibacakan TTS.
 *
 * Isi: Text-to-Speech, perbesar/perkecil halaman, keyboard virtual, dan
 * pengatur kecepatan animasi.
 */
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAccessibilityStore, FONT_STEPS } from '@/stores/accessibility'
import VirtualKeyboard from './VirtualKeyboard.vue'

const props = withDefaults(
  defineProps<{
    /** Geser toolbar ke bawah header sticky (dipakai saat site chrome tampil). */
    offsetTop?: boolean
    /** Sisi layar tempat toolbar mengambang. */
    side?: 'right' | 'left'
  }>(),
  { offsetTop: false, side: 'right' },
)

const a11y = useAccessibilityStore()
const route = useRoute()

// Hentikan pembacaan saat pindah halaman — isi layar sudah berganti.
watch(
  () => route.fullPath,
  () => a11y.stopSpeaking(),
)

const stepIndex = computed(() => Math.max(0, FONT_STEPS.indexOf(a11y.fontScale as (typeof FONT_STEPS)[number])))

/**
 * Toolbar hidup di dalam <html> yang di-zoom oleh fitur perbesar halaman, jadi
 * kita balikkan zoom-nya di sini supaya kontrolnya sendiri tetap seukuran.
 */
const counterZoom = computed(() => ({ zoom: `calc(1 / var(--a11y-scale, 1))` }))

const anchor = computed(() => [
  props.side === 'left' ? 'left-3 items-start mobile:left-5' : 'right-3 items-end mobile:right-5',
  props.offsetTop ? 'top-[82px] mobile:top-[88px]' : 'top-3 mobile:top-5',
])
</script>

<template>
  <Teleport to="body">
    <div
      data-a11y-ui
      :class="['fixed z-[100] flex flex-col gap-2.5', anchor]"
      :style="[counterZoom, { '--tw-duration': '250ms' }]"
    >
      <!-- Tombol pemicu: selalu terlihat, di mobile ini satu-satunya yang tampil
           saat panel tertutup (collapse jadi ikon kecil). -->
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-brand-navy text-white shadow-[0_12px_30px_rgba(19,50,77,.35)] transition-all hover:-translate-y-0.5 hover:bg-brand-blue-deep mobile:h-[54px] mobile:w-[54px]"
        :class="{ 'ring-4 ring-gold-bright/45': a11y.toolbarOpen }"
        :aria-expanded="a11y.toolbarOpen"
        aria-controls="a11y-panel"
        aria-label="Buka menu aksesibilitas"
        title="Aksesibilitas"
        @click="a11y.toggleToolbar"
      >
        <!-- universal access glyph -->
        <svg viewBox="0 0 24 24" class="h-6 w-6 mobile:h-7 mobile:w-7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9.2" />
          <circle cx="12" cy="6.9" r="1.15" fill="currentColor" stroke="none" />
          <path d="M6.9 9.6c3.4 1 6.8 1 10.2 0" />
          <path d="M12 9.9v4.1m0 0-2.1 4.3M12 14l2.1 4.3" />
        </svg>
      </button>

      <Transition name="a11y-panel">
        <div
          v-if="a11y.toolbarOpen"
          id="a11y-panel"
          role="region"
          aria-label="Pengaturan aksesibilitas"
          class="w-[min(300px,calc(100vw-24px))] max-h-[calc(100vh-140px)] overflow-y-auto rounded-[18px] border border-border-card bg-white shadow-[0_22px_55px_rgba(9,24,40,.28)] mobile:w-[320px]"
        >
          <div class="flex items-center justify-between bg-brand-navy px-4 py-3.5 text-white">
            <div>
              <div class="text-[15px] font-extrabold">Aksesibilitas</div>
              <div class="mt-px text-[11px] text-[#AFC3DC]">Bantuan baca, teks &amp; keyboard</div>
            </div>
            <button
              type="button"
              class="text-2xl leading-none text-[#AFC3DC] transition-colors hover:text-white"
              aria-label="Tutup menu aksesibilitas"
              @click="a11y.toolbarOpen = false"
            >
              ×
            </button>
          </div>

          <!-- 1. Text-to-Speech -->
          <section class="border-b border-border-divider px-4 py-3.5">
            <div class="mb-2 text-[12.5px] font-extrabold text-brand-navy">Bacakan halaman</div>

            <div v-if="!a11y.speechSupported" class="rounded-[10px] bg-cream px-3 py-2.5 text-[12px] leading-relaxed text-text-muted">
              Peramban ini belum mendukung pembacaan suara (Web Speech API).
            </div>

            <template v-else>
              <button
                type="button"
                class="mb-2 flex w-full items-center justify-center gap-2 rounded-[11px] px-4 py-2.5 text-[13px] font-extrabold text-white transition-all hover:-translate-y-px"
                :class="a11y.speaking ? 'bg-danger hover:bg-danger-deep' : 'bg-brand-blue hover:bg-brand-blue-deep'"
                @click="a11y.toggleSpeakPage()"
              >
                <span aria-hidden="true">{{ a11y.speaking ? '■' : '▶' }}</span>
                {{ a11y.speaking ? 'Hentikan' : 'Bacakan isi layar' }}
              </button>

              <button
                v-if="a11y.speaking"
                type="button"
                class="mb-2.5 w-full rounded-[11px] border border-border-input px-4 py-2 text-[12.5px] font-bold text-text-secondary transition-colors hover:bg-cream"
                @click="a11y.pauseSpeaking()"
              >
                {{ a11y.paused ? '▶ Lanjutkan' : '❙❙ Jeda' }}
              </button>

              <label class="mb-1 flex items-center justify-between text-[11.5px] font-bold text-text-muted">
                <span>Kecepatan suara</span>
                <span class="text-brand-navy">{{ a11y.speechRate.toFixed(1) }}×</span>
              </label>
              <input
                v-model.number="a11y.speechRate"
                type="range"
                min="0.6"
                max="1.6"
                step="0.1"
                class="a11y-range w-full"
                aria-label="Kecepatan suara"
              />
            </template>
          </section>

          <!-- 2. Ukuran teks / halaman -->
          <section class="border-b border-border-divider px-4 py-3.5">
            <div class="mb-2 flex items-center justify-between">
              <div class="text-[12.5px] font-extrabold text-brand-navy">Ukuran tampilan</div>
              <div class="text-[11.5px] font-bold text-text-muted">{{ Math.round(a11y.fontScale * 100) }}%</div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="h-10 w-11 shrink-0 rounded-[11px] border border-border-input text-[13px] font-extrabold text-brand-navy transition-colors hover:bg-cream disabled:opacity-40"
                :disabled="stepIndex === 0"
                aria-label="Perkecil ukuran teks"
                @click="a11y.stepFont(-1)"
              >
                A−
              </button>

              <input
                :value="stepIndex"
                type="range"
                min="0"
                :max="FONT_STEPS.length - 1"
                step="1"
                class="a11y-range min-w-0 flex-1"
                aria-label="Ukuran teks"
                @input="a11y.setFontScale(FONT_STEPS[Number(($event.target as HTMLInputElement).value)])"
              />

              <button
                type="button"
                class="h-10 w-11 shrink-0 rounded-[11px] border border-border-input text-[17px] font-extrabold text-brand-navy transition-colors hover:bg-cream disabled:opacity-40"
                :disabled="stepIndex === FONT_STEPS.length - 1"
                aria-label="Perbesar ukuran teks"
                @click="a11y.stepFont(1)"
              >
                A+
              </button>
            </div>

            <button
              v-if="a11y.fontScale !== 1"
              type="button"
              class="mt-2 w-full rounded-[10px] bg-cream px-3 py-1.5 text-[11.5px] font-bold text-text-muted transition-colors hover:bg-surface-alt"
              @click="a11y.resetFontScale()"
            >
              Kembalikan ke 100%
            </button>
          </section>

          <!-- 3. Keyboard virtual -->
          <section class="border-b border-border-divider px-4 py-3.5">
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 text-left"
              :aria-pressed="a11y.keyboardOpen"
              @click="a11y.keyboardOpen = !a11y.keyboardOpen"
            >
              <span>
                <span class="block text-[12.5px] font-extrabold text-brand-navy">Keyboard virtual</span>
                <span class="mt-px block text-[11px] leading-snug text-text-muted">Mengetik cukup dengan klik / tap</span>
              </span>
              <span
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                :class="a11y.keyboardOpen ? 'bg-brand-blue' : 'bg-border-input'"
              >
                <span
                  class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                  :class="a11y.keyboardOpen ? 'left-[22px]' : 'left-0.5'"
                />
              </span>
            </button>
          </section>

          <!-- 4. Kecepatan animasi -->
          <section class="px-4 py-3.5">
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 text-left"
              :aria-pressed="a11y.slowMotion"
              @click="a11y.toggleSlowMotion()"
            >
              <span>
                <span class="block text-[12.5px] font-extrabold text-brand-navy">Animasi lambat &amp; halus</span>
                <span class="mt-px block text-[11px] leading-snug text-text-muted">
                  {{ a11y.slowMotion ? 'Transisi 500ms, easing halus' : 'Transisi cepat (bawaan)' }}
                </span>
              </span>
              <span
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                :class="a11y.slowMotion ? 'bg-teal' : 'bg-border-input'"
              >
                <span
                  class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                  :class="a11y.slowMotion ? 'left-[22px]' : 'left-0.5'"
                />
              </span>
            </button>
          </section>
        </div>
      </Transition>
    </div>

    <VirtualKeyboard v-if="a11y.keyboardOpen" />
  </Teleport>
</template>

<style scoped>
.a11y-panel-enter-active,
.a11y-panel-leave-active {
  transition:
    opacity var(--a11y-dur, 500ms) var(--a11y-ease, cubic-bezier(0.4, 0, 0.2, 1)),
    transform var(--a11y-dur, 500ms) var(--a11y-ease, cubic-bezier(0.4, 0, 0.2, 1));
}
.a11y-panel-enter-from,
.a11y-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}

.a11y-range {
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: var(--color-border-input);
  outline: none;
}
.a11y-range::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-brand-blue);
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(9, 24, 40, 0.28);
  cursor: pointer;
}
.a11y-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-brand-blue);
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(9, 24, 40, 0.28);
  cursor: pointer;
}
</style>
