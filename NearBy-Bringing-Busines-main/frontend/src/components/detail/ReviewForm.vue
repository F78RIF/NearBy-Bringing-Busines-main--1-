<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReviewsStore } from '@/stores/reviews'

const props = defineProps<{ umkmId: number }>()

const auth = useAuthStore()
const reviews = useReviewsStore()

const stars = ref(5)
const text = ref('')
const media = ref<{ url: string; file: File }[]>([])

/**
 * Ulasan user untuk UMKM ini, kalau sudah ada. Selama ini ada, form berada
 * dalam mode edit — mengirim akan memperbarui ulasan tersebut, bukan menambah
 * ulasan kedua (pola Play Store).
 */
const myReview = computed(() => reviews.myReviewFor(props.umkmId, auth.user?.name))
const isEditing = computed(() => !!myReview.value)

/**
 * Isi form dengan ulasan lama. Dijalankan juga saat pindah UMKM dan saat user
 * login/logout, bukan cuma sekali di mount — komponen detail dipakai ulang
 * antar-halaman lewat RouterView.
 */
watch(
  () => [props.umkmId, auth.user?.name] as const,
  () => {
    const existing = myReview.value
    stars.value = existing?.stars ?? 5
    text.value = existing?.text ?? ''
    media.value = []
  },
  { immediate: true },
)

function onPickMedia(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const file of Array.from(files)) {
    media.value.push({ url: URL.createObjectURL(file), file })
  }
  ;(e.target as HTMLInputElement).value = ''
}

function removeMedia(i: number) {
  media.value.splice(i, 1)
}

function submit() {
  if (!text.value.trim() || !auth.user) return
  reviews.upsertReview(props.umkmId, {
    initial: auth.authInitial,
    name: auth.user.name,
    stars: stars.value,
    date: 'Baru saja',
    text: text.value.trim(),
  })
  // Form tidak dikosongkan lagi: setelah kirim, user tetap punya satu ulasan
  // aktif dan form langsung jadi mode edit atas ulasan itu.
  media.value = []
}
</script>

<template>
  <div class="mt-[22px] rounded-2xl border border-border-card bg-white p-5">
    <template v-if="auth.isAuthed">
      <div class="mb-1 font-extrabold">{{ isEditing ? 'Ubah ulasan kamu' : 'Beri rating & komentar' }}</div>
      <div v-if="isEditing" class="mb-3 text-[12.5px] leading-relaxed text-text-muted">
        Kamu sudah pernah mengulas UMKM ini ({{ myReview?.date }}). Mengirim lagi akan memperbarui
        ulasan tersebut, bukan menambah ulasan baru.
      </div>
      <div class="mb-3 flex gap-1">
        <span
          v-for="n in 5"
          :key="n"
          class="cursor-pointer text-[28px] leading-none"
          :style="{ color: n <= stars ? '#E7A83A' : '#E2DBCB' }"
          @click="stars = n"
        >
          ★
        </span>
      </div>
      <textarea
        v-model="text"
        rows="3"
        placeholder="Ceritakan pengalamanmu…"
        class="mb-3 w-full rounded-xl border border-[#E7E0D2] p-3"
      />
      <div class="mb-3 flex flex-wrap gap-2.5">
        <div v-for="(m, i) in media" :key="m.url" class="relative h-[74px] w-[74px]">
          <img :src="m.url" class="h-full w-full rounded-xl object-cover" />
          <button
            type="button"
            class="absolute -top-1.5 -right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white bg-brand-navy text-xs text-white"
            @click="removeMedia(i)"
          >
            ✕
          </button>
        </div>
        <label
          class="flex h-[74px] w-[74px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#D6CFC0] text-[11px] font-semibold text-text-faint hover:border-brand-blue hover:text-brand-blue"
          style="background: repeating-linear-gradient(135deg, #f6f1e8 0 9px, #fbf8f2 9px 18px)"
        >
          <span class="text-lg">＋</span>
          Media
          <input type="file" accept="image/*,video/*" multiple class="hidden" @change="onPickMedia" />
        </label>
      </div>
      <button type="button" class="rounded-[11px] bg-brand-blue px-5 py-2.5 font-bold text-white" @click="submit">
        {{ isEditing ? 'Perbarui ulasan' : 'Kirim ulasan' }}
      </button>
    </template>
    <div v-else class="flex flex-wrap items-center justify-between gap-3">
      <div class="text-text-secondary">Masuk untuk memberi rating dan komentar.</div>
      <RouterLink :to="{ name: 'login' }" class="rounded-[11px] bg-brand-navy px-5 py-2.5 font-bold text-white">
        Masuk sekarang
      </RouterLink>
    </div>
  </div>
</template>
