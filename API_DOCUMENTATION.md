# Dokumentasi REST API - PT Tirya Lumba

Dokumentasi resmi arsitektur REST API, kontrak *request/response*, skema autentikasi, dan otorisasi *Role-Based Access Control* (RBAC) untuk backend PT Tirya Lumba.

---

## 1. Ringkasan & Konfigurasi Server

* **Base URL:** `http://localhost:5000/api`
* **Format Payload:** `application/json` (Kecuali endpoint upload file menggunakan `multipart/form-data`)
* **Keamanan:**
  * **Helmet:** Proteksi security headers dan *Cross-Origin Resource Policy* diaktifkan untuk aset gambar publik.
  * **CORS:** Dibatasi untuk klien Landing Page (`http://localhost:3000`) dan Dasbor Admin (`http://localhost:5173`).
  * **Rate Limiter:** Global Rate Limiting aktif pada seluruh endpoint API (100 request per 15 menit per IP).
  * **Static Directories:**
    * `/public` -> Melayani aset statis publik (`http://localhost:5000/public/...`).
    * `/uploads` -> Melayani file hasil unggahan Multer (`http://localhost:5000/uploads/...`).

### Mekanisme Autentikasi & Sesi
Sistem menggunakan **JSON Web Token (JWT)**.
* **Penyimpanan Token:** Token dikirimkan kembali melalui body response saat login serta otomatis disematkan ke dalam **HTTP-Only Cookie** bernama `access_token`.
* **Header Permintaan:** Untuk klien yang tidak menggunakan cookie berbasis browser, sertakan header:
  ```http
  Authorization: Bearer <access_token>
  ```
  atau sertakan cookie:
  ```http
  Cookie: access_token=<access_token>
  ```
* **Masa Berlaku Token:**
  * Role `ADMIN` dan `POOL_MANAGER`: **2 Jam**
  * Role `STUDENT` dan `INSTRUCTOR`: **30 Hari**

### Format Standar Respon API

**Struktur Respon Sukses:**
```json
{
  "success": true,
  "message": "Pesan deskripsi aksi (opsional/ada)",
  "data": {},
  "pagination": {
    "totalItems": 10,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

**Struktur Respon Gagal:**
```json
{
  "success": false,
  "message": "Pesan kesalahan atau validasi gagal"
}
```

---

## 2. Modul Autentikasi (Auth)

Modul otentikasi menangani alur pendaftaran user baru, verifikasi kode OTP berbasis email, dan login akun.

### 2.1 Registrasi Akun Awal (Kirim OTP)
* **Endpoint:** `POST /api/auth/register`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "fullName": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "password": "password123"
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Kode OTP telah dikirim ke email Anda.",
  "data": "budi.santoso@example.com"
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Password minimal 6 karakter"
}
```

---

### 2.2 Verifikasi Kode OTP
* **Endpoint:** `POST /api/auth/verify-otp`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "email": "budi.santoso@example.com",
  "otpCode": "482910"
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Verifikasi akun berhasil! Silakan login."
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Kode OTP yang Anda masukkan salah."
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Pengguna dengan email ini tidak ditemukan."
}
```

---

### 2.3 Login Akun & Penerbitan JWT
* **Endpoint:** `POST /api/auth/login`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "email": "budi.santoso@example.com",
  "password": "password123"
}
```

**Contoh Response Sukses (200 OK):**
*(Server juga menyetel header `Set-Cookie: access_token=...; HttpOnly; SameSite=Lax`)*
```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjN2E4YjlkMC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImJ1ZGkuc2FudG9zb0BleGFtcGxlLmNvbSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzE4OTAwMDAwLCJleHAiOjE3MjE0OTIwMDB9.signature...",
    "user": {
      "userId": "c7a8b9d0-1234-5678-90ab-cdef12345678",
      "email": "budi.santoso@example.com",
      "role": "STUDENT"
    }
  }
}
```

**Contoh Response Gagal (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Email atau password yang Anda masukkan salah."
}
```

**Contoh Response Gagal (403 Forbidden - Belum Terverifikasi):**
```json
{
  "success": false,
  "message": "Akun Anda belum diverifikasi. Silakan verifikasi kode OTP terlebih dahulu."
}
```

---

## 3. Modul Master Data Area (Daerah)

Modul ini mengelola data wilayah/daerah (misal: "Tangerang Selatan", "Jakarta Selatan") yang mengelompokkan lokasi-lokasi kolam renang.

### 3.1 Menampilkan Seluruh Area
* **Endpoint:** `GET /api/areas`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** Tidak membutuhkan header autentikasi

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
      "name": "Bintaro",
      "_count": {
        "locations": 4
      }
    },
    {
      "id": "f5a6b7c8-9d0e-1f2a-3b4c-5d6e7f8a9b0c",
      "name": "Tangerang Selatan",
      "_count": {
        "locations": 8
      }
    }
  ]
}
```

---

### 3.2 Menampilkan Detail Area Berdasarkan ID
* **Endpoint:** `GET /api/areas/:id`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **URL Path Params:** `id` (string, UUID, contoh: `e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b`)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
    "name": "Bintaro",
    "locations": [
      {
        "id": "a898fd3b-7fee-4479-b5f7-19624b25d614",
        "name": "Kolam Renang FitX Gym",
        "category": "Kerjasama Tangerang",
        "mapUrl": "https://maps.google.com/?q=-6.281,106.712"
      }
    ]
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Area/daerah tidak ditemukan."
}
```

---

### 3.3 Tambah Area Baru
* **Endpoint:** `POST /api/areas`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "name": "Jakarta Barat"
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Area baru berhasil ditambahkan.",
  "data": {
    "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "name": "Jakarta Barat"
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Nama area/daerah sudah terdaftar."
}
```

**Contoh Response Gagal (403 Forbidden):**
```json
{
  "success": false,
  "message": "Hak akses ditolak. Anda tidak memiliki izin untuk tindakan ini."
}
```

---

### 3.4 Perbarui Data Area
* **Endpoint:** `PUT /api/areas/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **URL Path Params:** `id` (string, UUID)
- **Request Body JSON:**
```json
{
  "name": "Jakarta Barat Kota"
}
```

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Data area berhasil diperbarui.",
  "data": {
    "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "name": "Jakarta Barat Kota"
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Area/daerah tidak ditemukan."
}
```

---

### 3.5 Hapus Data Area
* **Endpoint:** `DELETE /api/areas/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Area berhasil dihapus."
}
```

**Contoh Response Gagal (400 Bad Request - Masih Terikat Kolam):**
```json
{
  "success": false,
  "message": "Gagal menghapus. Area ini masih terikat dengan beberapa lokasi kolam renang."
}
```

---

## 4. Modul Lokasi Kolam (Locations)

Modul ini mengelola data titik kolam renang yang bekerja sama dengan PT Tirya Lumba, termasuk katalog ringkas untuk Landing Page.

### 4.1 Katalog Lokasi Publik (Landing Page)
* **Endpoint:** `GET /api/locations/public`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Query Params:** `?page=1&limit=8`
  - `page` *(number, optional, default: 1)* - Halaman pagination
  - `limit` *(number, optional, default: 8, max: 50)* - Jumlah item per halaman

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "a898fd3b-7fee-4479-b5f7-19624b25d614",
      "name": "Kolam Renang FitX Gym",
      "areaName": "Bintaro",
      "mapUrl": "https://maps.google.com/?q=-6.281,106.712",
      "regularPrice": 350000
    },
    {
      "id": "b789ef12-3456-7890-abcd-ef1234567890",
      "name": "Kolam Renang Graha Raya",
      "areaName": "Tangerang Selatan",
      "mapUrl": "https://maps.google.com/?q=-6.234,106.678",
      "regularPrice": 300000
    }
  ],
  "pagination": {
    "totalItems": 12,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 8
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Limit maksimal 50"
}
```

---

### 4.2 Menampilkan Seluruh Data Lokasi (Admin/Internal)
* **Endpoint:** `GET /api/locations`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** Tidak membutuhkan header autentikasi

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "a898fd3b-7fee-4479-b5f7-19624b25d614",
      "name": "Kolam Renang FitX Gym",
      "category": "Kerjasama Tangerang",
      "mapUrl": "https://maps.google.com/?q=-6.281,106.712",
      "areaId": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b"
    }
  ]
}
```

---

### 4.3 Menampilkan Detail Lokasi Berdasarkan ID
* **Endpoint:** `GET /api/locations/:id`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "a898fd3b-7fee-4479-b5f7-19624b25d614",
    "name": "Kolam Renang FitX Gym",
    "category": "Kerjasama Tangerang",
    "mapUrl": "https://maps.google.com/?q=-6.281,106.712",
    "areaId": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b"
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Lokasi kolam tidak ditemukan."
}
```

---

### 4.4 Tambah Lokasi Kolam Baru
* **Endpoint:** `POST /api/locations`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "name": "Kolam Renang Graha Raya",
  "areaId": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
  "category": "Kerjasama Tangerang",
  "mapUrl": "https://maps.google.com/?q=-6.234,106.678"
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Lokasi kolam baru berhasil ditambahkan.",
  "data": {
    "id": "b789ef12-3456-7890-abcd-ef1234567890",
    "name": "Kolam Renang Graha Raya",
    "areaId": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
    "category": "Kerjasama Tangerang",
    "mapUrl": "https://maps.google.com/?q=-6.234,106.678"
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Lokasi kolam \"Kolam Renang Graha Raya\" sudah terdaftar di area ini."
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Area/daerah tidak ditemukan."
}
```

---

### 4.5 Perbarui Data Lokasi Kolam
* **Endpoint:** `PUT /api/locations/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **URL Path Params:** `id` (string, UUID)
- **Request Body JSON:**
```json
{
  "name": "Kolam Renang Graha Raya Modern",
  "category": "Kerjasama Tangerang Premium"
}
```

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Data lokasi berhasil diperbarui.",
  "data": {
    "id": "b789ef12-3456-7890-abcd-ef1234567890",
    "name": "Kolam Renang Graha Raya Modern",
    "areaId": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
    "category": "Kerjasama Tangerang Premium",
    "mapUrl": "https://maps.google.com/?q=-6.234,106.678"
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Area/daerah tujuan tidak ditemukan."
}
```

---

### 4.6 Hapus Lokasi Kolam
* **Endpoint:** `DELETE /api/locations/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Lokasi kolam berhasil dihapus."
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Tolong masukan ID yang valid"
}
```

---

## 5. Modul Paket Les (Packages)

Modul ini mengelola paket les renang (misal: Reguler, Privat, Prestasi) dan nominal tarif harga per lokasi kolam.

### 5.1 Menampilkan Seluruh Paket Les
* **Endpoint:** `GET /api/packages`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** Tidak membutuhkan header autentikasi

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
      "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
      "type": "Reguler",
      "price": 350000
    },
    {
      "id": "d2e3f4a5-6b7c-8d9e-0f1a-2b3c4d5e6f7a",
      "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
      "type": "Privat",
      "price": 800000
    }
  ]
}
```

---

### 5.2 Menampilkan Detail Paket Berdasarkan ID
* **Endpoint:** `GET /api/packages/:id`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "package": {
      "id": "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
      "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
      "type": "Reguler",
      "price": 350000
    }
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Package ini tidak ditemukan."
}
```

---

### 5.3 Tambah Paket Les Baru
* **Endpoint:** `POST /api/packages`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
  "type": "Reguler",
  "price": 350000,
  "meetCount": 4
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Package baru berhasil ditambahkan.",
  "data": {
    "id": "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
    "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
    "type": "Reguler",
    "price": 350000
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Kolam tidak boleh kosong"
}
```

---

### 5.4 Perbarui Data Paket Les
* **Endpoint:** `PUT /api/packages/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **URL Path Params:** `id` (string, UUID)
- **Request Body JSON:**
```json
{
  "price": 375000
}
```

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Data package berhasil diperbarui.",
  "data": {
    "id": "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
    "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
    "type": "Reguler",
    "price": 375000
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Data yang anda cari tidak ditemukan di database"
}
```

---

### 5.5 Hapus Data Paket Les
* **Endpoint:** `DELETE /api/packages/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Package kolam berhasil dihapus."
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Data yang anda cari tidak ditemukan di database"
}
```

---

## 6. Modul Sesi Waktu (Sessions)

Modul ini mengelola master jadwal sesi jam operasional les renang (hari, jam mulai, jam selesai) baik yang berlaku global maupun spesifik per lokasi kolam.

### 6.1 Menampilkan Sesi Berdasarkan Lokasi & Hari
* **Endpoint:** `GET /api/sessions`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Query Params:** `?locationId=a898fd3b-7fee-4479-b5f7-19624b25d614&dayOfWeek=Senin`
  - `locationId` *(string, UUID, required)* - ID Lokasi kolam
  - `dayOfWeek` *(string, required)* - Nama hari (contoh: "Senin", "Selasa", dll)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "e1f2a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
      "dayOfWeek": "Senin",
      "sessionName": "Sesi 1",
      "startTime": "08:00",
      "endTime": "09:30",
      "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614"
    },
    {
      "id": "f2a3b4c5-6d7e-8f9a-0b1c-2d3e4f5a6b7c",
      "dayOfWeek": "Senin",
      "sessionName": "Sesi 2",
      "startTime": "10:00",
      "endTime": "11:30",
      "locationId": null
    }
  ]
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Hari tidak boleh kosong"
}
```

---

### 6.2 Menampilkan Detail Sesi Berdasarkan ID
* **Endpoint:** `GET /api/sessions/:id`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "e1f2a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
    "dayOfWeek": "Senin",
    "sessionName": "Sesi 1",
    "startTime": "08:00",
    "endTime": "09:30",
    "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614"
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Sesi tidak ditemukan."
}
```

---

### 6.3 Tambah Sesi Waktu Baru
* **Endpoint:** `POST /api/sessions`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "sessionName": "Sesi 1",
  "dayOfWeek": "Senin",
  "startTime": "08:00",
  "endTime": "09:30",
  "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614"
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Sesi baru berhasil ditambahkan.",
  "data": {
    "id": "e1f2a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
    "sessionName": "Sesi 1",
    "dayOfWeek": "Senin",
    "startTime": "08:00",
    "endTime": "09:30",
    "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614"
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Format jam mulai harus HH:mm (contoh: 08:00)"
}
```

---

### 6.4 Perbarui Data Sesi Waktu
* **Endpoint:** `PUT /api/sessions/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **URL Path Params:** `id` (string, UUID)
- **Request Body JSON:**
```json
{
  "startTime": "08:30",
  "endTime": "10:00"
}
```

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Data sesi berhasil diperbarui.",
  "data": {
    "id": "e1f2a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
    "sessionName": "Sesi 1",
    "dayOfWeek": "Senin",
    "startTime": "08:30",
    "endTime": "10:00",
    "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614"
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Sesi tidak ditemukan."
}
```

---

### 6.5 Hapus Data Sesi Waktu
* **Endpoint:** `DELETE /api/sessions/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Sesi berhasil dihapus."
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Sesi tidak ditemukan."
}
```

---

## 7. Modul Pengelola Kolam (Pool Managers)

Modul ini dikhususkan bagi Super Admin untuk mengelola akun User berstatus `POOL_MANAGER` yang bertugas di lokasi kolam tertentu.

> **Catatan Otorisasi:** Seluruh endpoint di modul ini dilindungi di tingkat router menggunakan `authMiddleware` dan `authorize('ADMIN')`.

### 7.1 Menampilkan Seluruh Pengelola Kolam
* **Endpoint:** `GET /api/pool-managers`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **Query Params:** `?locationId=a898fd3b-7fee-4479-b5f7-19624b25d614` *(opsional, untuk filter spesifik kolam)*

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
      "fullName": "Ahmad Subarjo",
      "email": "ahmad.subarjo@poolmanager.com",
      "phone": "081234567890",
      "role": "POOL_MANAGER",
      "isVerified": true,
      "isActive": true,
      "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
      "location": {
        "name": "Kolam Renang FitX Gym",
        "area": {
          "id": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
          "name": "Bintaro"
        }
      }
    }
  ]
}
```

**Contoh Response Gagal (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Akses ditolak. Token autentikasi tidak ditemukan."
}
```

**Contoh Response Gagal (403 Forbidden):**
```json
{
  "success": false,
  "message": "Hak akses ditolak. Anda tidak memiliki izin untuk tindakan ini."
}
```

---

### 7.2 Menampilkan Detail Pengelola Kolam Berdasarkan ID
* **Endpoint:** `GET /api/pool-managers/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
    "fullName": "Ahmad Subarjo",
    "email": "ahmad.subarjo@poolmanager.com",
    "phone": "081234567890",
    "role": "POOL_MANAGER",
    "isVerified": true,
    "isActive": true,
    "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
    "location": {
      "name": "Kolam Renang FitX Gym",
      "area": {
        "id": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
        "name": "Bintaro"
      }
    }
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Manager kolam renang tidak ditemukan."
}
```

---

### 7.3 Tambah Pengelola Kolam Baru
* **Endpoint:** `POST /api/pool-managers`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "fullName": "Ahmad Subarjo",
  "email": "ahmad.subarjo@poolmanager.com",
  "password": "password123",
  "phone": "081234567890",
  "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
  "isActive": true
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Manager kolam renang berhasil ditambahkan.",
  "data": {
    "id": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
    "fullName": "Ahmad Subarjo",
    "email": "ahmad.subarjo@poolmanager.com",
    "phone": "081234567890",
    "role": "POOL_MANAGER",
    "isVerified": true,
    "isActive": true,
    "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
    "location": {
      "name": "Kolam Renang FitX Gym",
      "area": {
        "id": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
        "name": "Bintaro"
      }
    }
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar."
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Lokasi kolam renang tidak ditemukan."
}
```

---

### 7.4 Perbarui Data Pengelola Kolam
* **Endpoint:** `PUT /api/pool-managers/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **URL Path Params:** `id` (string, UUID)
- **Request Body JSON:**
```json
{
  "fullName": "Ahmad Subarjo M.Pd",
  "phone": "081298765432"
}
```

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Data manager kolam renang berhasil diperbarui.",
  "data": {
    "id": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
    "fullName": "Ahmad Subarjo M.Pd",
    "email": "ahmad.subarjo@poolmanager.com",
    "phone": "081298765432",
    "role": "POOL_MANAGER",
    "isVerified": true,
    "isActive": true,
    "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
    "location": {
      "name": "Kolam Renang FitX Gym",
      "area": {
        "id": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
        "name": "Bintaro"
      }
    }
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Manager kolam renang tidak ditemukan."
}
```

---

### 7.5 Hapus Data Pengelola Kolam
* **Endpoint:** `DELETE /api/pool-managers/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "Manager kolam renang berhasil dihapus."
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Manager kolam renang tidak ditemukan."
}
```

---

## 8. Modul Instruktur (Instructors)

Modul ini menangani pencarian ketersediaan instruktur berdasarkan kuota jadwal murid (publik) serta portal manajemen guru bagi Super Admin dan Pool Manager.

### 8.1 Cek Ketersediaan Instruktur (Booking Flow)
* **Endpoint:** `GET /api/instructor/available`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Query Params:** `?locationId=a898fd3b-7fee-4479-b5f7-19624b25d614&dayOfWeek=Senin&sessionName=Sesi%201&packageType=REGULER`
  - `locationId` *(string, UUID, required)* - ID Lokasi kolam
  - `dayOfWeek` *(string, required)* - Hari mengajar (contoh: "Senin")
  - `sessionName` *(string, required)* - Nama sesi (contoh: "Sesi 1")
  - `packageType` *(enum: 'REGULER' | 'PRIVAT', optional, default: 'REGULER')* - Menentukan kapasitas maksimal (Privat = 1 murid, Reguler = 5 murid)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "instructorId": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
      "fullName": "Coach Bambang Pamungkas",
      "profilePictureUrl": "uploads/profiles/profilePicture-1718900000.jpg",
      "experience": "5 Tahun",
      "license": "Lisensi C FINA",
      "currentStudentCount": 2,
      "maxCapacity": 5
    }
  ]
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Location ID wajib diisi"
}
```

---

### 8.2 Daftar Instruktur untuk Dasbor Manajemen
* **Endpoint:** `GET /api/instructor/management`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`, `POOL_MANAGER`
*(Catatan: Pool Manager hanya akan menerima data instruktur yang terikat pada lokasi kolamnya).*

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **Query Params:** `?page=1&limit=10`
  - `page` *(number, optional, default: 1)*
  - `limit` *(number, optional, default: 10, max: 100)*

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
      "fullName": "Coach Bambang Pamungkas",
      "phone": "081345678901",
      "profilePictureUrl": "uploads/profiles/profilePicture-1718900000.jpg",
      "isActive": true
    }
  ],
  "pagination": {
    "totalItems": 15,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 10
  }
}
```

**Contoh Response Gagal (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Akses ditolak. Token autentikasi tidak ditemukan."
}
```

**Contoh Response Gagal (403 Forbidden):**
```json
{
  "success": false,
  "message": "Hak akses ditolak. Anda tidak memiliki izin untuk tindakan ini."
}
```

---

### 8.3 Detail Profil Instruktur untuk Dasbor Manajemen
* **Endpoint:** `GET /api/instructor/management/:id`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `ADMIN`, `POOL_MANAGER`

**Contoh Request:**
- **Headers:** `Authorization: Bearer <access_token>`
- **URL Path Params:** `id` (string, UUID)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
    "fullName": "Coach Bambang Pamungkas",
    "email": "coach.bambang@example.com",
    "phone": "081345678901",
    "profilePictureUrl": "uploads/profiles/profilePicture-1718900000.jpg",
    "isActive": true,
    "isVerified": true,
    "instructorProfile": {
      "id": "f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c",
      "shortBio": "Pelatih renang berpengalaman spesialis gaya dada dan bebas.",
      "license": "Lisensi C FINA",
      "experience": "5 Tahun",
      "locations": [
        {
          "id": "a898fd3b-7fee-4479-b5f7-19624b25d614",
          "name": "Kolam Renang FitX Gym",
          "area": {
            "id": "e4f8a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b",
            "name": "Bintaro"
          }
        }
      ]
    }
  }
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Data guru tidak ditemukan."
}
```

---

## 9. Modul Unggah File (File Uploads)

Modul ini menangani upload file statis secara lokal menggunakan Multer sebelum data pendaftaran di-submit ke sistem.

* **Batas Maksimal Ukuran File:** 5 MB
* **Format Gambar yang Diizinkan:** JPG, JPEG, PNG, WEBP
* **Format Dokumen CV yang Diizinkan:** PDF

### 9.1 Upload Foto Profil Siswa
* **Endpoint:** `POST /api/upload-file/student/profil`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data (multipart):**
  - `profilePicture`: `[Binary Image File]`

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "upload profile berhasil.",
  "data": {
    "profilePictureUrl": "uploads/profiles/profilePicture-1718900000-987654321.jpg"
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Format file harus berupa gambar (JPG, JPEG, PNG, WEBP)"
}
```

---

### 9.2 Upload Bukti Pembayaran Siswa
* **Endpoint:** `POST /api/upload-file/student/payment`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data (multipart):**
  - `profilePicture`: `[Binary Image File Bukti Bayar]`

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "File berhasil diunggah."
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Ukuran file terlalu besar. Maksimal 5 MB."
}
```

---

### 9.3 Upload Dokumen Pelatih (CV & Foto)
* **Endpoint:** `POST /api/upload-file/instructor`
* **Authentikasi:** Tidak Butuh
* **Otorisasi Role:** `PUBLIC`

**Contoh Request:**
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data (multipart):**
  - `cv`: `[Binary PDF File]` (Wajib PDF)
  - `profilePicture`: `[Binary Image File]` (Wajib Gambar)
  - `paymentProof`: `[Binary Image File]` (Opsional)

**Contoh Response Sukses (200 OK):**
```json
{
  "success": true,
  "message": "File berhasil diunggah."
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Format CV harus berupa PDF"
}
```

---

## 10. Modul Pendaftaran & Booking (Registrations)

Modul ini menangani submit formulir pendaftaran siswa baru (booking kelas) serta pendaftaran pelatih baru. Kedua endpoint ini memproses data secara atomic menggunakan database transaction (Prisma `$transaction`).

### 10.1 Pendaftaran Murid Baru (Booking Kelas)
* **Endpoint:** `POST /api/register/student`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `STUDENT` (atau pengguna terautentikasi yang baru diverifikasi)

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "profilePictureUrl": "uploads/profiles/profilePicture-1718900000.jpg",
  "fullName": "Dimas Maulana",
  "birthPlace": "Tangerang",
  "birthDate": "2012-05-15",
  "gender": "Laki-Laki",
  "address": "Jl. Melati No. 12, Bintaro",
  "phone": "081234567890",
  "email": "dimas.maulana@example.com",
  "schoolOrOffice": "SD Bintaro 01",
  "tshirtSize": "M",
  "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
  "packageId": "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
  "firstMeetDate": "2026-11-01",
  "firstMeetSession": "Sesi 1",
  "instructorId": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
  "paymentMethod": "BANK_TRANSFER",
  "paymentProofUrl": "uploads/payments/paymentProof-1718900000.jpg"
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Pendaftaran berhasil. Silakan tunggu verifikasi admin.",
  "data": {
    "registrationId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "userId": "c7a8b9d0-1234-5678-90ab-cdef12345678",
    "status": "PENDING"
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar sebagai murid aktif."
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Instruktur tidak ditemukan"
}
```

---

### 10.2 Pendaftaran Instruktur Baru (Deklarasi Jadwal)
* **Endpoint:** `POST /api/register/instructor`
* **Authentikasi:** Membutuhkan Token
* **Otorisasi Role:** `INSTRUCTOR` (atau pengguna terautentikasi yang mendaftar menjadi instruktur)

**Contoh Request:**
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Request Body JSON:**
```json
{
  "fullName": "Coach Bambang Pamungkas",
  "phone": "081345678901",
  "birthDate": "1995-08-20",
  "gender": "Laki-Laki",
  "address": "Jl. Renang Indah No. 5, Tangerang Selatan",
  "shortBio": "Instruktur renang bersertifikat nasional dengan pengalaman 5 tahun melatih anak dan dewasa.",
  "license": "Lisensi C FINA",
  "experience": "5 Tahun",
  "schedules": [
    {
      "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
      "dayOfWeek": "Senin",
      "sessionName": "Sesi 1"
    },
    {
      "locationId": "a898fd3b-7fee-4479-b5f7-19624b25d614",
      "dayOfWeek": "Rabu",
      "sessionName": "Sesi 2"
    }
  ],
  "profilePictureUrl": "uploads/profiles/profilePicture-1718900000.jpg",
  "cvUrl": "uploads/cvs/cv-1718900000.pdf"
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "success": true,
  "message": "Pendaftaran instruktur dan deklarasi jadwal berhasil disimpan. Menunggu verifikasi admin.",
  "data": {
    "registrationId": "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
    "fullName": "Coach Bambang Pamungkas",
    "phone": "081345678901",
    "totalSchedulesCreated": 2,
    "status": "PENDING"
  }
}
```

**Contoh Response Gagal (400 Bad Request):**
```json
{
  "success": false,
  "message": "Anda sudah mendaftar sebagai instruktur."
}
```

**Contoh Response Gagal (404 Not Found):**
```json
{
  "success": false,
  "message": "Salah satu atau lebih lokasi kolam yang dipilih tidak ditemukan."
}
```

---

## 11. Matriks Otorisasi Endpoint (Cheat Sheet)

| Endpoint | Method | Autentikasi | Role Diizinkan | Deskripsi Singkat |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Tidak Butuh | `PUBLIC` | Pendaftaran akun awal & kirim OTP |
| `/api/auth/verify-otp` | `POST` | Tidak Butuh | `PUBLIC` | Verifikasi 6 digit OTP |
| `/api/auth/login` | `POST` | Tidak Butuh | `PUBLIC` | Login akun & terbitkan JWT / cookie |
| `/api/areas` | `GET` | Tidak Butuh | `PUBLIC` | Ambil semua area & jumlah kolam |
| `/api/areas/:id` | `GET` | Tidak Butuh | `PUBLIC` | Ambil detail 1 area beserta kolamnya |
| `/api/areas` | `POST` | Membutuhkan Token | `ADMIN` | Tambah master area baru |
| `/api/areas/:id` | `PUT` | Membutuhkan Token | `ADMIN` | Update master data area |
| `/api/areas/:id` | `DELETE` | Membutuhkan Token | `ADMIN` | Hapus area jika tidak ada relasi kolam |
| `/api/locations/public` | `GET` | Tidak Butuh | `PUBLIC` | Katalog kolam ringkas + harga Reguler |
| `/api/locations` | `GET` | Tidak Butuh | `PUBLIC` | Ambil semua lokasi kolam |
| `/api/locations/:id` | `GET` | Tidak Butuh | `PUBLIC` | Ambil detail satu kolam renang |
| `/api/locations` | `POST` | Membutuhkan Token | `ADMIN` | Tambah master lokasi kolam baru |
| `/api/locations/:id` | `PUT` | Membutuhkan Token | `ADMIN` | Update data lokasi kolam |
| `/api/locations/:id` | `DELETE` | Membutuhkan Token | `ADMIN` | Hapus lokasi kolam |
| `/api/packages` | `GET` | Tidak Butuh | `PUBLIC` | Ambil semua paket les renang |
| `/api/packages/:id` | `GET` | Tidak Butuh | `PUBLIC` | Ambil detail paket les renang |
| `/api/packages` | `POST` | Membutuhkan Token | `ADMIN` | Tambah master paket les baru |
| `/api/packages/:id` | `PUT` | Membutuhkan Token | `ADMIN` | Update paket les |
| `/api/packages/:id` | `DELETE` | Membutuhkan Token | `ADMIN` | Hapus paket les |
| `/api/sessions` | `GET` | Tidak Butuh | `PUBLIC` | Filter sesi berdasarkan lokasi & hari |
| `/api/sessions/:id` | `GET` | Tidak Butuh | `PUBLIC` | Ambil detail satu sesi jam |
| `/api/sessions` | `POST` | Membutuhkan Token | `ADMIN` | Tambah master sesi waktu |
| `/api/sessions/:id` | `PUT` | Membutuhkan Token | `ADMIN` | Update master sesi waktu |
| `/api/sessions/:id` | `DELETE` | Membutuhkan Token | `ADMIN` | Hapus master sesi waktu |
| `/api/pool-managers` | `GET` | Membutuhkan Token | `ADMIN` | Ambil daftar user Pool Manager |
| `/api/pool-managers/:id` | `GET` | Membutuhkan Token | `ADMIN` | Ambil detail user Pool Manager |
| `/api/pool-managers` | `POST` | Membutuhkan Token | `ADMIN` | Daftarkan user Pool Manager baru |
| `/api/pool-managers/:id` | `PUT` | Membutuhkan Token | `ADMIN` | Update data Pool Manager |
| `/api/pool-managers/:id` | `DELETE` | Membutuhkan Token | `ADMIN` | Hapus user Pool Manager |
| `/api/instructor/available` | `GET` | Tidak Butuh | `PUBLIC` | Cek ketersediaan guru & kapasitas |
| `/api/instructor/management` | `GET` | Membutuhkan Token | `ADMIN`, `POOL_MANAGER` | Daftar guru untuk CMS dasbor |
| `/api/instructor/management/:id`| `GET` | Membutuhkan Token | `ADMIN`, `POOL_MANAGER` | Detail profil instruktur untuk CMS |
| `/api/upload-file/student/profil`| `POST` | Tidak Butuh | `PUBLIC` | Upload gambar foto profil siswa |
| `/api/upload-file/student/payment`| `POST` | Tidak Butuh | `PUBLIC` | Upload gambar bukti transfer/bayar |
| `/api/upload-file/instructor`| `POST` | Tidak Butuh | `PUBLIC` | Upload PDF CV dan foto instruktur |
| `/api/register/student` | `POST` | Membutuhkan Token | `STUDENT` | Submit formulir booking pendaftaran murid |
| `/api/register/instructor` | `POST` | Membutuhkan Token | `INSTRUCTOR` | Submit formulir & jadwal pelatih baru |
