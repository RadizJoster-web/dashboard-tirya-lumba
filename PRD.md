# Frontend Dasbor Manajemen PRD — PT Tirya Lumba
## Dokumen Kebutuhan Produk & Arsitektur Teknis Dasbor Operasional

> **Status:** Resmi — Versi 2.1  
> **Framework:** React 19, Vite (SPA), TypeScript, Tailwind CSS, SWR / Custom Hook `useResource`  
> **Port Standar:** 5173  
> **Batasan Kode:** Maksimal 150 baris per file `.ts` / `.tsx`

---

## 1. Lingkup Modul & Antarmuka

1. **Autentikasi & Scoping RBAC:**
   - `SUPER_ADMIN`: Akses penuh lintas cabang dan manajemen global.
   - `POOL_MANAGER`: Scoped ke lokasi kolam renang yang ditugaskan (`locationId`).
2. **Monitoring Kapasitas Kolam & Alokasi Pelatih (Fitur Baru):**
   - **Header Metrik Global:** Ringkasan total pelatih aktif dan murid aktif di seluruh kolam.
   - **Katalog Kolam Renang (Grid Card):** Menampilkan kartu seluruh kolam renang (foto, nama, badge BUKA/TUTUP pendaftaran pelatih, rasio pelatih & murid).
   - **Drill-Down View Kolam:**
     - Toggle switch real-time buka/tutup pendaftaran pelatih (`isCoachRegistrationOpen`).
     - Metrik spesifik kolam.
     - Accordion pelatih dengan badge counter jumlah murid aktif.
     - Sub-list daftar murid binaan per pelatih (nama, paket, tanggal mulai, status aktif).
3. **Manajemen Kolam Renang Mitra (`/lokasi`):**
   - Tambah, edit, dan hapus kolam renang beserta foto visual kolam (`imageUrl`) yang tersimpan di Cloudflare R2 folder `locations/`.
4. **Verifikasi Pendaftaran (`/pendaftaran`):**
   - Meninjau berkas pendaftaran murid dan pelatih (pas foto, bukti bayar, dokumen CV PDF).
   - Aksi Setujui (*Approve*) atau Tolak (*Reject*).
5. **Pencatatan Presensi Kehadiran (`/absensi`):**
   - Pencatatan kehadiran harian siswa per sesi latihan di kolam renang. Pengurangan otomatis kuota sesi (`activeSessions`).

---

## 2. Strategi Pengambilan Data & Cache Management

- **Vercel Proxy Rewrite:** Seluruh request API diarahkan via Vercel Edge Proxy (`/api/*`).
- **Revalidate-on-Mount:** Hook `useResource` selalu memicu fresh fetch saat halaman dibuka.
- **Auto Cache Invalidation:** Setiap eksekusi mutasi (`POST`, `PUT`, `DELETE` via `apiSend`) otomatis memicu pembaruan state lokal sehingga data di tabel dan kartu langsung segar seketika.
