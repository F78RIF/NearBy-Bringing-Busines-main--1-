import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { authorKey, seedReviewsFor } from '@/data/reviews'
import type { Review } from '@/types'

export const useReviewsStore = defineStore('reviews', () => {
  const byUmkm = reactive(new Map<number, Review[]>())

  function reviewsFor(umkmId: number): Review[] {
    if (!byUmkm.has(umkmId)) {
      byUmkm.set(umkmId, seedReviewsFor(umkmId))
    }
    return byUmkm.get(umkmId)!
  }

  /** Ulasan milik satu penulis untuk satu UMKM — maksimal satu, atau tidak ada. */
  function myReviewFor(umkmId: number, name: string | undefined | null): Review | undefined {
    if (!name) return undefined
    const key = authorKey(name)
    return reviewsFor(umkmId).find((r) => r.userKey === key)
  }

  /**
   * Kirim ulasan — pola Play Store: satu akun hanya punya satu ulasan per UMKM.
   *
   * Kalau penulis sudah pernah mengulas UMKM ini, ulasan itu yang diperbarui
   * (rating, teks, tanggal jadi "Baru saja") lalu dinaikkan ke urutan teratas.
   * Baris baru hanya dibuat kalau memang belum pernah mengulas — inilah
   * perbaikan duplikasi, padanan `ReviewController::store()` di backend.
   */
  function upsertReview(umkmId: number, review: Omit<Review, 'id' | 'umkmId' | 'userKey'>): Review {
    const list = reviewsFor(umkmId)
    const key = authorKey(review.name)
    const idx = list.findIndex((r) => r.userKey === key)

    if (idx !== -1) {
      const existing = list[idx]
      existing.stars = review.stars
      existing.text = review.text
      existing.date = review.date
      existing.initial = review.initial
      // Naikkan ke atas supaya perubahan langsung terlihat — sama seperti
      // backend yang mengurutkan ulasan berdasarkan updated_at terbaru.
      list.splice(idx, 1)
      list.unshift(existing)
      return existing
    }

    const created: Review = { ...review, id: `${umkmId}-${Date.now()}`, umkmId, userKey: key }
    list.unshift(created)
    return created
  }

  function updateReview(umkmId: number, reviewId: string, changes: { stars: number; text: string }) {
    const rv = reviewsFor(umkmId).find((r) => r.id === reviewId)
    if (rv) {
      rv.stars = changes.stars
      rv.text = changes.text
    }
  }

  function deleteReview(umkmId: number, reviewId: string) {
    const list = reviewsFor(umkmId)
    const idx = list.findIndex((r) => r.id === reviewId)
    if (idx !== -1) list.splice(idx, 1)
  }

  return { reviewsFor, myReviewFor, upsertReview, updateReview, deleteReview }
})
