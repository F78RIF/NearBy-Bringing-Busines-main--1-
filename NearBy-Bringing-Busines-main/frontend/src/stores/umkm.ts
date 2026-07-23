import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { UMKM_SEED, FEATURED_IDS, DEFAULT_HIDDEN_UMKM } from '@/data/umkm'
import { CAT, CATEGORY_NAMES, REGION_CARDS } from '@/data/categories'
import type { Umkm, UmkmStatus } from '@/types'

export interface EnrichedUmkm extends Umkm {
  accent: string
  soft: string
  initial: string
}

function enrich(u: Umkm): EnrichedUmkm {
  const style = CAT[u.cat]
  return { ...u, accent: style.accent, soft: style.soft, initial: style.initial }
}

export const useUmkmStore = defineStore('umkm', () => {
  const all = ref<Umkm[]>(UMKM_SEED)
  const favorites = ref<number[]>([])

  // Directory filter state (also seeded by home-page category/region clicks)
  const cat = ref('Semua')
  const loc = ref('Semua')
  const q = ref('')

  const enrichedAll = computed(() => all.value.map(enrich))

  function byId(id: number): EnrichedUmkm | undefined {
    return enrichedAll.value.find((u) => u.id === id)
  }

  const featured = computed(() =>
    FEATURED_IDS.map((id) => enrichedAll.value.find((u) => u.id === id)).filter(
      (u): u is EnrichedUmkm => !!u,
    ),
  )

  const categoryCards = computed(() =>
    CATEGORY_NAMES.map((name) => ({
      name,
      ...CAT[name],
      count: all.value.filter((u) => u.cat === name).length,
    })),
  )

  const regionCards = computed(() =>
    REGION_CARDS.map(([full, short]) => ({
      full,
      short,
      count: all.value.filter((u) => u.loc === full).length,
    })),
  )

  const filteredDirectory = computed(() => {
    const query = q.value.trim().toLowerCase()
    return enrichedAll.value
      .filter((u) => cat.value === 'Semua' || u.cat === cat.value)
      .filter((u) => loc.value === 'Semua' || u.loc === loc.value)
      .filter((u) => {
        if (!query) return true
        return `${u.name} ${u.tag} ${u.cat}`.toLowerCase().includes(query)
      })
      .sort((a, b) => b.rating - a.rating)
  })

  const favList = computed(() =>
    enrichedAll.value.filter((u) => favorites.value.includes(u.id)),
  )
  const favCount = computed(() => favorites.value.length)

  function isFavorite(id: number) {
    return favorites.value.includes(id)
  }

  function toggleFavorite(id: number) {
    const idx = favorites.value.indexOf(id)
    if (idx === -1) favorites.value.push(id)
    else favorites.value.splice(idx, 1)
  }

  function filterByCategory(name: string) {
    cat.value = name
    loc.value = 'Semua'
    q.value = ''
  }

  function filterByLocation(full: string) {
    loc.value = full
    cat.value = 'Semua'
    q.value = ''
  }

  // Admin-side visibility/lifecycle state
  const hiddenUmkm = ref<number[]>([...DEFAULT_HIDDEN_UMKM])
  /** Keyed by UMKM name (matches the prototype, which keys open/hour status by name). */
  const umkmStatus = ref<Record<string, UmkmStatus>>({})

  function statusOf(name: string): UmkmStatus {
    return umkmStatus.value[name] ?? 'Aktif'
  }

  return {
    all,
    enrichedAll,
    byId,
    favorites,
    favList,
    favCount,
    isFavorite,
    toggleFavorite,
    cat,
    loc,
    q,
    featured,
    categoryCards,
    regionCards,
    filteredDirectory,
    filterByCategory,
    filterByLocation,
    hiddenUmkm,
    umkmStatus,
    statusOf,
  }
})
