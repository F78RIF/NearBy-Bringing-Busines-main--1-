<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function goRegisterOwner() {
  auth.regRole = 'owner'
  router.push({ name: 'register' })
}

const steps = [
  {
    n: 1,
    bg: '#16324B',
    title: 'Buat akun pemilik UMKM',
    body: 'Klik <strong>Daftar</strong> lalu pilih peran <strong>&ldquo;Pemilik UMKM&rdquo;</strong>. Isi nama, email, dan kata sandi. Akun ini dipakai untuk mengelola usahamu lewat dashboard.',
    tipBg: '#EAF1FB',
    tipColor: '#2C5EAD',
    tip: '⏱ ± 1 menit',
  },
  {
    n: 2,
    bg: '#2C5EAD',
    title: 'Lengkapi profil usaha',
    body: 'Di dashboard, buka <strong>UMKM Saya → Tambah UMKM</strong>. Isi nama usaha, kategori (Kuliner, Penginapan, Fashion, Oleh-Oleh, atau Jasa), wilayah, alamat lengkap, jam buka, nomor telepon/WhatsApp, dan deskripsi singkat.',
    tipBg: '#E3EFED',
    tipColor: '#2E7D6E',
    tip: '💡 Deskripsi yang jelas menarik lebih banyak pengunjung',
  },
  {
    n: 3,
    bg: '#3E8E82',
    title: 'Unggah foto & daftar menu / produk',
    body: 'Tambahkan minimal <strong>3 foto usaha</strong> yang terang dan jelas. Lalu isi <strong>menu atau produk beserta harga</strong> — kamu juga bisa menambahkan foto untuk tiap item lewat kotak foto di samping namanya.',
    tipBg: '#F7EDDC',
    tipColor: '#B07A1E',
    tip: '📸 Foto asli lebih dipercaya daripada gambar dari internet',
  },
  {
    n: 4,
    bg: '#C98A2E',
    title: 'Kirim untuk verifikasi admin',
    body: 'Setelah data lengkap, klik <strong>Simpan</strong> lalu kirim untuk ditinjau. Tim admin NearBy memeriksa kelengkapan berkas (foto, alamat, kontak, dokumen) biasanya dalam <strong>1×24 jam</strong>.',
    tipBg: '#EAF1FB',
    tipColor: '#2C5EAD',
    tip: '🔎 Status bisa dipantau di dashboard',
  },
]

const docs = [
  { icon: '✓', bg: '#E3EFED', color: '#2E7D6E', title: 'Minimal 3 foto usaha', sub: 'Tampak depan, area dalam, produk/menu' },
  { icon: '✓', bg: '#E3EFED', color: '#2E7D6E', title: 'Alamat & titik lokasi', sub: 'Alamat lengkap dan kecamatan' },
  {
    icon: '✓',
    bg: '#E3EFED',
    color: '#2E7D6E',
    title: 'Nomor telepon / WhatsApp aktif',
    sub: 'Untuk dihubungi calon pelanggan',
  },
  { icon: '○', bg: '#F7EDDC', color: '#B07A1E', title: 'KTP & izin usaha (opsional)', sub: 'Mempercepat verifikasi & menambah kepercayaan' },
]

const faqs = [
  {
    q: 'Apakah mendaftar dikenakan biaya?',
    a: 'Tidak. Mendaftarkan dan mengelola UMKM di NearBy Balikpapan sepenuhnya gratis.',
  },
  {
    q: 'Berapa lama proses verifikasinya?',
    a: 'Umumnya 1×24 jam kerja. Jika ada data yang kurang, admin akan mengirim permintaan perbaikan lewat dashboard.',
  },
  {
    q: 'Bisakah data diubah setelah tampil?',
    a: 'Bisa. Kamu dapat memperbarui foto, menu, harga, dan informasi kapan saja lewat menu UMKM Saya di dashboard.',
  },
]
</script>

<template>
  <main class="bg-cream">
    <section class="px-6 pt-[66px] pb-[74px]" style="background: linear-gradient(160deg, #16324b, #2c5ead)">
      <div class="mx-auto max-w-[860px] text-center">
        <div class="mb-[18px] inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-[15px] py-[7px] text-[13px] font-bold text-[#DCE9FB]">
          Panduan pemilik UMKM
        </div>
        <h1 class="m-0 text-[30px] leading-[1.12] font-extrabold tracking-[-.02em] text-white tablet:text-[42px]">
          Cara mendaftarkan<br />
          UMKM-mu di NearBy
        </h1>
        <p class="mx-auto mt-[18px] max-w-[620px] text-lg leading-relaxed text-[#C6D6EC]">
          Gratis, mudah, dan hanya butuh beberapa menit. Ikuti lima langkah di bawah ini agar usahamu cepat tampil
          dan ditemukan warga sekitaran Balikpapan.
        </p>
        <div class="mt-[26px] flex flex-wrap justify-center gap-3">
          <button type="button" class="rounded-[13px] bg-gold-bright px-7 py-[15px] text-[15.5px] font-extrabold text-brand-navy" @click="goRegisterOwner">
            Mulai daftar sekarang
          </button>
          <RouterLink
            :to="{ name: 'daftar' }"
            class="rounded-[13px] border border-white/28 bg-white/12 px-[26px] py-[15px] text-[15.5px] font-bold text-white"
          >
            Lihat contoh UMKM
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[960px] px-6 pt-14 pb-1">
      <div class="mb-[26px] text-center">
        <div class="text-[13px] font-bold tracking-[.08em] text-gold uppercase">Video panduan</div>
        <h2 class="mt-2 mb-1.5 text-[30px] font-extrabold tracking-[-.02em]">Tonton cara daftarnya</h2>
        <p class="mx-auto max-w-[520px] text-[15.5px] leading-relaxed text-text-muted">
          Video singkat langkah demi langkah, dari buat akun sampai UMKM tampil di direktori.
        </p>
      </div>
      <div
        class="relative flex aspect-video flex-col items-center justify-center gap-3.5 overflow-hidden rounded-[20px] border-2 border-dashed border-[#B9C2CE]"
        style="background: repeating-linear-gradient(135deg, #eef1f5 0 16px, #f6f8fa 16px 32px)"
      >
        <div class="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-brand-navy shadow-[0_12px_30px_rgba(19,50,77,.28)]">
          <div class="ml-1 h-0 w-0 border-y-[15px] border-l-[24px] border-y-transparent border-l-white" />
        </div>
        <div class="font-mono text-xs font-semibold tracking-[.02em] text-[#7C8896]">video panduan · 16:9 · placeholder</div>
        <div class="absolute bottom-3 left-3.5 font-mono text-[11px] font-semibold text-[#9AA5B1]">durasi ± 2 menit</div>
      </div>
    </section>

    <section class="mx-auto max-w-[960px] px-6 pt-[52px] pb-5">
      <div class="mb-[38px] text-center">
        <div class="text-[13px] font-bold tracking-[.08em] text-gold uppercase">Langkah demi langkah</div>
        <h2 class="mt-2 text-[30px] font-extrabold tracking-[-.02em]">Lima langkah pendaftaran</h2>
      </div>
      <div class="flex flex-col gap-4">
        <div
          v-for="s in steps"
          :key="s.n"
          class="flex items-start gap-5 rounded-[20px] border border-border-card bg-white p-6 px-7 shadow-[0_4px_18px_rgba(19,50,77,.04)]"
        >
          <div
            class="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[15px] text-[22px] font-extrabold text-white"
            :style="{ background: s.bg }"
          >
            {{ s.n }}
          </div>
          <div class="flex-1">
            <h3 class="m-0 mb-1.5 text-xl font-extrabold">{{ s.title }}</h3>
            <p class="m-0 text-[15.5px] leading-[1.65] text-text-secondary" v-html="s.body" />
            <div
              class="mt-3 inline-flex items-center gap-2 rounded-[10px] px-[13px] py-[7px] text-[13px] font-bold"
              :style="{ background: s.tipBg, color: s.tipColor }"
            >
              {{ s.tip }}
            </div>
          </div>
        </div>

        <div
          class="flex items-start gap-5 rounded-[20px] p-6 px-7 shadow-[0_10px_26px_rgba(19,50,77,.18)]"
          style="background: linear-gradient(120deg, #16324b, #2c5ead)"
        >
          <div class="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[15px] bg-gold-bright text-[22px] font-extrabold text-brand-navy">
            5
          </div>
          <div class="flex-1">
            <h3 class="m-0 mb-1.5 text-xl font-extrabold text-white">UMKM tampil di direktori 🎉</h3>
            <p class="m-0 text-[15.5px] leading-[1.65] text-[#D3E0F2]">
              Begitu disetujui, usahamu langsung muncul di daftar dan pencarian NearBy. Warga bisa melihat profil,
              menu, memberi rating &amp; ulasan — dan kamu bisa membalas ulasan langsung dari dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[960px] px-6 py-7">
      <div class="rounded-[20px] border border-border-card bg-white p-8">
        <h2 class="m-0 mb-1.5 text-2xl font-extrabold tracking-[-.02em]">Berkas yang perlu disiapkan</h2>
        <p class="m-0 mb-[22px] text-[15px] text-text-muted">Siapkan hal-hal ini sebelum mendaftar supaya prosesnya lancar.</p>
        <div class="grid grid-cols-1 gap-3 mobile:grid-cols-2">
          <div
            v-for="d in docs"
            :key="d.title"
            class="flex items-start gap-3 rounded-[14px] border border-[#F0EADD] bg-cream px-[17px] py-[15px]"
          >
            <span
              class="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg font-extrabold"
              :style="{ background: d.bg, color: d.color }"
            >
              {{ d.icon }}
            </span>
            <div>
              <div class="text-[15px] font-extrabold">{{ d.title }}</div>
              <div class="mt-0.5 text-[13.5px] text-text-muted">{{ d.sub }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[960px] px-6 pt-[22px] pb-5">
      <h2 class="m-0 mb-[18px] text-2xl font-extrabold tracking-[-.02em]">Pertanyaan yang sering diajukan</h2>
      <div class="flex flex-col gap-3">
        <div v-for="f in faqs" :key="f.q" class="rounded-2xl border border-border-card bg-white px-6 py-5">
          <div class="mb-1.5 text-base font-extrabold">{{ f.q }}</div>
          <p class="m-0 text-[15px] leading-relaxed text-text-secondary">{{ f.a }}</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[960px] px-6 pt-[22px] pb-[74px]">
      <div
        class="relative overflow-hidden rounded-[24px] px-10 py-11 text-center"
        style="background: linear-gradient(120deg, #3e8e82, #2c5ead)"
      >
        <h2 class="m-0 text-[28px] font-extrabold tracking-[-.02em] text-white">Siap mendaftarkan usahamu?</h2>
        <p class="mx-auto mt-3 mb-[22px] max-w-[520px] text-base leading-[1.55] text-[#E7F0EE]">
          Butuh kurang dari 10 menit. Mulai sekarang dan biarkan warga sekitaran menemukan usahamu.
        </p>
        <button type="button" class="rounded-[13px] bg-white px-8 py-4 text-base font-extrabold text-brand-navy" @click="goRegisterOwner">
          Daftarkan UMKM gratis →
        </button>
      </div>
    </section>
  </main>
</template>
