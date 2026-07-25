<script setup lang="ts">
import { reactive } from 'vue'
import { useContentStore } from '@/stores/content'
import SocialVideoEmbed from '@/components/shared/SocialVideoEmbed.vue'
import type { VideoPlatform } from '@/types'

const content = useContentStore()

const form = reactive({
  platform: 'youtube' as VideoPlatform,
  url: '',
  title: '',
})

function submit() {
  if (!form.url.trim()) {
    alert('Tempel link video terlebih dahulu.')
    return
  }
  content.addVideo(form.platform, form.url, form.title)
  form.url = ''
  form.title = ''
}

function remove(id: string, title: string) {
  if (confirm(`Hapus video "${title}" dari landing page?`)) content.removeVideo(id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-[22px] font-extrabold tracking-[-.02em]">Konten Video</h1>
      <p class="mt-1 text-[14px] text-text-secondary">
        Kelola video Instagram Reels &amp; YouTube yang tampil di section "Konten Terbaru" landing page.
        Cukup tempel link — tidak perlu edit kode.
      </p>
    </div>

    <!-- Form tambah -->
    <div class="rounded-[18px] border border-border-card bg-white p-5">
      <div class="mb-3 text-[15px] font-extrabold">Tambah video</div>
      <div class="grid grid-cols-1 gap-3 tablet:grid-cols-[150px_1fr]">
        <div>
          <label class="mb-1.5 block text-[13px] font-bold">Platform</label>
          <select
            v-model="form.platform"
            class="w-full rounded-xl border border-border-input bg-white px-3 py-2.5 font-semibold text-brand-navy"
          >
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-[13px] font-bold">Link video</label>
          <input
            v-model="form.url"
            :placeholder="
              form.platform === 'instagram'
                ? 'https://www.instagram.com/reel/XXXXXXX/'
                : 'https://www.youtube.com/watch?v=XXXX atau /shorts/XXXX'
            "
            class="w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5"
          />
        </div>
      </div>
      <label class="mt-3 mb-1.5 block text-[13px] font-bold">Judul (opsional)</label>
      <input
        v-model="form.title"
        placeholder="mis. Amplang khas Balikpapan"
        class="w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5"
      />
      <div class="mt-4 flex justify-end">
        <button
          type="button"
          class="rounded-xl bg-brand-blue px-[22px] py-2.5 font-extrabold text-white"
          @click="submit"
        >
          + Tambah video
        </button>
      </div>
    </div>

    <!-- Daftar video -->
    <div>
      <div class="mb-3 text-[15px] font-extrabold">Video tampil ({{ content.videos.length }})</div>
      <div v-if="!content.videos.length" class="rounded-[18px] border border-dashed border-border-card p-8 text-center text-text-faint">
        Belum ada video. Tambahkan lewat form di atas.
      </div>
      <div v-else class="grid grid-cols-1 gap-5 mobile:grid-cols-2 tablet:grid-cols-3">
        <div v-for="v in content.videos" :key="v.id" class="flex flex-col gap-2">
          <SocialVideoEmbed :video="v" />
          <div class="flex items-center gap-2">
            <input
              :value="v.title"
              class="min-w-0 flex-1 rounded-[10px] border border-border-input bg-white px-3 py-2 text-[13px]"
              @change="content.updateVideo(v.id, { title: ($event.target as HTMLInputElement).value })"
            />
            <button
              type="button"
              class="flex-none rounded-[9px] border border-danger-border px-3 py-2 text-[13px] font-bold text-danger"
              @click="remove(v.id, v.title)"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
