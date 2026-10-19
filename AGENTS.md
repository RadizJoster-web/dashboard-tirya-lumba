# AGENTS.md — dashboard-tirya-lumba

Vite + React 19 + TypeScript + Tailwind CSS v4 single-package app. All source in `src/` (currently scaffold only: `main.tsx`, `App.tsx`, `index.css`).

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` |
| Build (typechecks) | `npm run build` — runs `tsc -b && vite build` |
| Lint | `npm run lint` |
| Preview build | `npm run preview` |

No test runner, CI, or `.env` configured. Verify with `npm run lint && npm run build`.

## Backend integration

- REST base URL: `VITE_API_URL` (see `.env.example`), default `http://localhost:5000/api`. Contract in `API_DOCUMENTATION.md`.
- `src/lib/api.ts` — fetch wrapper (`apiGet`/`apiSend`), `ApiError`, JWT in `localStorage`/`sessionStorage` under `tl_jwt`, 8s timeout, sends `Authorization: Bearer` and `credentials: include`.
- `src/lib/api-types.ts` — server DTOs. Note the server model differs from the local demo shapes (locations use `{name, category, mapUrl, areaId}`, no address/coordinate fields).
- `src/lib/auth.ts` — `authenticate()` hanya memanggil `POST /auth/login` dengan email + password server; tidak ada akun demo. Hanya `ADMIN`/`POOL_MANAGER` yang boleh masuk. Not documented: `logout`, `/auth/me`.
- `src/lib/data-cache.ts` — cache data per key (`useResource`, `loadResource`, `refreshResource`, `clearResources`). Request hanya terjadi saat resource pertama kali dipakai atau di-`reload()` setelah mutasi; tidak ada refetch saat pindah route/tab. Pakai `useResource(API_KEYS.x, fetchX)` dari `src/lib/api-sync.ts`.
- `src/lib/api-sync.ts` — `useBootstrapData()` (dipanggil sekali di `Shell`) memuat `/areas`, `/locations`, `/packages`, `/instructor/management`, `/pool-managers` ke cache. `GET /sessions` wajib `locationId` + `dayOfWeek`, jadi `fetchSessionsForLocation()` menggabungkan 7 request harian dan menyimpannya per lokasi (`sessionsKey`). Tidak ada fallback data demo; kegagalan ditampilkan sebagai empty/error state.
- **sonner terpasang**: `<Toaster />` dipasang di `App.tsx` (top-right). Setiap sukses → `toast.success`, gagal → `toast.error` warna `#B3341F`. Jangan tambahkan banner `notice` inline — pakai toast.
- **Logo**: `public/logo.svg` (asli, 442 path, hasil VTracer — punya `viewBox`), `public/logo-mark.svg` (subset 11 shape besar, dibuat `scripts/logo-mark.mjs`; jalankan ulang bila logo berganti). Komponen `src/components/BrandLogo.tsx` dipakai di sidebar & tombol sidebar mengambang; Login memakai logo asli via `<img src="/logo.svg">`. Jangan kembalikan ke emoji 🐬.
- **Animasi**: keyframes `route-in`/`modal-in`/`fade-in` + class `anim-route`/`anim-modal`/`anim-overlay` di `src/index.css`, semua dalam `@media (prefers-reduced-motion: no-preference)`. `main` di Shell memakai `anim-route` tanpa `key` per path agar halaman tidak remount; Modal pakai `anim-overlay` + `anim-modal`.
- `src/lib/use-debounced.ts` — `useDebouncedValue` untuk search Siswa/Pelatih (300 ms).
- `src/components/StatusBadge.tsx` — badge status aktif/non-aktif yang dipakai Siswa/Pelatih.
- `/pendaftaran` hanya berisi antrean approve/reject; wizard Form Murid/Form Pelatih sudah dihapus. Endpoint approve/reject tetap belum ada di docs sehingga masih memakai `src/lib/store.ts`.

- Endpoints missing from the docs (still local-only): approve/reject registration, attendance, Overview statistics, profile, signup, `GET /siswa`.
- `POST /packages` docs baru menunjukkan `Reguler`/`Privat`; UI mengirim juga `Atlit`/`Beasiswa` sesuai revisi, kegagalan validasi backend ditampilkan lewat toast.

## Profil, SEO & Performa (Tahap C)

- **Profil** (`/profil`, menu grup "Akun", semua role): `src/pages/Profil.tsx`. Hanya menampilkan data akun; tidak ada ganti avatar karena endpoint avatar admin belum ada di docs.
- **SEO** di `index.html`: `lang="id"`, title/meta description, favicon + OG image `=/logo-mark.svg`, Open Graph/twitter card, `preconnect` Google Fonts.
- **Performa**: semua rute halaman lazy (`React.lazy` + `Suspense` di `src/components/Shell.tsx` fallback `PageFallback`), data server di-cache `data-cache.ts` sehingga pindah route tidak memicu request ulang. Riwayat Absensi admin dibatasi 50 baris + tombol "Tampilkan semua". Jangan kembalikan ke import statis halaman di Shell.

## TypeScript strictness (`tsconfig.app.json`)

- `verbatimModuleSyntax`: use `import type { X }` for type-only imports.
- `erasableSyntaxOnly`: no enums, namespaces, or parameter properties.
- `noUnusedLocals`, `noUnusedParameters`: fail build on dead code — clean up imports/args.
- `moduleDetection: force`, `moduleResolution: bundler`, `jsx: react-jsx`.

## Tailwind v4

- Wired via `@tailwindcss/vite` in `vite.config.ts`; entry is `src/index.css` (`@import 'tailwindcss';`).
- No `tailwind.config.*` — use utility classes in `className` directly.

## Stack terpasang

React Router DOM (HashRouter + protected route di `App.tsx`), Zustand (`src/lib/ui-store.ts`, sidebar), lucide-react, sonner. Server state memakai `src/lib/data-cache.ts` + `fetch` (`src/lib/api.ts`); **jangan tambahkan `@tanstack/react-query`** — paket sudah dilepas agar tidak refetch saat pindah tab/route.
