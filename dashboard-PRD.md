# Frontend 2 PRD — Dasbor Manajemen Admin & Pengelola (`client/dashboard`)
## Spesifikasi Fungsional, Peran Hak Akses, Alur Antrean & Panduan Restyle

> **Tujuan Dokumen:**
> Dokumen ini adalah acuan mutlak bagi pengembang atau AI yang akan **merombak gaya desain antarmuka (UI/UX Styling)** pada aplikasi Dasbor Manajemen PT Tirya Lumba. Pastikan seluruh nama state, integrasi endpoint, batasan peran (*role scoping*), dan logika operasional tetap terjaga utuh.

---

## 1. Ikhtisar & Tumpukan Teknologi Frontend 2

- **Framework:** React 19, Vite, TypeScript.
- **Styling:** Tailwind CSS (v4).
- **Komponen & Utilitas UI:** Custom UI primitives (`Button`, `Card`, `DataTable`, `Modal`, `StatusBadge`, `Stat`, `RoleTag`), Sonner untuk toast notification.
- **Target Persona Pengguna:**
  1. Super Admin Pusat (`ADMIN`).
  2. Pengelola Kolam Renang Cabang (`POOL_MANAGER`).

---

## 2. Aturan Hak Akses & Scoping Wilayah Kolam

- **Super Admin (`ADMIN`):**
  - Mengakses data ringkasan seluruh cabang kolam renang tanpa batasan.
  - Menyetujui atau menolak pendaftaran murid dan pelatih baru.
  - Mengelola master data area, lokasi kolam, paket kelas, dan sesi jam.
  - Mengelola akun login pengelola kolam renang (`POOL_MANAGER`).
- **Pengelola Kolam (`POOL_MANAGER`):**
  - Data pada seluruh halaman (Overview, Pendaftaran, Siswa, dan Absensi) secara otomatis di-filter khusus untuk lokasi kolam renang miliknya (`currentUser.locationId`).
  - Hanya dapat menyetujui pendaftaran murid di kolam yang dikelolanya.
  - Dilarang mengakses menu master data global (Pengelola, Area, dll.).

---

## 3. Struktur Halaman & Fitur Dasbor

### 3.1 Halaman Overview (`/` — `src/pages/Overview`)
Pusat ringkasan statistik operasional kolam renang:
- **Pengambilan Data Terpusat:** Menarik data dari endpoint server `GET /api/dashboard/summary?year=YYYY&month=MM`.
- **Kontrol Filter:**
  - Pilihan Tahun: 2024, 2025, 2026, 2027.
  - Pilihan Bulan: *"Semua Bulan"* (Januari - Desember) atau bulan spesifik (1 - 12).
- **Statistik Utama (`OverviewStats.tsx`):**
  - **Total Siswa Aktif:** Jumlah murid dengan sisa sesi `activeSessions > 0`.
  - **Total Guru / Pelatih:** Jumlah instruktur aktif yang mengajar di kolam terkait.
  - **Total Pendaftar:** Total registrasi pada rentang waktu yang dipilih.
- **Grafik Batang (`OverviewChart.tsx`):**
  - Menampilkan tren pendaftaran bulanan (12 bulan) jika filter "Semua Bulan", atau mingguan (5 kelompok minggu) jika filter bulan spesifik dipilih.

---

### 3.2 Halaman Antrean Pendaftaran (`/pendaftaran` — `src/pages/Pendaftaran`)
Antarmuka verifikasi pendaftaran murid dan pelatih baru:
- **Daftar Antrean:** Mengambil data dari `GET /api/register?status=PENDING`.
- **Filter Tab:** Semua, Murid Baru (`NEW_STUDENT`), Pelatih Baru (`NEW_INSTRUCTOR`).
- **Tabel Pendaftaran:** Nama pendaftar, jenis pendaftaran, usia, kolam tujuan, tanggal submit, dan badge status `PENDING`.
- **Modal Detail Pendaftaran (`PendaftaranDetailModal.tsx`):**
  - Menampilkan biodata lengkap pendaftar.
  - Menampilkan dokumen lampiran (pas foto profil 4x6, bukti transfer pembayaran kursus, atau berkas CV pelatih).
- **Aksi Persetujuan (*Approve*):**
  - Menekan tombol *"Setujui Pendaftaran"* memanggil `POST /api/register/:id/approve`.
  - **Efek Sistem:** Pendaftaran berubah menjadi `APPROVED`, user diaktifkan dengan role `STUDENT`/`INSTRUCTOR`, dan murid diberikan kuota pertemuan sesuai paket (`sessionCount` antara 1 - 10 sesi).
- **Aksi Penolakan (*Reject*):**
  - Menekan tombol *"Tolak Pendaftaran"* membuka modal alasan penolakan (`PendaftaranRejectModal.tsx`).
  - Admin/Pengelola wajib menginput catatan alasan penolakan (`rejectionReason`).
  - Submit memanggil `POST /api/register/:id/reject`. Data pendaftaran tetap tersimpan di database agar user dapat mendaftar ulang tanpa kehilangan biodata.

---

### 3.3 Halaman Data Siswa (`/siswa` — `src/pages/Siswa`)
Manajemen murid yang telah disetujui:
- Mengambil daftar siswa dari `GET /api/siswa`.
- **Tabel Siswa:** Nama murid, usia, lokasi kolam renang, paket kelas, masa berlaku / sisa pertemuan, dan badge status keaktifan paket (`StatusBadge`).
- **Filter & Pencarian:** Input pencarian nama siswa secara instan (*debounced*) dan filter dropdown lokasi kolam.
- **Modal Detail Siswa (`SiswaDetailModal.tsx`):** Menampilkan rincian kesiswaan, foto profil, dan kontak telepon.

---

### 3.4 Halaman Data Pelatih (`/pelatih` — `src/pages/Pelatih`)
Manajemen instruktur renang aktif:
- Mengambil daftar instruktur dari `GET /api/instructor/management`.
- **Tabel Pelatih:** Foto, nama lengkap, lisensi, pengalaman mengajar, daftar lokasi kolam tempat mengajar, dan status keaktifan.
- **Modal Detail Pelatih (`PelatihDetailModal.tsx`):** Menampilkan biografi pelatih, rincian sertifikasi, dan tombol pratinjau dokumen CV PDF.

---

### 3.5 Halaman Absensi / Presensi (`/absensi` — `src/pages/Absensi`)
Modul operasional harian di lokasi kolam renang:
1. **Presensi Hari Ini:**
   - Mengambil daftar murid dan pelatih yang memiliki jadwal pada hari ini dari `GET /api/attendances/today`.
   - Menampilkan tabel dengan kolom: Peran (Murid / Pelatih), Nama, Lokasi Kolam, Jam Sesi, dan status kehadiran saat ini.
   - Pilihan radio toggle: **"Hadir"** vs **"Tidak Hadir"**.
2. **Penyimpanan Absensi:**
   - Menekan tombol *"Simpan Absensi"* mengirim data ke `POST /api/attendances`.
   - **Logika Database Transaksi:** Setiap murid yang dicatat *"Hadir"*, sisa sesi `activeSessions` di profil murid dikurangi 1.
   - **PENTING:** Jika `activeSessions` menjadi 0, akun user murid **TETAP AKTIF** (tidak diblokir) agar murid dapat melakukan pendaftaran ulang mandiri melalui website.
3. **Riwayat Presensi:**
   - Menampilkan tabel log historis seluruh absensi yang pernah tercatat di sistem.

---

### 3.6 Halaman Penjadwalan Kolam (`/jadwal` — `src/pages/Jadwal`)
- Matriks jadwal mingguan (Senin - Minggu) per lokasi kolam renang.
- **Template Sesi:** Generator template nama sesi, jam mulai, dan jam selesai.
- Mengaktifkan sesi dengan mencentang slot jadwal dan menyimpan ke database via `POST /api/sessions`.
- Modal melihat dan menghapus sesi yang tersimpan.

---

### 3.7 Halaman Master Lokasi & Wilayah (`/lokasi` — `src/pages/Lokasi`)
- **Master Area:** CRUD wilayah operasional (Tangerang Selatan, Kota Tangerang, Kab. Tangerang, dll.).
- **Master Lokasi Kolam:** CRUD kolam renang mitra (nama kolam, kategori kemitraan, tautan Google Maps koordinat).

---

### 3.8 Halaman Master Paket Kursus (`/paket` — `src/pages/Paket`)
- Mengatur harga paket kelas renang per lokasi kolam (Reguler, Privat, Prestasi, Ekskul).
- Menentukan jumlah sesi pertemuan per paket (`sessionCount` antara 1 hingga 10 pertemuan, default 4 pertemuan).

---

### 3.9 Halaman Manajemen Pengelola Kolam (`/pengelola` — `src/pages/Pengelola`)
- Khusus diakses oleh Super Admin (`ADMIN`).
- Mendaftarkan akun login baru dengan peran `POOL_MANAGER` yang diikatkan ke salah satu kolam renang (`locationId`).

---

## 4. Panduan Restyle UI untuk AI Berikutnya

### Hal yang BOLEH Dirombak:
- Desain visual tema modern dasbor (*sidebar layout, topbar, cards, modal dialogs, tables*).
- Palet warna badge status (`StatusBadge`), tag peran (`RoleTag`), tombol aksi, dan grafik batang (`OverviewChart`).
- Spasi, tipografi, padding, border-radius, dan micro-interactions hover.
- Penggunaan icon library atau ilustrasi empty state yang lebih segar.

### Hal yang DILARANG KERAS Diubah:
1. **Dilarang Menghilangkan Batasan Scoping Pool Manager:** Seluruh pemanggilan data pada Pengelola Kolam harus tetap dibatasi untuk kolam miliknya (`currentUser.locationId`).
2. **Dilarang Mengubah Logika Pengurangan Pertemuan Presensi:** Presensi "Hadir" harus tetap memicu pengurangan 1 kuota pertemuan tanpa menonaktifkan akun siswa ketika mencapai sesi 0.
3. **Dilarang Mengubah Kontrak Endpoint API & Payload:** Seluruh payload endpoint seperti `/api/dashboard/summary`, `/api/register/:id/approve`, `/api/register/:id/reject`, `/api/attendances`, dll. harus dipertahankan.
