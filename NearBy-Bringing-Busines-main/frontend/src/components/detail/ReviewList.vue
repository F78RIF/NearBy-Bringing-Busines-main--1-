<script setup lang="ts">
import { ref } from 'vue'
import { starsLabel } from '@/data/reviews'
import { useAuthStore } from '@/stores/auth'
import { useReviewsStore } from '@/stores/reviews'
import StarRating from '@/components/shared/StarRating.vue'
import DeleteIcon from '@/components/shared/DeleteIcon.vue'
import EditIcon from '@/components/shared/EditIcon.vue'
import SaveIcon from '@/components/shared/SaveIcon.vue'
import type { Review } from '@/types'

defineProps<{ reviews: Review[] }>()

const auth = useAuthStore()
const reviewsStore = useReviewsStore()

const editingId = ref<string | null>(null)
const editStars = ref(5)
const editText = ref('')

function isMine(rv: Review) {
  return auth.isAuthed && rv.name === auth.user?.name
}

function startEdit(rv: Review) {
  editingId.value = rv.id
  editStars.value = rv.stars
  editText.value = rv.text
}

function cancelEdit() {
  editingId.value = null
}

function saveEdit(rv: Review) {
  if (!editText.value.trim()) return
  reviewsStore.updateReview(rv.umkmId, rv.id, { stars: editStars.value, text: editText.value.trim() })
  editingId.value = null
}

function removeReview(rv: Review) {
  if (confirm('Hapus ulasan ini?')) {
    reviewsStore.deleteReview(rv.umkmId, rv.id)
  }
}
</script>

<template>
  <div
    v-for="rv in reviews"
    :key="rv.id"
    class="flex gap-[13px] border-t border-[#F0EADD] py-4 first:border-t-0"
  >
    <div class="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-brand-blue-tint font-extrabold text-brand-blue">
      {{ rv.initial }}
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="font-bold">{{ rv.name }}</div>
        <div class="text-[13px] font-bold text-gold">{{ starsLabel(rv.stars) }}</div>
        <div class="text-[12.5px] font-semibold text-text-faint-3">{{ rv.date }}</div>
        <div v-if="isMine(rv) && editingId !== rv.id" class="ml-auto flex gap-3">
          <button type="button" class="flex items-center gap-1 text-[12px] font-bold text-brand-navy outline-none hover:underline" @click="startEdit(rv)">
            <EditIcon size="13px" /> Edit
          </button>
          <button type="button" class="flex items-center gap-1 text-[12px] font-bold text-danger outline-none hover:underline" @click="removeReview(rv)">
            <DeleteIcon size="13px" /> Hapus
          </button>
        </div>
      </div>

      <template v-if="editingId === rv.id">
        <div class="mt-2.5 flex gap-1">
          <StarRating v-model="editStars" interactive />
        </div>
        <textarea
          v-model="editText"
          rows="3"
          class="mt-2.5 w-full rounded-xl border border-[#E7E0D2] p-3 text-[14.5px]"
        />
        <div class="mt-2 flex gap-2">
          <button type="button" class="flex items-center gap-1.5 rounded-[10px] bg-brand-blue px-4 py-2 text-[13px] font-bold text-white" @click="saveEdit(rv)">
            <SaveIcon size="13px" /> Simpan
          </button>
          <button type="button" class="rounded-[10px] border border-[#E7E0D2] px-4 py-2 text-[13px] font-bold text-brand-navy" @click="cancelEdit">
            Batal
          </button>
        </div>
      </template>
      <p v-else class="mt-1.5 text-[14.5px] leading-[1.55] text-text-secondary">{{ rv.text }}</p>
    </div>
  </div>
</template>
