<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import type { SubmissionFile } from '@/types'

const ui = useUiStore()

const item = computed(() => ui.modalItem ?? {})
const files = computed<SubmissionFile[]>(() => item.value.files ?? [])
const photos = computed(() => files.value.filter((f) => f.kind === 'image'))
const docs = computed(() =>
  files.value
    .filter((f) => f.kind === 'doc')
    .map((f) => ({
      ...f,
      icon: f.ok ? '📄' : '○',
      iconBg: f.ok ? '#E6EDF8' : '#F1ECE0',
      iconColor: f.ok ? '#2C5EAD' : '#B0A48B',
      statusLabel: f.ok ? 'Terunggah' : 'Belum ada',
      statusColor: f.ok ? '#2E7D6E' : '#C0472F',
      statusBg: f.ok ? '#E3EFED' : '#F8E6E0',
    })),
)
</script>

<template>
  <div class="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(15,30,45,.5)] p-6" @click="ui.closeModal">
    <div class="flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_rgba(9,24,40,.4)]" @click.stop>
      <div class="flex flex-none items-center justify-between border-b border-border-divider px-6 py-[19px]">
        <div>
          <div class="text-lg font-extrabold">Berkas pengajuan</div>
          <div class="mt-0.5 text-[13px] font-semibold text-text-faint">{{ item.name }} · {{ item.owner }}</div>
        </div>
        <button type="button" class="text-2xl leading-none text-text-faint" @click="ui.closeModal">×</button>
      </div>

      <div class="overflow-y-auto px-6 py-5">
        <div class="mb-[18px] flex flex-wrap gap-2">
          <span class="rounded-full px-3 py-[5px] text-[11.5px] font-bold" :style="{ background: item.catSoft, color: item.catAccent }">
            {{ item.cat }}
          </span>
          <span class="rounded-full bg-[#F1ECE0] px-3 py-[5px] text-[11.5px] font-bold text-[#6B6350]">{{ item.loc }}</span>
          <span class="rounded-full bg-[#F1ECE0] px-3 py-[5px] text-[11.5px] font-bold text-[#6B6350]">Diajukan {{ item.date }}</span>
        </div>

        <div class="mb-[11px] text-sm font-extrabold">Foto yang diunggah</div>
        <div class="mb-5 grid grid-cols-3 gap-2.5">
          <div v-for="f in photos" :key="f.name">
            <div
              class="flex aspect-square items-center justify-center rounded-xl text-xl"
              :class="f.ok ? 'border border-[#DCE7DF]' : 'border-[1.5px] border-dashed border-[#E3B7AC]'"
              :style="
                f.ok
                  ? { background: 'repeating-linear-gradient(135deg, #E3EFE7 0 9px, #EFF6EF 9px 18px)' }
                  : { background: 'repeating-linear-gradient(135deg, #FAEEEA 0 9px, #FEF6F3 9px 18px)', color: '#C0472F' }
              "
            >
              {{ f.ok ? '🖼' : '✕' }}
            </div>
            <div class="mt-1.5 text-center text-[11.5px] font-semibold text-[#6B6350]">{{ f.name }}</div>
          </div>
        </div>

        <div class="mb-[11px] text-sm font-extrabold">Dokumen</div>
        <div class="flex flex-col gap-2.5">
          <div v-for="f in docs" :key="f.name" class="flex items-center gap-3 rounded-xl border border-border-card px-3.5 py-[11px]">
            <div class="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[9px] text-[17px]" :style="{ background: f.iconBg, color: f.iconColor }">
              {{ f.icon }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-bold">{{ f.name }}</div>
              <div class="text-xs font-semibold text-text-faint">{{ f.meta }}</div>
            </div>
            <span class="rounded-full px-[11px] py-[5px] text-[11.5px] font-bold whitespace-nowrap" :style="{ background: f.statusBg, color: f.statusColor }">
              {{ f.statusLabel }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-none justify-end border-t border-border-divider px-6 py-[15px]">
        <button type="button" class="rounded-xl bg-brand-navy px-[22px] py-2.5 font-bold text-white" @click="ui.closeModal">Tutup</button>
      </div>
    </div>
  </div>
</template>
