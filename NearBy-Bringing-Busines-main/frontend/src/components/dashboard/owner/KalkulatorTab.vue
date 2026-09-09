<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCalculatorStore } from '@/stores/calculator'
import type { IngredientInput, StorageMode } from '@/types'

const auth = useAuthStore()
const calc = useCalculatorStore()

/* ---------------- Form ---------------- */
const BLANK_ROW = (): IngredientInput => ({ name: '', qty: '', unit: 'g', price: '' })

const form = reactive({
  name: '',
  category: '',
  storage: 'suhu_ruang' as StorageMode,
  margin: 35,
  overrideServings: '' as number | string,
  ingredients: [BLANK_ROW(), BLANK_ROW(), BLANK_ROW()] as IngredientInput[],
})

const selectedRule = computed(() =>
  calc.rules?.categories.find((c) => c.name === form.category) ?? null,
)

/** Baris yang benar-benar terisi — dasar tombol Hitung boleh aktif. */
const filledIngredients = computed(() => calc.normalizeIngredients(form.ingredients))
const canCalculate = computed(() => !!form.category && filledIngredients.value.length > 0)

function addRow() {
  form.ingredients.push(BLANK_ROW())
}
function removeRow(i: number) {
  form.ingredients.splice(i, 1)
}

async function init() {
  const rules = await calc.loadRules()
  if (rules) {
    if (!form.category) form.category = rules.categories[0]?.name ?? ''
    form.margin = rules.pricing.default_margin_percent
  }
  await calc.loadRecipes()
}

onMounted(() => {
  if (auth.isApiConnected) init()
})

// Hasil lama jadi menyesatkan begitu input berubah — buang saja.
watch(
  () => [form.category, form.storage, form.margin, form.overrideServings, JSON.stringify(form.ingredients)],
  () => {
    calc.result = null
  },
)

function payload(includeName = false) {
  const servings = Number(form.overrideServings)
  return {
    ...(includeName ? { name: form.name.trim() } : {}),
    category: form.category,
    storage: form.storage,
    margin_percent: Number(form.margin),
    yield_servings: servings > 0 ? servings : null,
    ingredients: filledIngredients.value,
  }
}

async function hitung() {
  await calc.calculate(payload())
}

const saveNotice = ref('')

async function simpan() {
  saveNotice.value = ''
  if (!form.name.trim()) {
    calc.errors = ['Nama makanan wajib diisi sebelum menyimpan.']
    return
  }
  const saved = await calc.saveRecipe(payload(true))
  if (saved) saveNotice.value = `Resep "${saved.name}" tersimpan.`
}

async function hapus(id: number, name: string) {
  if (!confirm(`Hapus resep "${name}"?`)) return
  await calc.deleteRecipe(id)
}

/* ---------------- Format ---------------- */
const rupiah = (n: number) => 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(n))
const gram = (n: number) => new Intl.NumberFormat('id-ID').format(n) + ' g'
</script>

<template>
  <div class="mb-[22px]">
    <h1 class="m-0 text-[29px] font-extrabold tracking-[-.02em]">Kalkulator Harga &amp; Masa Tahan</h1>
    <p class="mt-1.5 text-text-muted">
      Hitung HPP, estimasi porsi, rekomendasi harga jual, dan perkiraan masa tahan produkmu.
    </p>
  </div>

  <!-- Butuh sesi API aktif: fitur ini membaca/menulis ke database -->
  <div v-if="!auth.isApiConnected" class="rounded-[18px] border border-border-card bg-white p-[22px] shadow-[0_4px_16px_rgba(19,50,77,.04)]">
    <div class="text-[17px] font-extrabold">Sesi kamu sudah berakhir</div>
    <p class="mt-1.5 text-[13.5px] leading-relaxed text-text-muted">
      Fitur ini menyimpan data ke database. Silakan
      <RouterLink :to="{ name: 'login' }" class="font-extrabold text-brand-blue">masuk kembali</RouterLink>
      dengan akunmu. Pastikan backend berjalan
      (<code class="rounded bg-[#F4F0E7] px-1.5 py-0.5 text-[12px]">php artisan serve</code>).
    </p>
  </div>

  <template v-else>
    <!-- Error dari API -->
    <div v-if="calc.errors.length" role="alert" aria-live="assertive" class="mb-[18px] rounded-xl border border-danger-border bg-danger-tint px-3.5 py-3">
      <div class="mb-1.5 flex items-center gap-2 text-[13px] font-extrabold text-danger-deep">
        <span aria-hidden="true">⚠️</span>
        {{ calc.errors.length === 1 ? 'Tidak bisa diproses' : `Tidak bisa diproses — ${calc.errors.length} masalah` }}
      </div>
      <ul class="list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-danger-deep">
        <li v-for="e in calc.errors" :key="e">{{ e }}</li>
      </ul>
    </div>

    <div v-if="saveNotice" class="mb-[18px] rounded-xl border border-[#BFE0D8] bg-teal-tint px-3.5 py-3 text-[12.5px] font-bold text-teal-deep">
      ✓ {{ saveNotice }}
    </div>

    <div class="grid grid-cols-1 gap-5 tablet:grid-cols-[1.35fr_1fr]">
      <!-- ============ FORM ============ -->
      <div class="rounded-[18px] border border-border-card bg-white p-[22px] shadow-[0_4px_16px_rgba(19,50,77,.04)]">
        <label class="mb-1.5 block text-[13px] font-bold">Nama makanan</label>
        <input v-model="form.name" placeholder="mis. Nasi Kuning Komplit" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />

        <div class="grid grid-cols-1 gap-3 mobile:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-[13px] font-bold">Kategori makanan</label>
            <select v-model="form.category" class="mb-1 w-full rounded-xl border border-border-input bg-white px-3 py-2.5 font-semibold text-brand-navy">
              <option v-for="c in calc.rules?.categories ?? []" :key="c.name" :value="c.name">{{ c.name }}</option>
            </select>
            <div v-if="selectedRule" class="mb-3 text-[11.5px] font-semibold text-text-faint">
              Standar porsi: {{ gram(selectedRule.serving_grams) }}
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-[13px] font-bold">Cara penyimpanan</label>
            <select v-model="form.storage" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3 py-2.5 font-semibold text-brand-navy">
              <option v-for="s in calc.rules?.storages ?? []" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 mobile:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-[13px] font-bold">
              Margin keuntungan
              <span class="font-semibold text-text-faint">· {{ form.margin }}%</span>
            </label>
            <input v-model.number="form.margin" type="range" min="0" :max="calc.rules?.pricing.max_margin_percent ?? 90" step="5" class="mb-3.5 w-full accent-[#2C5EAD]" />
          </div>
          <div>
            <label class="mb-1.5 block text-[13px] font-bold">
              Jumlah porsi
              <span class="font-semibold text-text-faint">· kosongkan = otomatis</span>
            </label>
            <input v-model="form.overrideServings" type="number" min="1" placeholder="otomatis dari berat bahan" class="mb-3.5 w-full rounded-xl border border-border-input bg-white px-3.5 py-2.5" />
          </div>
        </div>

        <!-- Bahan -->
        <div class="mb-2.5 flex items-center justify-between">
          <label class="text-[13px] font-bold">
            Bahan
            <span class="font-semibold text-text-faint">· harga = total untuk jumlah tersebut</span>
          </label>
          <button type="button" class="rounded-[9px] bg-brand-blue-tint px-[13px] py-1.5 text-[12.5px] font-bold text-brand-blue" @click="addRow">
            + Tambah
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <div v-for="(row, i) in form.ingredients" :key="i" class="flex items-center gap-2">
            <input v-model="row.name" placeholder="Nama bahan" class="min-w-0 flex-1 rounded-[10px] border border-border-input bg-white px-3 py-2.5 text-[13.5px]" />
            <input v-model="row.qty" type="number" min="0" step="0.01" placeholder="Jml" class="w-[74px] flex-none rounded-[10px] border border-border-input bg-white px-2.5 py-2.5 text-[13.5px]" />
            <select v-model="row.unit" class="w-[84px] flex-none rounded-[10px] border border-border-input bg-white px-2 py-2.5 text-[13px] font-semibold text-brand-navy">
              <option v-for="u in calc.rules?.units ?? []" :key="u" :value="u">{{ u }}</option>
            </select>
            <input v-model="row.price" type="number" min="0" placeholder="Harga" class="w-[100px] flex-none rounded-[10px] border border-border-input bg-white px-3 py-2.5 text-[13.5px]" />
            <button type="button" title="Hapus bahan" class="flex-none rounded-[9px] border border-danger-border px-2.5 py-2.5 font-bold text-danger" @click="removeRow(i)">✕</button>
          </div>
        </div>

        <div class="mt-2 text-[11.5px] leading-relaxed text-text-faint">
          Satuan {{ (calc.rules?.countable_units ?? []).join(', ') }} tetap dihitung di HPP, tapi tidak menambah berat
          total — jadi estimasi porsinya lebih kasar.
        </div>

        <div class="mt-4 flex flex-wrap gap-2.5 border-t border-border-divider-2 pt-4">
          <button type="button" class="rounded-xl bg-brand-blue px-[22px] py-2.5 font-extrabold text-white disabled:opacity-50" :disabled="!canCalculate || calc.loading" @click="hitung">
            {{ calc.loading ? 'Menghitung…' : 'Hitung' }}
          </button>
          <button type="button" class="rounded-xl border border-border-input px-5 py-2.5 font-bold text-brand-navy disabled:opacity-50" :disabled="!canCalculate || calc.saving" @click="simpan">
            {{ calc.saving ? 'Menyimpan…' : 'Simpan resep' }}
          </button>
        </div>
      </div>

      <!-- ============ HASIL ============ -->
      <div>
        <div v-if="!calc.result" class="rounded-[18px] border border-dashed border-border-input bg-[#FBF8F2] p-[22px] text-center">
          <div class="text-[15px] font-extrabold text-brand-navy">Belum ada hasil</div>
          <p class="mt-1.5 text-[13px] leading-relaxed text-text-faint">
            Isi kategori dan minimal satu bahan, lalu tekan <b>Hitung</b>.
          </p>
        </div>

        <template v-else>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-border-card bg-white p-[18px]">
              <div class="text-[12px] font-semibold text-text-faint">Total HPP</div>
              <div class="mt-1 text-[22px] font-extrabold tracking-[-.02em]">{{ rupiah(calc.result.total_cost) }}</div>
            </div>
            <div class="rounded-2xl border border-border-card bg-white p-[18px]">
              <div class="text-[12px] font-semibold text-text-faint">Estimasi porsi</div>
              <div class="mt-1 text-[22px] font-extrabold tracking-[-.02em]">{{ calc.result.yield_servings }}</div>
              <div class="text-[11px] font-semibold text-text-faint">
                {{ calc.result.servings_overridden ? 'diisi manual' : gram(calc.result.total_weight_grams) + ' total' }}
              </div>
            </div>
            <div class="rounded-2xl border border-border-card bg-white p-[18px]">
              <div class="text-[12px] font-semibold text-text-faint">HPP per porsi</div>
              <div class="mt-1 text-[22px] font-extrabold tracking-[-.02em]">{{ rupiah(calc.result.cost_per_serving) }}</div>
            </div>
            <div class="rounded-2xl border-2 border-[#BFE0D8] bg-teal-tint p-[18px]">
              <div class="text-[12px] font-semibold text-teal-deep">Harga jual disarankan</div>
              <div class="mt-1 text-[22px] font-extrabold tracking-[-.02em] text-teal-deep">{{ rupiah(calc.result.suggested_price) }}</div>
              <div class="text-[11px] font-semibold text-teal-deep">
                laba {{ rupiah(calc.result.profit_per_serving) }}/porsi
              </div>
            </div>
          </div>

          <!-- Margin riil setelah pembulatan -->
          <div
            v-if="Math.abs(calc.result.effective_margin_percent - calc.result.margin_percent) >= 1"
            class="mt-3 rounded-xl border border-[#EBD9B4] bg-[#FBF3E4] px-3.5 py-3 text-[12.5px] leading-relaxed text-[#7A5B1E]"
          >
            Setelah dibulatkan ke Rp500, margin sesungguhnya jadi
            <b>{{ calc.result.effective_margin_percent }}%</b> (bukan {{ calc.result.margin_percent }}%).
          </div>

          <!-- Masa tahan -->
          <div class="mt-3 rounded-[18px] border border-border-card bg-white p-[22px]">
            <div class="text-[13px] font-extrabold text-brand-navy">Estimasi masa tahan</div>
            <div v-if="calc.result.shelf_life_label" class="mt-1 text-[26px] font-extrabold tracking-[-.02em] text-gold">
              {{ calc.result.shelf_life_label }}
            </div>
            <div v-else class="mt-1 text-[15px] font-extrabold text-danger">Tidak dianjurkan</div>
            <p v-if="calc.result.shelf_life_note" class="mt-2 text-[12.5px] leading-relaxed text-text-muted">
              {{ calc.result.shelf_life_note }}
            </p>
            <p class="mt-2.5 border-t border-border-divider-2 pt-2.5 text-[11.5px] leading-relaxed text-text-faint">
              Angka ini estimasi umum untuk produk tanpa pengawet, dihitung dari tabel acuan per kategori —
              bukan hasil uji laboratorium. Untuk klaim pada label kemasan, pakai acuan resmi BPOM.
            </p>
          </div>

          <div v-if="calc.result.warnings.length" class="mt-3 rounded-xl border border-[#EBD9B4] bg-[#FBF3E4] px-3.5 py-3">
            <ul class="list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-[#7A5B1E]">
              <li v-for="w in calc.result.warnings" :key="w">{{ w }}</li>
            </ul>
          </div>
        </template>
      </div>
    </div>

    <!-- ============ RESEP TERSIMPAN ============ -->
    <div class="mt-[26px]">
      <div class="mb-3.5 text-lg font-extrabold">Resep tersimpan</div>

      <div v-if="!calc.recipes.length" class="rounded-[18px] border border-dashed border-border-input bg-[#FBF8F2] p-6 text-center text-[13px] text-text-faint">
        Belum ada resep tersimpan.
      </div>

      <div v-else class="flex flex-col gap-3">
        <div v-for="r in calc.recipes" :key="r.id" class="rounded-[18px] border border-border-card bg-white p-5 shadow-[0_4px_16px_rgba(19,50,77,.04)]">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-[17px] font-extrabold">{{ r.name }}</div>
              <div class="mt-1 text-[13px] font-semibold text-text-faint">
                {{ r.category }} · {{ r.ingredients.length }} bahan · {{ r.yieldServings }} porsi
              </div>
            </div>
            <button type="button" class="rounded-[11px] border border-danger-border px-[18px] py-2 font-bold text-danger" @click="hapus(r.id, r.name)">
              Hapus
            </button>
          </div>
          <div class="mt-3.5 flex flex-wrap gap-6 border-t border-border-divider-2 pt-3.5">
            <div>
              <div class="text-[15px] font-extrabold">{{ rupiah(r.totalCost) }}</div>
              <div class="text-[11.5px] font-semibold text-text-faint">total HPP</div>
            </div>
            <div>
              <div class="text-[15px] font-extrabold">{{ rupiah(r.costPerServing) }}</div>
              <div class="text-[11.5px] font-semibold text-text-faint">HPP/porsi</div>
            </div>
            <div>
              <div class="text-[15px] font-extrabold text-teal-deep">{{ rupiah(r.suggestedPrice) }}</div>
              <div class="text-[11.5px] font-semibold text-text-faint">harga jual ({{ r.marginPercent }}%)</div>
            </div>
            <div>
              <div class="text-[15px] font-extrabold text-gold">
                {{ r.shelfLifeHours === null ? '—' : r.shelfLifeHours < 24 ? r.shelfLifeHours + ' jam' : Math.round(r.shelfLifeHours / 24) + ' hari' }}
              </div>
              <div class="text-[11.5px] font-semibold text-text-faint">masa tahan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
