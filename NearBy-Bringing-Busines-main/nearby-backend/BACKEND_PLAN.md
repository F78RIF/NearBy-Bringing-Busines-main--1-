

# NearBy — Backend API (Laravel)

Backend REST API untuk aplikasi **NearBy** (direktori UMKM Balikpapan).
Frontend Vue-nya ada di **branch `front-end`** repo ini (bukan di branch `Back-end`).

> ✅ **Backend sudah dibuat & jalan.** Laravel 13 + Sanctum, database **SQLite**.
> Semua tabel, model, controller, resource, route, dan seeder di dokumen ini
> sudah diimplementasikan. Cara jalan cepat lihat bagian **"Menjalankan"** di bawah.

## Menjalankan

```bash
cd nearby-backend
composer install
cp .env.example .env         # sudah pakai SQLite
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve            # http://127.0.0.1:8000
```

## Akun demo (password semua: `password`)

| Email                 | Role  | Nama          |
|-----------------------|-------|---------------|
| `rizky.p@mail.com`    | user  | Rizky Pratama |
| `dewi.umkm@mail.com`  | owner | Dewi Anjani (punya UMKM #1 & #4) |
| `admin@nearby.id`     | admin | Admin NearBy  |

---

## Struktur Folder Keseluruhan

```
NearBy-Bringing-Busines-front-end/          ← folder induk
├── NearBy-Bringing-Busines-front-end/       ← FRONTEND (Vue 3 + Vite) — sudah ada
└── nearby-backend/                          ← BACKEND (Laravel) — folder ini
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/Api/             ← controller endpoint API
    │   │   ├── Requests/                    ← validasi form request
    │   │   └── Resources/                   ← transformasi JSON (API Resource)
    │   └── Models/                          ← Eloquent model
    ├── database/
    │   ├── migrations/                      ← skema tabel
    │   └── seeders/                         ← data awal (dari frontend)
    ├── routes/api.php                        ← definisi endpoint
    └── .env                                  ← config DB, dsb.
```

---

## Cara Membuat (setelah PHP + Composer terinstall)

Jalankan dari folder induk. Perintah ini akan mengisi folder `nearby-backend`:

```bash
# 1. Buat project Laravel di folder ini
composer create-project laravel/laravel nearby-backend

# 2. Masuk ke folder
cd nearby-backend

# 3. Install Laravel Sanctum (untuk auth token API)
composer require laravel/sanctum

# 4. Setup database di file .env (lihat bagian Database)
#    lalu jalankan migrasi + seeder
php artisan migrate --seed

# 5. Jalankan server (default http://127.0.0.1:8000)
php artisan serve
```

---

## Database (contoh `.env`)

Sesuaikan dengan MySQL dari Laragon/XAMPP:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nearby
DB_USERNAME=root
DB_PASSWORD=
```

---

## Skema Database

Diturunkan dari `src/types/index.ts` dan data di `src/data/` pada frontend.

### `users`
| kolom       | tipe                                   | catatan                          |
|-------------|----------------------------------------|----------------------------------|
| id          | bigint PK                              |                                  |
| name        | string                                 |                                  |
| email       | string unique                          |                                  |
| phone       | string nullable                        | `profilePhone` di frontend       |
| password    | string (hashed)                        |                                  |
| role        | enum('user','owner','admin')           | default `user`                   |
| status      | enum('aktif','menunggu','nonaktif')    | default `aktif`                  |
| deleted_at  | timestamp nullable                     | soft delete (fitur Trash)        |
| timestamps  |                                        | `created_at` = tanggal join      |

### `umkms`
| kolom        | tipe                                          | catatan                         |
|--------------|-----------------------------------------------|---------------------------------|
| id           | bigint PK                                     |                                 |
| owner_id     | bigint FK → users.id                          | pemilik UMKM                    |
| name         | string                                        |                                 |
| category     | enum('Kuliner','Penginapan','Fashion','Oleh-Oleh','Jasa') |                     |
| location     | enum(6 wilayah Balikpapan)                    | lihat `LocationName`            |
| rating       | decimal(2,1) default 0                        | dihitung dari reviews           |
| reviews_count| integer default 0                             | cache jumlah ulasan             |
| price_label  | string                                        | mis. "Rp25–75rb"                |
| tag          | text                                          | deskripsi singkat               |
| address      | string                                        |                                 |
| hours        | string                                        | jam buka                        |
| phone        | string                                        |                                 |
| ig           | string nullable                               | instagram                       |
| status       | enum('aktif','libur','tutup')                 | default `aktif`                 |
| verification | enum('menunggu','disetujui','ditolak')        | untuk fitur verifikasi admin    |
| views        | integer default 0                             |                                 |
| deleted_at   | timestamp nullable                            | soft delete                     |
| timestamps   |                                               |                                 |

### `umkm_items`  (menu / produk milik UMKM)
| kolom     | tipe                 | catatan                    |
|-----------|----------------------|----------------------------|
| id        | bigint PK            |                            |
| umkm_id   | bigint FK → umkms.id |                            |
| name      | string               | nama menu/produk           |
| price     | string               | mis. "Rp68rb"              |
| img       | string nullable      | path gambar                |
| available | boolean default true | `avail` di frontend        |

### `reviews`
| kolom      | tipe                 | catatan                        |
|------------|----------------------|--------------------------------|
| id         | bigint PK            |                                |
| umkm_id    | bigint FK → umkms.id |                                |
| user_id    | bigint FK → users.id |                                |
| stars      | tinyint (1–5)        |                                |
| text       | text                 |                                |
| reply      | text nullable        | balasan pemilik (ReplyReview)  |
| timestamps |                      | `created_at` = tanggal ulasan  |

### `favorites`  (pivot user ⇄ umkm)
| kolom   | tipe                 |
|---------|----------------------|
| user_id | bigint FK → users.id |
| umkm_id | bigint FK → umkms.id |

### `submissions`  (pengajuan UMKM baru untuk diverifikasi admin)
| kolom     | tipe                                     | catatan                     |
|-----------|------------------------------------------|-----------------------------|
| id        | bigint PK                                |                             |
| umkm_id   | bigint FK → umkms.id                     |                             |
| owner_id  | bigint FK → users.id                     |                             |
| status    | enum('menunggu','disetujui','ditolak')   |                             |
| checks    | json                                     | daftar syarat & status      |
| files     | json                                     | dokumen/foto yang diunggah  |
| timestamps|                                          |                             |

---

## Daftar Endpoint API (`routes/api.php`)

Semua di-prefix `/api`. Yang butuh login ditandai 🔒 (Sanctum token).

### Auth
| Method | Endpoint            | Fungsi                         |
|--------|---------------------|--------------------------------|
| POST   | `/register`         | Daftar (pilih role user/owner) |
| POST   | `/login`            | Login, balikin token           |
| POST   | `/logout` 🔒        | Logout                         |
| GET    | `/me` 🔒            | Data user yang sedang login    |

### UMKM (publik untuk baca)
| Method | Endpoint            | Fungsi                                    |
|--------|---------------------|-------------------------------------------|
| GET    | `/umkm`             | List + filter `?category=&location=&q=`   |
| GET    | `/umkm/{id}`        | Detail UMKM + menu + ulasan               |
| POST   | `/umkm` 🔒          | Owner ajukan UMKM baru                     |
| PUT    | `/umkm/{id}` 🔒     | Owner edit UMKM miliknya                   |
| DELETE | `/umkm/{id}` 🔒     | Soft delete (masuk Trash)                 |

### Reviews
| Method | Endpoint                     | Fungsi                     |
|--------|------------------------------|----------------------------|
| GET    | `/umkm/{id}/reviews`         | List ulasan sebuah UMKM    |
| POST   | `/umkm/{id}/reviews` 🔒      | User kirim ulasan          |
| POST   | `/reviews/{id}/reply` 🔒     | Owner balas ulasan         |

### Favorites 🔒
| Method | Endpoint              | Fungsi                    |
|--------|-----------------------|---------------------------|
| GET    | `/favorites`          | List favorit user         |
| POST   | `/umkm/{id}/favorite` | Toggle favorit            |

### Dashboard Owner 🔒
| Method | Endpoint              | Fungsi                             |
|--------|-----------------------|------------------------------------|
| GET    | `/owner/summary`      | Ringkasan (statistik, chart)       |
| GET    | `/owner/umkm`         | UMKM milik owner                   |
| GET    | `/owner/reviews`      | Ulasan untuk UMKM owner            |

### Dashboard Admin 🔒 (role: admin)
| Method | Endpoint                        | Fungsi                       |
|--------|---------------------------------|------------------------------|
| GET    | `/admin/users`                  | Kelola pengguna              |
| GET    | `/admin/umkm`                   | Semua UMKM                   |
| GET    | `/admin/submissions`            | Antrian verifikasi           |
| POST   | `/admin/submissions/{id}/approve` | Setujui pengajuan          |
| POST   | `/admin/submissions/{id}/reject`  | Tolak pengajuan            |
| GET    | `/admin/reports`                | Laporan/statistik            |
| GET    | `/admin/trash`                  | Item terhapus (user & umkm)  |
| POST   | `/admin/trash/{id}/restore`     | Pulihkan dari trash          |

---

## CORS (agar frontend Vue bisa akses API)

Frontend Vite dev berjalan di `http://localhost:5173`.
Di `config/cors.php` Laravel, izinkan origin tersebut:

```php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

Di frontend, base URL API bisa disimpan di `.env`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## Langkah Migrasi Frontend (mock → API)

Saat ini frontend pakai data mock di `src/data/*.ts` dan store Pinia.
Rencana penggantian bertahap:

1. Buat file `src/lib/api.ts` (wrapper `fetch` ke `VITE_API_URL`).
2. Ganti isi store satu per satu (`umkm.ts`, `reviews.ts`, `auth.ts`, dst.)
   dari data statis → panggil API.
3. Pindahkan seed di `src/data/*.ts` menjadi Laravel Seeder
   (`database/seeders/`) supaya data awal sama persis.
```
