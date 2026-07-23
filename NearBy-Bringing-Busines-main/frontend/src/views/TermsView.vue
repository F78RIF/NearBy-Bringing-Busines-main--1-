<script setup lang="ts"></script>

<template>
  <main>
    <section style="background: linear-gradient(160deg, #16324b 0%, #1e4372 100%)">
      <div class="mx-auto max-w-[820px] px-6 pt-[60px] pb-[52px]">
        <div class="mb-3 text-xs font-bold tracking-[.14em] text-gold-bright uppercase">Legal</div>
        <h1 class="m-0 text-[40px] font-extrabold tracking-[-.02em] text-white">Syarat &amp; Ketentuan</h1>
        <p class="mt-3.5 text-base leading-relaxed text-[#C6D6EC]">
          Terakhir diperbarui 5 Juli 2026. Dengan menggunakan NearBy Balikpapan, kamu menyetujui ketentuan berikut.
        </p>
      </div>
    </section>
    <section class="mx-auto max-w-[820px] px-6 pt-[52px] pb-[70px]">
      <div class="flex flex-col gap-[34px]">
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">1. Tentang layanan</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            NearBy Balikpapan adalah direktori yang menampilkan rekomendasi UMKM di sekitaran Balikpapan. Kami
            menghubungkan warga dengan usaha lokal, namun tidak bertindak sebagai pihak dalam transaksi antara kamu
            dan pemilik UMKM.
          </p>
        </div>
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">2. Akun pengguna</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            Kamu bertanggung jawab menjaga kerahasiaan akunmu dan memastikan data yang kamu berikan akurat. Satu akun
            hanya boleh digunakan oleh pemiliknya.
          </p>
        </div>
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">3. Kewajiban pemilik UMKM</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            Pemilik UMKM wajib memberikan informasi usaha yang benar, termasuk foto, alamat, dan menu. UMKM yang
            diajukan akan melalui proses verifikasi admin sebelum tampil ke publik. Data yang menyesatkan dapat
            dihapus tanpa pemberitahuan.
          </p>
        </div>
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">4. Konten &amp; ulasan</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            Dilarang mengunggah konten yang melanggar hukum, mengandung ujaran kebencian, atau ulasan palsu. Kami
            berhak menghapus konten yang melanggar ketentuan ini.
          </p>
        </div>
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">5. Perubahan ketentuan</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            Kami dapat memperbarui syarat &amp; ketentuan sewaktu-waktu. Perubahan berlaku sejak dipublikasikan di
            halaman ini.
          </p>
        </div>
        <RouterLink :to="{ name: 'beranda' }" class="text-[14.5px] font-bold text-brand-blue">← Kembali ke beranda</RouterLink>
      </div>
    </section>
  </main>
</template>
