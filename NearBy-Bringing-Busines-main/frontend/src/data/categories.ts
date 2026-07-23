import type { CategoryName, CategoryStyle, LocationName } from '@/types'
import iconKuliner from '@/assets/Kuliner.png'
import iconPenginapan from '@/assets/Penginapan.png'
import iconFashion from '@/assets/Fashion.png'
import iconOlehOleh from '@/assets/Oleh.png'
import iconJasa from '@/assets/Jasa.png'

export const CAT: Record<CategoryName, CategoryStyle> = {
  Kuliner: { accent: '#C98A2E', soft: '#F7EDDC', initial: 'K', icon: iconKuliner },
  Penginapan: { accent: '#3E8E82', soft: '#E3EFED', initial: 'P', icon: iconPenginapan },
  Fashion: { accent: '#2C5EAD', soft: '#E6EDF8', initial: 'F', icon: iconFashion },
  'Oleh-Oleh': { accent: '#1591DC', soft: '#E1F1FB', initial: 'O', icon: iconOlehOleh },
  Jasa: { accent: '#5B6672', soft: '#EEF0F2', initial: 'J', icon: iconJasa },
}

export const CATEGORY_NAMES: CategoryName[] = [
  'Kuliner',
  'Penginapan',
  'Fashion',
  'Oleh-Oleh',
  'Jasa',
]

/** Filter chip order used on the Daftar UMKM page (includes "Semua"). */
export const CATEGORY_FILTERS: string[] = ['Semua', ...CATEGORY_NAMES]

/** Canonical kecamatan order used in filters, register/edit-UMKM selects. */
export const LOCATION_NAMES: LocationName[] = [
  'Balikpapan Kota',
  'Balikpapan Utara',
  'Balikpapan Selatan',
  'Balikpapan Timur',
  'Balikpapan Barat',
  'Balikpapan Tengah',
]

export const LOCATION_FILTERS: string[] = ['Semua', ...LOCATION_NAMES]

/** Homepage "Jelajahi per wilayah" cards: [full name, short label]. */
export const REGION_CARDS: [LocationName, string][] = [
  ['Balikpapan Kota', 'Kota'],
  ['Balikpapan Utara', 'Utara'],
  ['Balikpapan Selatan', 'Selatan'],
  ['Balikpapan Timur', 'Timur'],
  ['Balikpapan Barat', 'Barat'],
  ['Balikpapan Tengah', 'Tengah'],
]
