Arsitektur Frontend 2: Dashboard Admin
PT Tirya Lumba
Spesifikasi teknis, pedoman arsitektur, dan instruksi implementasi sistem untuk portal
internal Dasbor Admin dan Pengelola Kolam PT Tirya Lumba.

1. Ringkasan Sistem
   Frontend 2 adalah dasbor internal (Content Management System / CMS) yang digunakan
   untuk mengelola data bisnis PT Tirya Lumba. Aplikasi ini dibangun sebagai Single Page
   Application (SPA) untuk memberikan interaksi yang sangat cepat (fluid) tanpa memuat ulang
   halaman. Dasbor ini memiliki dua peran utama (Role-Based Access Control): Admin Pusat
   (akses penuh) dan Pengelola Kolam (akses terbatas pada kolam masing-masing).
2. Teknologi Utama
   ● Teknologi Inti: React 18, TypeScript, Vite (bundler ultra-cepat yang ringan untuk
   memori lokal).
   ● Routing: React Router DOM (konfigurasi berbasis rute terproteksi).
   ● State Management:
   ○ Server State: TanStack Query v5 (pengambilan data, caching, sinkronisasi API).
   ○ Client State: Zustand (menyimpan state global UI seperti sidebar toggle, tema,
   dan profil user yang sedang login).
   ● Styling & UI: Tailwind CSS (utility-first).
   ● Quality Tools: ESLint, Prettier, Husky.
