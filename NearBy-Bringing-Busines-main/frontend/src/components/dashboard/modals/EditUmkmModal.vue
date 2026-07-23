<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { CATEGORY_NAMES, LOCATION_NAMES } from '@/data/categories'
import BaseModal from '@/components/shared/BaseModal.vue'

const ui = useUiStore()

const isNew = computed(() => !!ui.modalItem?.isNew)
const title = computed(() => (isNew.value ? 'Tambah UMKM' : 'Edit UMKM'))

interface DraftPhoto {
  name: string
  img: string
}
interface DraftMenuItem {
  name: string
  price: string
  img: string
  avail: boolean
}

const BLANK_PHOTOS = (): DraftPhoto[] => [
  { name: 'Tampak depan', img: '' },
  { name: 'Menu / produk', img: '' },
  { name: 'Suasana tempat', img: '' },
]

const draft = reactive({
  name: '',
  cat: CATEGORY_NAMES[0] as string,
  loc: LOCATION_NAMES[0] as string,
  wa: '',
  ig: '',
  address: '',
  hours: '',
  desc: '',
  photos: BLANK_PHOTOS(),
  menu: [{ name: '', price: '', img: '', avail: true }] as DraftMenuItem[],
})

watch(
  () => ui.modalItem,
  (item) => {
    if (item && !item.isNew) {
      draft.name = item.name ?? ''
      draft.cat = item.cat ?? CATEGORY_NAMES[0]
      draft.loc = item.loc ?? LOCATION_NAMES[0]
      draft.wa = item.wa || item.phone || ''
      draft.ig = item.ig || ''
      draft.address = item.address || ''
      draft.hours = item.hours || ''
      draft.desc = item.tag || ''
      draft.photos = BLANK_PHOTOS()
      draft.menu = (item.items ?? []).map((it: { name: string; price: string; img?: string; avail?: boolean }) => ({
        name: it.name,
        price: it.price,
        img: it.img || '',
        avail: it.avail !== false,
      }))
    } else {
      draft.name = ''
      draft.cat = CATEGORY_NAMES[0]
      draft.loc = LOCATION_NAMES[0]
      draft.wa = ''
      draft.ig = ''
      draft.address = ''
      draft.hours = ''
      draft.desc = ''
      draft.photos = BLANK_PHOTOS()
      draft.menu = [{ name: '', price: '', img: '', avail: true }]
    }
  },
  { immediate: true },
)

const photoCount = computed(() => draft.photos.filter((p) => p.img).length)
const photoCountLabel = computed(() => `${photoCount.value}/3 foto${photoCount.value >= 3 ? ' ✓' : ''}`)
const photoCountColor = computed(() => (photoCount.value >= 3 ? '#2E7D6E' : '#B07A1E'))
const photoCountBg = computed(() => (photoCount.value >= 3 ? '#E3EFED' : '#F7EDDC'))

function readAsDataUrl(file: File, cb: (url: string) => void) {
  const reader = new FileReader()
  reader.onload = () => cb(reader.result as string)
  reader.readAsDataURL(file)
}

function onPhotoFile(i: number, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  readAsDataUrl(file, (url) => {
    draft.photos[i].img = url
  })
}
function clearPhoto(i: number) {
  draft.photos[i].img = ''
}

function addMenuRow() {
  draft.menu.push({ name: '', price: '', img: '', avail: true })
}
function removeMenuRow(i: number) {
  draft.menu.splice(i, 1)
}
function onMenuFile(i: number, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  readAsDataUrl(file, (url) => {
    draft.menu[i].img = url
  })
}
function toggleMenuAvail(i: number) {
  draft.menu[i].avail = !draft.menu[i].avail
}

function saveUmkm() {
  if (photoCount.value < 3) {
    alert(`Unggah tepat 3 foto UMKM. Saat ini baru ${photoCount.value} foto.`)
    return
  }
  ui.closeModal()
  alert(
    isNew.value
      ? 'UMKM berhasil dikirim. Menunggu verifikasi admin — akan tampil & aktif setelah disetujui.'
      : 'Perubahan disimpan. Perubahan penting akan ditinjau ulang admin sebelum aktif kembali.',
  )
}
</script>

<template>
  <BaseModal max-width="max-w-[680px]" @close="ui.closeModal">
    <div class="flex max-h-[90vh] flex-col">
      <div class="flex flex-none items-center justify-between border-b border-border-divider px-[26px] py-[19px]">
        <div class="text-[19px] font-extrabold">{{ title }}</div>
        <button type="button" class="text-2xl leading-none text-text-faint" @click="ui.closeModal">×</button>
      </div>

      <div class="overflow-y-auto px-[26px] py-6">
        <div class="mb-[18px] flex items-start gap-[11px] rounded-xl border border-[#EBD9B4] bg-[#FBF3E4] px-3.5 py-3">
          <span class="text-[17px]">🛡️</span>
          <div class="text-[12.5px] leading-relaxed text-[#7A5B1E]">
            UMKM baru <b class="text-[#8A5A12]">menunggu verifikasi admin</b> sebelum tampil ke publik. Lengkapi 3
            foto agar cepat disetujui dan aktif.
          </div>
        </div>

        <div class="mb-2 flex items-center justify-between">
          <label class="text-[13px] font-bold">Foto UMKM <span class="font-semibold text-text-faint">· wajib 3 foto, beri nama tiap foto</span></label>
          <span class="rounded-full px-[11px] py-1 text-[12.5px] font-extrabold whitespace-nowrap" :style="{ color: photoCountColor, background: photoCountBg }">
            {{ photoCountLabel }}
          </span>
        </div>
        <div class="mb-4 grid grid-cols-1 gap-3 mobile:grid-cols-3">
          <div v-for="(p, i) in draft.photos" :key="i" class="rounded-[13px] border border-border-card bg-[#FBF8F2] p-2">
            <label title="Unggah foto" class="relative block cursor-pointer">
              <img v-if="p.img" :src="p.img" class="block h-[92px] w-full rounded-[10px] border border-border-input object-cover" />
              <div
                v-else
                class="flex h-[92px] w-full flex-col items-center justify-center gap-0.5 rounded-[10px] border-[1.5px] border-dashed border-[#D6CFC0] text-[#B0A48B]"
                style="background: repeating-linear-gradient(135deg, #f4efe6 0 8px, #fbf8f1 8px 16px)"
              >
                <span class="text-xl">⬆</span>
                <span class="text-[10.5px] font-bold">Unggah</span>
              </div>
              <span v-if="p.img" class="absolute top-1.5 right-1.5 rounded-lg bg-[rgba(15,30,45,.72)] px-2 py-0.5 text-[11px] font-bold text-white">
                Ganti
              </span>
              <input type="file" accept="image/*" class="hidden" @change="onPhotoFile(i, $event)" />
            </label>
            <input v-model="p.name" placeholder="Nama foto" class="mt-2 w-full rounded-[9px] border border-border-input bg-white px-2.5 py-2 text-[12.5px]" />
            <button v-if="p.img" type="button" class="w-full py-1.5 text-[11.5px] font-bold text-danger" @click="clearPhoto(i)">Hapus foto</button>
          </div>
        </div>

        <label class="mb-1.5 block text-[13px] font-bold">Nama UMKM</label>
        <input v-model="draft.name" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />

        <div class="grid grid-cols-1 gap-3 mobile:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-[13px] font-bold">Kategori</label>
            <select v-model="draft.cat" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3 py-2.5 font-semibold text-brand-navy">
              <option v-for="c in CATEGORY_NAMES" :key="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-[13px] font-bold">Wilayah</label>
            <select v-model="draft.loc" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3 py-2.5 font-semibold text-brand-navy">
              <option v-for="l in LOCATION_NAMES" :key="l">{{ l }}</option>
            </select>
          </div>
        </div>

        <label class="mb-1.5 block text-[13px] font-bold">Nomor WhatsApp</label>
        <input v-model="draft.wa" placeholder="0812-xxxx-xxxx" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />
        <label class="mb-1.5 block text-[13px] font-bold">Media sosial</label>
        <input v-model="draft.ig" placeholder="@namausaha" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />
        <label class="mb-1.5 block text-[13px] font-bold">Alamat lengkap</label>
        <textarea
          v-model="draft.address"
          placeholder="Jl. ... No. ..., kecamatan, Balikpapan"
          class="mb-3.5 min-h-[56px] w-full resize-y rounded-xl border border-border-input bg-white px-3.5 py-2.5"
        />
        <label class="mb-1.5 block text-[13px] font-bold">Jam buka</label>
        <input v-model="draft.hours" placeholder="08.00 – 22.00 WITA" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />
        <label class="mb-1.5 block text-[13px] font-bold">Deskripsi</label>
        <textarea v-model="draft.desc" class="mb-4 min-h-20 w-full resize-y rounded-xl border border-border-input bg-white px-3.5 py-2.5" />

        <div class="mb-2.5 flex items-center justify-between">
          <label class="text-[13px] font-bold">Menu / produk &amp; harga <span class="font-semibold text-text-faint">· klik kotak foto untuk tambah gambar</span></label>
          <button type="button" class="rounded-[9px] bg-brand-blue-tint px-[13px] py-1.5 text-[12.5px] font-bold text-brand-blue" @click="addMenuRow">
            + Tambah
          </button>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="(m, i) in draft.menu" :key="i" class="flex items-center gap-2">
            <label title="Unggah foto menu" class="block h-11 w-11 flex-none cursor-pointer">
              <img v-if="m.img" :src="m.img" class="block h-11 w-11 rounded-[10px] border border-border-input object-cover" />
              <div
                v-else
                class="flex h-11 w-11 items-center justify-center rounded-[10px] border-[1.5px] border-dashed border-[#D6CFC0] text-lg text-[#B0A48B]"
                style="background: repeating-linear-gradient(135deg, #f4efe6 0 7px, #fbf8f1 7px 14px)"
              >
                ＋
              </div>
              <input type="file" accept="image/*" class="hidden" @change="onMenuFile(i, $event)" />
            </label>
            <input v-model="m.name" placeholder="Nama menu / produk" class="min-w-0 flex-1 rounded-[10px] border border-border-input bg-white px-3 py-2.5" />
            <input v-model="m.price" placeholder="Harga" class="w-24 flex-none rounded-[10px] border border-border-input bg-white px-3 py-2.5" />
            <button
              type="button"
              class="flex-none rounded-[9px] px-3 py-2.5 text-xs font-bold whitespace-nowrap"
              :style="m.avail ? { background: '#E3EFED', color: '#2E7D6E' } : { background: '#F6E4DF', color: '#C0472F' }"
              @click="toggleMenuAvail(i)"
            >
              {{ m.avail ? 'Tersedia' : 'Habis' }}
            </button>
            <button type="button" class="flex-none rounded-[9px] border border-danger-border px-2.5 py-2.5 font-bold text-danger" @click="removeMenuRow(i)">
              ✕
            </button>
          </div>
        </div>
        <div v-if="draft.menu.length === 0" class="pt-1.5 text-[12.5px] text-text-faint">
          Belum ada menu. Klik "+ Tambah" untuk menambahkan item.
        </div>
      </div>

      <div class="flex flex-none justify-end gap-2.5 border-t border-border-divider px-6 py-[15px]">
        <button type="button" class="rounded-xl border border-border-input px-5 py-2.5 font-bold text-brand-navy" @click="ui.closeModal">Batal</button>
        <button type="button" class="rounded-xl bg-brand-blue px-[22px] py-2.5 font-extrabold text-white" @click="saveUmkm">Simpan</button>
      </div>
    </div>
  </BaseModal>
</template>
