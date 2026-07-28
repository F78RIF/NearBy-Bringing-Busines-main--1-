import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiError, http } from '@/services/http'
import type { FoodRules, HppResult, IngredientInput, Recipe, StorageMode } from '@/types'

/** Payload yang dikirim ke /hpp/calculate dan /recipes. */
interface CalcPayload {
  name?: string
  category: string
  storage: StorageMode
  margin_percent: number
  yield_servings?: number | null
  ingredients: { name: string; qty: number; unit: string; price: number }[]
}

export const useCalculatorStore = defineStore('calculator', () => {
  const rules = ref<FoodRules | null>(null)
  const result = ref<HppResult | null>(null)
  const recipes = ref<Recipe[]>([])

  const loading = ref(false)
  const saving = ref(false)
  /** Pesan error siap-tampil. Kosong = tidak ada masalah. */
  const errors = ref<string[]>([])

  function clearErrors() {
    errors.value = []
  }

  /**
   * Bungkus setiap panggilan API. Kegagalan tidak pernah dibiarkan senyap —
   * selalu berakhir jadi pesan di `errors` yang ditampilkan UI.
   */
  async function guard<T>(fn: () => Promise<T>): Promise<T | null> {
    clearErrors()
    try {
      return await fn()
    } catch (e) {
      errors.value = e instanceof ApiError ? e.messages : ['Terjadi kesalahan tak terduga.']
      return null
    }
  }

  /** Ambil kategori/satuan/aturan masa tahan untuk mengisi form. */
  async function loadRules() {
    if (rules.value) return rules.value

    loading.value = true
    const data = await guard(() => http.get<FoodRules>('/food-rules'))
    loading.value = false

    if (data) rules.value = data
    return data
  }

  /** Buang baris bahan yang belum diisi, lalu ubah ke angka. */
  function normalizeIngredients(rows: IngredientInput[]) {
    return rows
      .filter((r) => String(r.name).trim() !== '' && Number(r.qty) > 0)
      .map((r) => ({
        name: String(r.name).trim(),
        qty: Number(r.qty),
        unit: r.unit,
        price: Number(r.price) || 0,
      }))
  }

  async function calculate(payload: CalcPayload) {
    loading.value = true
    const data = await guard(() => http.post<HppResult>('/hpp/calculate', payload))
    loading.value = false

    result.value = data
    return data
  }

  async function loadRecipes() {
    const data = await guard(() => http.get<{ data: Recipe[] }>('/recipes'))
    if (data) recipes.value = data.data
    return data
  }

  async function saveRecipe(payload: CalcPayload) {
    saving.value = true
    const data = await guard(() => http.post<{ data: Recipe }>('/recipes', payload))
    saving.value = false

    if (data) recipes.value = [data.data, ...recipes.value]
    return data?.data ?? null
  }

  async function deleteRecipe(id: number) {
    const ok = await guard(() => http.delete<{ message: string }>(`/recipes/${id}`))
    if (ok) recipes.value = recipes.value.filter((r) => r.id !== id)
    return ok
  }

  return {
    rules,
    result,
    recipes,
    loading,
    saving,
    errors,
    clearErrors,
    loadRules,
    normalizeIngredients,
    calculate,
    loadRecipes,
    saveRecipe,
    deleteRecipe,
  }
})
