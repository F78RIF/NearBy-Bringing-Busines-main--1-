<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { useUiStore } from '@/stores/ui'
import { starsLabel } from '@/data/reviews'
import EditIcon from '@/components/shared/EditIcon.vue'
import SaveIcon from '@/components/shared/SaveIcon.vue'
import DeleteIcon from '@/components/shared/DeleteIcon.vue'

const account = useAccountStore()
const ui = useUiStore()
const router = useRouter()

const historyTab = ref<'komentar' | 'kunjungan'>('komentar')

const editingCid = ref<number | null>(null)
const editText = ref('')

function startEdit(cid: number, text: string) {
  editingCid.value = cid
  editText.value = text
}
function cancelEdit() {
  editingCid.value = null
}
function saveEdit(cid: number) {
  account.updateComment(cid, editText.value)
  editingCid.value = null
}
function removeComment(cid: number, umkmName: string) {
  if (!confirm(`Hapus komentar untuk "${umkmName}"?`)) return
  account.deleteComment(cid)
}

function openUmkm(id: number) {
  ui.closeSettings()
  router.push({ name: 'detail', params: { id } })
}

const visitHistory = [
  { id: 2, name: 'Kopi Saluang', cat: 'Kuliner', loc: 'Balikpapan Tengah', when: 'Hari ini' },
  { id: 1, name: 'Warung Kepiting Kenari', cat: 'Kuliner', loc: 'Balikpapan Timur', when: 'Kemarin' },
  { id: 5, name: 'Batik Beruang Madu', cat: 'Fashion', loc: 'Balikpapan Kota', when: '3 hari lalu' },
  { id: 4, name: 'Amplang Bahari', cat: 'Oleh-Oleh', loc: 'Balikpapan Utara', when: '1 minggu lalu' },
]
</script>

<template>
  <div class="mb-4 flex gap-1.5 border-b border-[#E7DFCF]">
    <button
      type="button"
      class="border-b-[2.5px] px-1 pt-2 pb-2.5 text-[13.5px] font-extrabold"
      :class="historyTab === 'komentar' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-text-muted'"
      @click="historyTab = 'komentar'"
    >
      Komentar
    </button>
    <button
      type="button"
      class="border-b-[2.5px] px-1 pt-2 pb-2.5 text-[13.5px] font-extrabold"
      :class="historyTab === 'kunjungan' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-text-muted'"
      @click="historyTab = 'kunjungan'"
    >
      Kunjungan
    </button>
  </div>

  <template v-if="historyTab === 'komentar'">
    <div v-if="account.commentHistory.length === 0" class="rounded-[14px] border border-border-card bg-white px-5 py-10 text-center text-text-faint">
      <div class="text-3xl">💬</div>
      <div class="mt-2 text-[15px] font-extrabold text-brand-navy">Belum ada komentar</div>
      <p class="mt-1.5 text-[13px]">Komentar yang kamu tulis di UMKM akan muncul di sini.</p>
    </div>
    <div v-else class="flex flex-col gap-3">
      <div v-for="c in account.commentHistory" :key="c.cid" class="rounded-[14px] border border-border-card bg-white px-[18px] py-4">
        <div class="mb-1.5 flex items-center justify-between gap-2.5">
          <button type="button" class="text-sm font-extrabold text-brand-blue hover:underline" @click="openUmkm(c.umkmId)">
            {{ c.umkm }} ↗
          </button>
          <div class="text-[13px] font-bold whitespace-nowrap text-gold">{{ starsLabel(c.stars) }}</div>
        </div>
        <template v-if="editingCid !== c.cid">
          <div class="text-[13px] leading-relaxed text-[#5B6470]">{{ c.text }}</div>
          <div class="mt-2.5 flex items-center gap-2">
            <div class="flex-1 text-xs font-semibold text-[#A69F8E]">{{ c.cat }} · {{ c.date }}</div>
            <button
              type="button"
              class="flex items-center gap-1 rounded-[9px] bg-brand-blue-tint px-[13px] py-1.5 text-[12.5px] font-bold text-brand-blue"
              @click="startEdit(c.cid, c.text)"
            >
              <EditIcon size="12px" /> Edit
            </button>
            <button
              type="button"
              class="flex items-center gap-1 rounded-[9px] border border-danger-border px-[13px] py-1.5 text-[12.5px] font-bold text-danger"
              @click="removeComment(c.cid, c.umkm)"
            >
              <DeleteIcon size="12px" /> Hapus
            </button>
          </div>
        </template>
        <template v-else>
          <textarea
            v-model="editText"
            class="mb-2.5 min-h-[78px] w-full resize-y rounded-[11px] border border-border-input px-3.5 py-2.5 text-brand-navy"
          />
          <div class="flex justify-end gap-2">
            <button type="button" class="rounded-[9px] border border-border-input px-3.5 py-2 text-[12.5px] font-bold text-text-muted" @click="cancelEdit">
              Batal
            </button>
            <button
              type="button"
              class="flex items-center gap-1 rounded-[9px] bg-brand-blue px-4 py-2 text-[12.5px] font-extrabold text-white"
              @click="saveEdit(c.cid)"
            >
              <SaveIcon size="12px" /> Simpan
            </button>
          </div>
        </template>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="rounded-2xl border border-border-card bg-white px-5 py-2">
      <button
        v-for="v in visitHistory"
        :key="v.id"
        type="button"
        class="flex w-full items-center gap-[13px] border-b border-[#F4EFE4] py-3.5 text-left last:border-b-0 hover:bg-[#FAF7F0]"
        @click="openUmkm(v.id)"
      >
        <div
          class="h-11 w-11 flex-none rounded-[11px]"
          style="background: repeating-linear-gradient(135deg, #ece6da 0 8px, #f4efe6 8px 16px)"
        />
        <div class="min-w-0 flex-1">
          <div class="text-sm font-extrabold text-brand-navy">{{ v.name }}</div>
          <div class="text-[12.5px] text-text-faint">{{ v.cat }} · {{ v.loc }}</div>
        </div>
        <div class="text-[12.5px] font-semibold whitespace-nowrap text-[#A69F8E]">{{ v.when }}</div>
        <span class="text-[15px] text-brand-blue">↗</span>
      </button>
    </div>
  </template>
</template>
