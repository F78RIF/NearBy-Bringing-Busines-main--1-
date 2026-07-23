import type { Review } from '@/types'

/**
 * The prototype's `reviewsFor()` returns this same static 3-item list for
 * every UMKM. We seed each business with its own copy (keyed by umkmId) so a
 * submitted review can be appended to just that business — same visual
 * result, slightly more correct data model.
 */
const BASE_REVIEWS: Omit<Review, 'id' | 'umkmId'>[] = [
  {
    initial: 'R',
    name: 'Rani Oktaviani',
    stars: 5,
    date: '2 hari lalu',
    text: 'Pelayanannya ramah banget, rasanya juara! Sudah beberapa kali balik ke sini dan nggak pernah kecewa.',
  },
  {
    initial: 'B',
    name: 'Bayu Firmansyah',
    stars: 4,
    date: '1 minggu lalu',
    text: 'Tempatnya nyaman dan bersih. Harga sesuai kualitas, recommended buat warga sekitaran.',
  },
  {
    initial: 'S',
    name: 'Siti Marlina',
    stars: 5,
    date: '2 minggu lalu',
    text: 'Salah satu yang terbaik di Balikpapan. Gampang ditemukan lewat NearBy, terima kasih!',
  },
]

export function seedReviewsFor(umkmId: number): Review[] {
  return BASE_REVIEWS.map((r, i) => ({ ...r, id: `${umkmId}-${i}`, umkmId }))
}

export function starsLabel(stars: number): string {
  const full = Math.round(stars)
  return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full)
}
