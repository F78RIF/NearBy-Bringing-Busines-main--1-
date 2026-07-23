<script setup lang="ts"></script>

<template>
  <main>
    <section style="background: linear-gradient(160deg, #16324b 0%, #1e4372 100%)">
      <div class="mx-auto max-w-[820px] px-6 pt-[60px] pb-[52px]">
        <div class="mb-3 text-xs font-bold tracking-[.14em] text-gold-bright uppercase">Legal</div>
        <h1 class="m-0 text-[40px] font-extrabold tracking-[-.02em] text-white">Kebijakan Privasi</h1>
        <p class="mt-3.5 text-base leading-relaxed text-[#C6D6EC]">
          Terakhir diperbarui 5 Juli 2026. Kebijakan ini menjelaskan bagaimana NearBy Balikpapan mengumpulkan,
          menggunakan, dan melindungi data kamu.
        </p>
      </div>
    </section>
    <section class="mx-auto max-w-[820px] px-6 pt-[52px] pb-[70px]">
      <div class="flex flex-col gap-[34px]">
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">1. Data yang kami kumpulkan</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            Kami mengumpulkan data yang kamu berikan saat mendaftar, seperti nama, email, dan nomor telepon. Untuk
            pemilik UMKM, kami juga menyimpan informasi usaha seperti nama usaha, kategori, alamat, foto, dan daftar
            menu atau produk yang kamu unggah.
          </p>
        </div>
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">2. Penggunaan data</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            Data digunakan untuk menampilkan profil UMKM ke publik, memproses ulasan dan rating, serta meningkatkan
            kualitas layanan direktori. Kami tidak menjual data pribadimu kepada pihak ketiga.
          </p>
        </div>
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">3. Ulasan &amp; rating</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            Ulasan yang kamu kirim akan ditampilkan secara publik beserta nama akunmu. Pastikan ulasan yang kamu
            bagikan jujur dan tidak melanggar ketentuan komunitas.
          </p>
        </div>
        <div>
          <h2 class="m-0 mb-2.5 text-[22px] font-extrabold text-brand-navy">4. Keamanan &amp; hakmu</h2>
          <p class="m-0 text-[15.5px] leading-[1.7] text-text-secondary">
            Kami menjaga data dengan langkah pengamanan yang wajar. Kamu berhak mengakses, memperbarui, atau meminta
            penghapusan datamu kapan saja melalui halaman profil atau dengan menghubungi tim kami.
          </p>
        </div>
        <div class="rounded-2xl border border-border-hairline bg-[#F4F0E7] px-6 py-[22px]">
          <div class="mb-1 text-base font-extrabold text-brand-navy">Pertanyaan seputar privasi?</div>
          <p class="m-0 text-[14.5px] leading-relaxed text-text-muted">
            Hubungi kami di <span class="font-bold text-brand-blue">privasi@nearby.id</span> — kami siap membantu.
          </p>
        </div>
        <RouterLink :to="{ name: 'beranda' }" class="text-[14.5px] font-bold text-brand-blue">← Kembali ke beranda</RouterLink>
      </div>
    </section>
  </main>
</template>
