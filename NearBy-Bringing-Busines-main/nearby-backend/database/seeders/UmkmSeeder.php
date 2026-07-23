<?php

namespace Database\Seeders;

use App\Models\Umkm;
use Illuminate\Database\Seeder;

class UmkmSeeder extends Seeder
{
    /**
     * Verbatim seed data extracted from the frontend `src/data/umkm.ts`.
     * Owner assignment: ids 1 and 4 belong to the demo owner "Dewi Anjani"
     * (matches the frontend dashboard seed), the rest are unassigned.
     */
    public function run(): void
    {
        foreach ($this->data() as $row) {
            $items = $row['items'];
            unset($row['items']);

            $umkm = Umkm::create($row);

            foreach ($items as $item) {
                $umkm->items()->create($item);
            }
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function data(): array
    {
        // Demo owner (Dewi Anjani) is user id 2 — see UserSeeder.
        $ownerId = 2;

        return [
            [
                'id' => 1, 'owner_id' => $ownerId, 'name' => 'Warung Kepiting Kenari',
                'category' => 'Kuliner', 'location' => 'Balikpapan Timur',
                'rating' => 4.8, 'reviews_count' => 213, 'price_label' => 'Rp25–75rb',
                'tag' => 'Seafood kepiting soka & lada hitam legendaris, resep turun-temurun.',
                'img_label' => 'foto kepiting', 'address' => 'Jl. Manunggal No. 12, Balikpapan Timur',
                'hours' => '10.00 – 22.00 WITA', 'phone' => '0812-5544-1122', 'ig' => '@kepiting.kenari',
                'list_label' => 'Menu andalan', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Kepiting Saus Padang', 'price' => 'Rp68rb'],
                    ['name' => 'Kepiting Lada Hitam', 'price' => 'Rp72rb'],
                    ['name' => 'Udang Galah Bakar', 'price' => 'Rp55rb'],
                    ['name' => 'Cumi Goreng Tepung', 'price' => 'Rp38rb'],
                ],
            ],
            [
                'id' => 2, 'name' => 'Kopi Saluang',
                'category' => 'Kuliner', 'location' => 'Balikpapan Tengah',
                'rating' => 4.7, 'reviews_count' => 156, 'price_label' => 'Rp15–40rb',
                'tag' => 'Kedai kopi robusta lokal dengan suasana hangat khas Kalimantan.',
                'img_label' => 'foto kedai kopi', 'address' => 'Jl. Jenderal Sudirman No. 88, Balikpapan Tengah',
                'hours' => '08.00 – 23.00 WITA', 'phone' => '0813-4477-9900', 'ig' => '@kopi.saluang',
                'list_label' => 'Menu andalan', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Kopi Susu Saluang', 'price' => 'Rp22rb'],
                    ['name' => 'Robusta Tubruk', 'price' => 'Rp15rb'],
                    ['name' => 'Aren Latte', 'price' => 'Rp26rb'],
                    ['name' => 'Roti Bakar Srikaya', 'price' => 'Rp18rb'],
                ],
            ],
            [
                'id' => 3, 'name' => 'Penginapan Teluk Asri',
                'category' => 'Penginapan', 'location' => 'Balikpapan Selatan',
                'rating' => 4.6, 'reviews_count' => 98, 'price_label' => 'Rp180–350rb',
                'tag' => 'Homestay nyaman tepi teluk, cocok untuk keluarga dan pekerja.',
                'img_label' => 'foto kamar', 'address' => 'Jl. Sepinggan Baru No. 5, Balikpapan Selatan',
                'hours' => 'Check-in 14.00 · Check-out 12.00', 'phone' => '0821-5566-3344', 'ig' => '@teluk.asri.stay',
                'list_label' => 'Tipe kamar', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Standar Twin', 'price' => 'Rp180rb'],
                    ['name' => 'Deluxe AC', 'price' => 'Rp250rb'],
                    ['name' => 'Family Room', 'price' => 'Rp350rb'],
                    ['name' => 'Extra Bed', 'price' => 'Rp60rb'],
                ],
            ],
            [
                'id' => 4, 'owner_id' => $ownerId, 'name' => 'Amplang Bahari',
                'category' => 'Oleh-Oleh', 'location' => 'Balikpapan Utara',
                'rating' => 4.9, 'reviews_count' => 321, 'price_label' => 'Rp20–60rb',
                'tag' => 'Amplang ikan tenggiri renyah, oleh-oleh khas Balikpapan paling dicari.',
                'img_label' => 'foto amplang', 'address' => 'Jl. Mulawarman No. 40, Balikpapan Utara',
                'hours' => '08.00 – 20.00 WITA', 'phone' => '0852-4488-2211', 'ig' => '@amplang.bahari',
                'list_label' => 'Produk', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Amplang Tenggiri 250gr', 'price' => 'Rp35rb'],
                    ['name' => 'Amplang Pedas 250gr', 'price' => 'Rp38rb'],
                    ['name' => 'Kerupuk Kuku Macan', 'price' => 'Rp25rb'],
                    ['name' => 'Paket Oleh-oleh', 'price' => 'Rp60rb'],
                ],
            ],
            [
                'id' => 5, 'name' => 'Batik Beruang Madu',
                'category' => 'Fashion', 'location' => 'Balikpapan Kota',
                'rating' => 4.5, 'reviews_count' => 74, 'price_label' => 'Rp95–450rb',
                'tag' => 'Batik tulis & cap motif beruang madu, ikon khas Kota Balikpapan.',
                'img_label' => 'foto batik', 'address' => 'Jl. Ahmad Yani No. 21, Balikpapan Tengah',
                'hours' => '09.00 – 21.00 WITA', 'phone' => '0819-3322-7788', 'ig' => '@batik.beruangmadu',
                'list_label' => 'Koleksi', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Kemeja Batik Cap', 'price' => 'Rp150rb'],
                    ['name' => 'Kain Batik Tulis', 'price' => 'Rp450rb'],
                    ['name' => 'Dress Motif Madu', 'price' => 'Rp220rb'],
                    ['name' => 'Selendang', 'price' => 'Rp95rb'],
                ],
            ],
            [
                'id' => 6, 'name' => 'Servis Motor Pak Gultom',
                'category' => 'Jasa', 'location' => 'Balikpapan Barat',
                'rating' => 4.7, 'reviews_count' => 142, 'price_label' => 'Mulai Rp30rb',
                'tag' => 'Bengkel motor tepercaya, servis cepat & suku cadang lengkap.',
                'img_label' => 'foto bengkel', 'address' => 'Jl. Marsma Iswahyudi No. 9, Balikpapan Barat',
                'hours' => '08.00 – 18.00 WITA', 'phone' => '0811-2299-6655', 'ig' => '@gultom.motor',
                'list_label' => 'Layanan', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Servis Ringan', 'price' => 'Rp45rb'],
                    ['name' => 'Ganti Oli', 'price' => 'Rp30rb'],
                    ['name' => 'Tune Up', 'price' => 'Rp90rb'],
                    ['name' => 'Servis Rem', 'price' => 'Rp55rb'],
                ],
            ],
            [
                'id' => 7, 'name' => 'Nasi Kuning Sambal Raja',
                'category' => 'Kuliner', 'location' => 'Balikpapan Utara',
                'rating' => 4.8, 'reviews_count' => 265, 'price_label' => 'Rp12–25rb',
                'tag' => 'Nasi kuning legendaris pagi hari dengan sambal khas yang menggugah.',
                'img_label' => 'foto nasi kuning', 'address' => 'Jl. Pupuk Raya No. 3, Balikpapan Utara',
                'hours' => '05.00 – 11.00 WITA', 'phone' => '0857-9900-1234', 'ig' => '@sambalraja.bpn',
                'list_label' => 'Menu andalan', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Nasi Kuning Komplit', 'price' => 'Rp20rb'],
                    ['name' => 'Nasi Kuning Ayam', 'price' => 'Rp25rb'],
                    ['name' => 'Nasi Kuning Telur', 'price' => 'Rp12rb'],
                    ['name' => 'Teh Manis Hangat', 'price' => 'Rp5rb'],
                ],
            ],
            [
                'id' => 8, 'name' => 'Kriya Rotan Manggar',
                'category' => 'Oleh-Oleh', 'location' => 'Balikpapan Timur',
                'rating' => 4.6, 'reviews_count' => 58, 'price_label' => 'Rp45–300rb',
                'tag' => 'Kerajinan rotan handmade — tas, keranjang, dan dekorasi rumah.',
                'img_label' => 'foto kerajinan', 'address' => 'Jl. Mulawarman, Manggar, Balikpapan Timur',
                'hours' => '09.00 – 17.00 WITA', 'phone' => '0813-7788-4455', 'ig' => '@kriya.manggar',
                'list_label' => 'Produk', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Tas Rotan', 'price' => 'Rp180rb'],
                    ['name' => 'Keranjang Anyam', 'price' => 'Rp75rb'],
                    ['name' => 'Tudung Saji', 'price' => 'Rp45rb'],
                    ['name' => 'Kursi Rotan', 'price' => 'Rp300rb'],
                ],
            ],
            [
                'id' => 9, 'name' => 'Wisma Somber Stay',
                'category' => 'Penginapan', 'location' => 'Balikpapan Utara',
                'rating' => 4.4, 'reviews_count' => 41, 'price_label' => 'Rp150–280rb',
                'tag' => 'Penginapan bersih dekat pelabuhan Somber, praktis untuk transit.',
                'img_label' => 'foto wisma', 'address' => 'Jl. Sultan Hasanuddin No. 17, Balikpapan Utara',
                'hours' => 'Check-in 13.00 · Check-out 12.00', 'phone' => '0822-3344-5566', 'ig' => '@somber.stay',
                'list_label' => 'Tipe kamar', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Ekonomi Fan', 'price' => 'Rp150rb'],
                    ['name' => 'Standar AC', 'price' => 'Rp220rb'],
                    ['name' => 'Deluxe', 'price' => 'Rp280rb'],
                    ['name' => 'Extra Bed', 'price' => 'Rp50rb'],
                ],
            ],
            [
                'id' => 10, 'name' => 'Laundry Kilat Sepinggan',
                'category' => 'Jasa', 'location' => 'Balikpapan Selatan',
                'rating' => 4.6, 'reviews_count' => 187, 'price_label' => 'Rp7rb/kg',
                'tag' => 'Laundry express selesai 3 jam, wangi & rapi, antar-jemput tersedia.',
                'img_label' => 'foto laundry', 'address' => 'Jl. Marsma R. Iswahyudi No. 55, Balikpapan Selatan',
                'hours' => '07.00 – 21.00 WITA', 'phone' => '0812-6677-8899', 'ig' => '@laundrykilat.spg',
                'list_label' => 'Layanan', 'verification' => 'disetujui',
                'items' => [
                    ['name' => 'Cuci Kering Lipat', 'price' => 'Rp7rb/kg'],
                    ['name' => 'Cuci Setrika', 'price' => 'Rp10rb/kg'],
                    ['name' => 'Express 3 Jam', 'price' => 'Rp15rb/kg'],
                    ['name' => 'Bed Cover', 'price' => 'Rp25rb'],
                ],
            ],
        ];
    }
}
