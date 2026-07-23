import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { seedReviewsFor } from '@/data/reviews'
import type { Review } from '@/types'

export const useReviewsStore = defineStore('reviews', () => {
  const byUmkm = reactive(new Map<number, Review[]>())

  function reviewsFor(umkmId: number): Review[] {
    if (!byUmkm.has(umkmId)) {
      byUmkm.set(umkmId, seedReviewsFor(umkmId))
    }
    return byUmkm.get(umkmId)!
  }

  function addReview(umkmId: number, review: Omit<Review, 'id' | 'umkmId'>) {
    const list = reviewsFor(umkmId)
    list.unshift({ ...review, id: `${umkmId}-${Date.now()}`, umkmId })
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

  return { reviewsFor, addReview, updateReview, deleteReview }
})
