import type {
  StatCard,
  SimpleReview,
  MyUmkmRaw,
  OwnerReview,
  SubmissionRaw,
  UserRaw,
  ProblemReport,
} from '@/types'

// ---- Owner: Ringkasan ----

export const DASH_STATS: StatCard[] = [
  { icon: '👁', value: '3.482', label: 'Kunjungan profil', delta: '▲ 12% minggu ini', accent: '#2C5EAD', soft: '#E6EDF8' },
  { icon: '★', value: '4.8', label: 'Rating rata-rata', delta: '▲ 0.2 poin', accent: '#C98A2E', soft: '#F7EDDC' },
  { icon: '✎', value: '28', label: 'Ulasan baru', delta: '▲ 6 ulasan', accent: '#3E8E82', soft: '#E3EFED' },
  { icon: '♡', value: '214', label: 'Disimpan favorit', delta: '▲ 18 favorit', accent: '#1591DC', soft: '#E1F1FB' },
]

export const CHART_BARS: { label: string; pct: number }[] = [
  { label: 'Sen', pct: 48 },
  { label: 'Sel', pct: 66 },
  { label: 'Rab', pct: 54 },
  { label: 'Kam', pct: 82 },
  { label: 'Jum', pct: 96 },
  { label: 'Sab', pct: 74 },
  { label: 'Min', pct: 88 },
]

export const DASH_REVIEWS: SimpleReview[] = [
  { initial: 'R', name: 'Rani O.', stars: 5, text: 'Rasanya juara, pasti balik lagi!' },
  { initial: 'D', name: 'Dedi P.', stars: 4, text: 'Pelayanan cepat, tempat bersih.' },
  { initial: 'M', name: 'Maya S.', stars: 5, text: 'Favorit keluarga kami di Balikpapan.' },
]

/** The owner demo account's 2 owned businesses (matches seed UMKM ids 1 and 4). */
export const MY_UMKM_RAW: MyUmkmRaw[] = [
  { name: 'Warung Kepiting Kenari', cat: 'Kuliner', loc: 'Balikpapan Timur', rating: 4.8, reviews: 213, views: '2.1rb', status: 'Aktif' },
  { name: 'Amplang Bahari', cat: 'Oleh-Oleh', loc: 'Balikpapan Utara', rating: 4.9, reviews: 321, views: '1.3rb', status: 'Aktif' },
]

export const OWNER_REVIEWS: OwnerReview[] = [
  { initial: 'R', name: 'Rani Oktaviani', umkm: 'Warung Kepiting Kenari', stars: 5, date: '2 hari lalu', text: 'Kepiting sausnya juara! Pelayanan ramah, pasti balik lagi bareng keluarga.' },
  { initial: 'D', name: 'Dedi Prasetyo', umkm: 'Amplang Bahari', stars: 4, date: '5 hari lalu', text: 'Amplangnya renyah dan gurih, cocok buat oleh-oleh. Kemasan bisa lebih rapi lagi.' },
  { initial: 'M', name: 'Maya Sari', umkm: 'Warung Kepiting Kenari', stars: 5, date: '1 minggu lalu', text: 'Porsi besar, harga masuk akal. Salah satu seafood terbaik di Balikpapan.' },
  { initial: 'B', name: 'Bayu Firmansyah', umkm: 'Amplang Bahari', stars: 5, date: '2 minggu lalu', text: 'Sudah langganan lama. Rasa konsisten dari dulu, mantap!' },
]

// ---- Admin: Verifikasi ----

export const ADMIN_STATS: StatCard[] = [
  { icon: '⏳', value: '7', label: 'Menunggu verifikasi', delta: '3 baru hari ini', accent: '#C98A2E', soft: '#F7EDDC' },
  { icon: '✓', value: '12', label: 'Disetujui minggu ini', delta: '▲ 4 dari lalu', accent: '#3E8E82', soft: '#E3EFED' },
  { icon: '✕', value: '2', label: 'Ditolak', delta: 'data tak memadai', accent: '#C0472F', soft: '#F8E6E0' },
  { icon: '▦', value: '42', label: 'Total UMKM aktif', delta: 'di 6 kecamatan', accent: '#2C5EAD', soft: '#E6EDF8' },
]

export const SUBMISSIONS_RAW: SubmissionRaw[] = [
  {
    name: 'Bakso Urat Cak War',
    owner: 'Suwarno',
    cat: 'Kuliner',
    loc: 'Balikpapan Selatan',
    date: '4 Jul 2026',
    checks: [
      ['Deskripsi usaha', true],
      ['Alamat lengkap', true],
      ['Nomor telepon', true],
      ['Foto (min. 3)', false],
      ['Jam operasional', true],
      ['Kategori & wilayah', true],
    ],
    files: [
      { name: 'Tampak depan', kind: 'image', ok: true, meta: 'JPG · 1.2 MB' },
      { name: 'Menu bakso', kind: 'image', ok: true, meta: 'JPG · 980 KB' },
      { name: 'Foto tempat 3', kind: 'image', ok: false, meta: 'Belum diunggah' },
      { name: 'KTP pemilik', kind: 'doc', ok: true, meta: 'PDF · 640 KB' },
      { name: 'Surat izin usaha (SIUP)', kind: 'doc', ok: false, meta: 'Belum diunggah' },
    ],
  },
  {
    name: 'Homestay Bukit Damai',
    owner: 'Linda Wijaya',
    cat: 'Penginapan',
    loc: 'Balikpapan Kota',
    date: '3 Jul 2026',
    checks: [
      ['Deskripsi usaha', true],
      ['Alamat lengkap', true],
      ['Nomor telepon', true],
      ['Foto (min. 3)', true],
      ['Jam operasional', true],
      ['Kategori & wilayah', true],
    ],
    files: [
      { name: 'Tampak depan', kind: 'image', ok: true, meta: 'JPG · 1.6 MB' },
      { name: 'Kamar', kind: 'image', ok: true, meta: 'JPG · 1.4 MB' },
      { name: 'Ruang tamu', kind: 'image', ok: true, meta: 'JPG · 1.1 MB' },
      { name: 'KTP pemilik', kind: 'doc', ok: true, meta: 'PDF · 720 KB' },
      { name: 'Surat izin usaha (SIUP)', kind: 'doc', ok: true, meta: 'PDF · 810 KB' },
    ],
  },
  {
    name: 'Thrift Corner Senja',
    owner: 'Belum diisi',
    cat: 'Fashion',
    loc: 'Balikpapan Utara',
    date: '3 Jul 2026',
    checks: [
      ['Deskripsi usaha', false],
      ['Alamat lengkap', false],
      ['Nomor telepon', true],
      ['Foto (min. 3)', false],
      ['Jam operasional', false],
      ['Kategori & wilayah', true],
    ],
    files: [
      { name: 'Tampak depan', kind: 'image', ok: true, meta: 'JPG · 900 KB' },
      { name: 'Foto koleksi 2', kind: 'image', ok: false, meta: 'Belum diunggah' },
      { name: 'Foto koleksi 3', kind: 'image', ok: false, meta: 'Belum diunggah' },
      { name: 'KTP pemilik', kind: 'doc', ok: false, meta: 'Belum diunggah' },
    ],
  },
]

// ---- Admin: Pengguna ----

export const USERS_RAW: UserRaw[] = [
  { name: 'Rizky Pratama', email: 'rizky.p@mail.com', role: 'Pengguna', status: 'Aktif', joined: '12 Jun 2026', initial: 'R' },
  { name: 'Dewi Anjani', email: 'dewi.umkm@mail.com', role: 'Pemilik UMKM', status: 'Aktif', joined: '2 Mei 2026', initial: 'D' },
  { name: 'Suwarno', email: 'warkop.war@mail.com', role: 'Pemilik UMKM', status: 'Menunggu', joined: '4 Jul 2026', initial: 'S' },
  { name: 'Maya Sari', email: 'maya.s@mail.com', role: 'Pengguna', status: 'Aktif', joined: '20 Jun 2026', initial: 'M' },
  { name: 'Bayu Firmansyah', email: 'bayu.f@mail.com', role: 'Pengguna', status: 'Nonaktif', joined: '8 Apr 2026', initial: 'B' },
  { name: 'Admin NearBy', email: 'admin@nearby.id', role: 'Administrator', status: 'Aktif', joined: '1 Jan 2026', initial: 'A' },
]

// ---- Admin: Laporan ----

export function reportStats(umkmCount: number): StatCard[] {
  return [
    { icon: '▦', value: String(umkmCount), label: 'UMKM terdaftar', accent: '#2C5EAD', soft: '#E6EDF8' },
    { icon: '◍', value: '128', label: 'Total pengguna', accent: '#1591DC', soft: '#E1F1FB' },
    { icon: '✎', value: '1.642', label: 'Total ulasan', accent: '#3E8E82', soft: '#E3EFED' },
    { icon: '★', value: '4.7', label: 'Rata-rata rating', accent: '#C98A2E', soft: '#F7EDDC' },
  ]
}

// ---- Admin: Laporan Masalah ----

export const PROBLEM_REPORTS_RAW: ProblemReport[] = [
  {
    id: 'pr1',
    kind: 'Fungsi tidak jalan',
    text: 'Tombol "Simpan favorit" di halaman detail UMKM tidak merespons saat diklik dari HP.',
    name: 'Rizky Pratama',
    status: 'Baru',
    when: '2 jam lalu',
  },
  {
    id: 'pr2',
    kind: 'Data UMKM salah',
    text: 'Nomor telepon Warung Kepiting Kenari yang tertera sudah tidak aktif, seharusnya diganti dengan yang baru.',
    name: 'Maya Sari',
    status: 'Ditinjau',
    when: '1 hari lalu',
  },
  {
    id: 'pr3',
    kind: 'Tampilan / UI',
    text: 'Teks di kartu kategori kepotong di layar HP saya (Balikpapan Timur).',
    name: 'Bayu Firmansyah',
    status: 'Selesai',
    when: '3 hari lalu',
  },
]

export const GROWTH_BARS: { label: string; val: number }[] = [
  { label: 'Feb', val: 18 },
  { label: 'Mar', val: 24 },
  { label: 'Apr', val: 29 },
  { label: 'Mei', val: 33 },
  { label: 'Jun', val: 38 },
  { label: 'Jul', val: 42 },
]
