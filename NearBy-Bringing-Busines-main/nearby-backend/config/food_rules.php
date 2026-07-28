<?php

/*
|--------------------------------------------------------------------------
| Aturan Kalkulator Harga & Masa Tahan Makanan
|--------------------------------------------------------------------------
|
| Semua angka di sini bersifat rule-based (lookup table), bukan hasil AI.
| Ditaruh di config supaya bisa disesuaikan tanpa mengubah kode.
|
| CATATAN: angka masa tahan adalah estimasi umum untuk makanan rumahan /
| UMKM tanpa pengawet dan tanpa pengemasan vakum. Untuk klaim resmi pada
| label produk, pakai acuan BPOM atau hasil uji laboratorium.
|
*/

return [

    /*
    |--------------------------------------------------------------------------
    | Konversi satuan ke gram
    |--------------------------------------------------------------------------
    |
    | Dipakai untuk menjumlahkan berat total bahan sebelum dibagi standar
    | porsi. Satuan cair (ml/l) diperlakukan 1 ml = 1 g — cukup akurat untuk
    | air, susu, dan santan encer.
    |
    | `pcs` dan `butir` sengaja TIDAK ada di sini: beratnya tidak bisa
    | ditebak. Bahan dengan satuan itu tetap dihitung di HPP, tapi tidak
    | menambah berat total, dan pemanggil wajib memberi tahu penjual bahwa
    | estimasi porsinya jadi kasar.
    |
    */
    'units' => [
        'g' => 1,
        'gram' => 1,
        'kg' => 1000,
        'ml' => 1,
        'l' => 1000,
        'liter' => 1000,
        'sdm' => 15,   // sendok makan
        'sdt' => 5,    // sendok teh
    ],

    /** Satuan yang diterima form tapi tidak bisa dikonversi ke gram. */
    'countable_units' => ['pcs', 'butir', 'buah', 'lembar', 'ikat'],

    /*
    |--------------------------------------------------------------------------
    | Standar porsi & masa tahan per kategori
    |--------------------------------------------------------------------------
    |
    | serving_grams : berat/volume rata-rata satu porsi
    | shelf_life    : masa tahan dalam JAM, per cara penyimpanan.
    |                 null = tidak dianjurkan / tidak relevan.
    |
    */
    'categories' => [

        'Nasi & Lauk' => [
            'serving_grams' => 250,
            'shelf_life' => ['suhu_ruang' => 4, 'kulkas' => 48, 'freezer' => null],
            'note' => 'Nasi dan lauk matang cepat basi di suhu ruang, apalagi di cuaca panas.',
        ],

        'Berkuah / Bersantan' => [
            'serving_grams' => 300,
            'shelf_life' => ['suhu_ruang' => 3, 'kulkas' => 48, 'freezer' => 720],
            'note' => 'Santan paling cepat pecah dan basi. Panaskan ulang sampai mendidih sebelum dijual kembali.',
        ],

        'Gorengan' => [
            'serving_grams' => 50,
            'shelf_life' => ['suhu_ruang' => 5, 'kulkas' => 24, 'freezer' => null],
            'note' => 'Setelah 4-5 jam gorengan melempem dan minyaknya mulai tengik.',
        ],

        'Makanan Kering / Keripik' => [
            'serving_grams' => 100,
            'shelf_life' => ['suhu_ruang' => 504, 'kulkas' => null, 'freezer' => null],
            'note' => 'Tahan lama asal disimpan dalam wadah kedap udara. Jangan masuk kulkas — jadi melempem.',
        ],

        'Kue Basah' => [
            'serving_grams' => 80,
            'shelf_life' => ['suhu_ruang' => 18, 'kulkas' => 72, 'freezer' => null],
            'note' => 'Kue basah berisi santan atau kelapa parut lebih cepat basi daripada yang berbahan tepung saja.',
        ],

        'Kue Kering' => [
            'serving_grams' => 50,
            'shelf_life' => ['suhu_ruang' => 1008, 'kulkas' => null, 'freezer' => null],
            'note' => 'Simpan dalam toples kedap udara, jauhkan dari lembap.',
        ],

        'Roti' => [
            'serving_grams' => 80,
            'shelf_life' => ['suhu_ruang' => 72, 'kulkas' => 168, 'freezer' => 720],
            'note' => 'Roti tanpa pengawet berjamur setelah 2-3 hari di suhu ruang.',
        ],

        'Minuman' => [
            'serving_grams' => 250,
            'shelf_life' => ['suhu_ruang' => 6, 'kulkas' => 48, 'freezer' => null],
            'note' => 'Minuman bersusu atau bersantan jauh lebih cepat basi daripada yang berbasis air.',
        ],

        'Sambal & Bumbu' => [
            'serving_grams' => 30,
            'shelf_life' => ['suhu_ruang' => 48, 'kulkas' => 336, 'freezer' => 2160],
            'note' => 'Sambal matang berminyak lebih awet daripada sambal mentah.',
        ],

        'Frozen Food (mentah)' => [
            'serving_grams' => 100,
            'shelf_life' => ['suhu_ruang' => 3, 'kulkas' => 72, 'freezer' => 2880],
            'note' => 'Jangan dibekukan ulang setelah mencair — mutu dan keamanannya turun drastis.',
        ],

        'Fermentasi (tempe, tape)' => [
            'serving_grams' => 100,
            'shelf_life' => ['suhu_ruang' => 72, 'kulkas' => 168, 'freezer' => null],
            'note' => 'Fermentasi terus berjalan; rasa makin kuat seiring waktu.',
        ],

        'Awetan / Manisan / Asinan' => [
            'serving_grams' => 100,
            'shelf_life' => ['suhu_ruang' => 336, 'kulkas' => 1440, 'freezer' => null],
            'note' => 'Kadar gula atau garam tinggi membuatnya awet. Pakai wadah bersih dan kering.',
        ],

        'Seafood Olahan' => [
            'serving_grams' => 150,
            'shelf_life' => ['suhu_ruang' => 3, 'kulkas' => 24, 'freezer' => 2160],
            'note' => 'Bahan paling cepat rusak. Jaga rantai dingin dari awal sampai ke tangan pembeli.',
        ],

        'Daging Olahan' => [
            'serving_grams' => 150,
            'shelf_life' => ['suhu_ruang' => 4, 'kulkas' => 48, 'freezer' => 2160],
            'note' => 'Pastikan matang sempurna di bagian tengah sebelum disimpan.',
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Default perhitungan harga
    |--------------------------------------------------------------------------
    */
    'pricing' => [
        'default_margin_percent' => 35,   // rentang wajar UMKM makanan: 30-40%
        'max_margin_percent' => 90,       // di atas ini rumusnya jadi tidak masuk akal
        'rounding' => 500,                // bulatkan harga jual ke atas per Rp500
    ],

];
