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
- `src/lib/auth.ts` — `authenticate()` tries `POST /auth/login` for email input, then falls back to demo accounts (`admin`/`admin123`, `pengelola`/`kolam123`). Only `ADMIN`/`POOL_MANAGER` may enter. Not documented: `logout`, `/auth/me`.
- `src/lib/api-sync.ts` — `useApiSync()` (called in `Shell`) pulls `/areas`, `/locations`, `/packages`, `/instructor/management`, `/pool-managers` and hydrates the local store; failed calls keep demo rows. Connection state lives in `src/lib/api-mode.ts` and shows as a pill in the topbar.
- **sonner terpasang**: `<Toaster />` dipasang di `App.tsx` (top-right). Setiap sukses → `toast.success`, gagal → `toast.error` warna `#B3341F`. Jangan tambahkan banner `notice` inline — pakai toast.
- **Logo**: `public/logo.svg` (asli, 442 path, hasil VTracer — punya `viewBox`), `public/logo-mark.svg` (subset 11 shape besar, dibuat `scripts/logo-mark.mjs`; jalankan ulang bila logo berganti). Komponen `src/components/BrandLogo.tsx` dipakai di sidebar & tombol sidebar mengambang; Login memakai logo asli via `<img src="/logo.svg">`. Jangan kembalikan ke emoji 🐬.
- **Animasi**: keyframes `route-in`/`modal-in`/`fade-in` + class `anim-route`/`anim-modal`/`anim-overlay` di `src/index.css`, semua dalam `@media (prefers-reduced-motion: no-preference)`. `main` di Shell pakai `key={activePath} + anim-route`; Modal pakai `anim-overlay` + `anim-modal`.
- `src/lib/ref-data.ts` — raw master data dari server (locations/packages/instructors) untuk opsi `<select>`, diisi `api-sync.ts`.
- `src/lib/reg-options.ts` — opsi form pendaftaran (fallback demo bila server offline).
- `src/components/Stepper.tsx` + `src/pages/registrasi/FormMurid.tsx` / `FormPelatih.tsx` — wizard pendaftaran 3 langkah di tab `/pendaftaran` (Antrean • Form Murid • Form Pelatih, see `Pendaftaran.tsx`). Submit: `registerStudent`/`registerInstructor`, upload: `uploadFile` (multipart, 30s timeout, maks file 5 MB). catatan: endpoint `/api/register/*` di backend masih role STUDENT/INSTRUCTOR — minta backend menerima ADMIN/POOL_MANAGER (error 403 ditampilkan di toast).

- Endpoints missing from the docs (still demo-only): approve/reject registration, attendance, Overview statistics, admin avatar upload, profile, signup.

## Profil, SEO & Performa (Tahap C)

- **Profil** (`/profil`, menu grup "Akun", semua role): `src/pages/Profil.tsx`. Avatar demo-lokal (base64 di localStorage, key `tl_avatar`, maks 5 MB) karena endpoint profil/avatar admin belum ada di docs — jangan anggap live API.
- **SEO** di `index.html`: `lang="id"`, title/meta description, favicon + OG image `=/logo-mark.svg`, Open Graph/twitter card, `preconnect` Google Fonts.
- **Performa**: semua rute halaman lazy (`React.lazy` + `Suspense` di `src/components/Shell.tsx` fallback `PageFallback`, anim-route tetap kunci mount). Riwayat Absensi admin dibatasi 50 baris + tombol "Tampilkan semua". Jangan kembalikan ke import statis halaman di Shell.

## TypeScript strictness (`tsconfig.app.json`)

- `verbatimModuleSyntax`: use `import type { X }` for type-only imports.
- `erasableSyntaxOnly`: no enums, namespaces, or parameter properties.
- `noUnusedLocals`, `noUnusedParameters`: fail build on dead code — clean up imports/args.
- `moduleDetection: force`, `moduleResolution: bundler`, `jsx: react-jsx`.

## Tailwind v4

- Wired via `@tailwindcss/vite` in `vite.config.ts`; entry is `src/index.css` (`@import 'tailwindcss';`).
- No `tailwind.config.*` — use utility classes in `className` directly.

## Planned (not yet installed)

`README.md` specifies the target stack — React Router DOM (protected routes for Admin Pusat vs Pengelola Kolam), TanStack Query v5 (server state), Zustand (UI state: sidebar, theme, user). Installed: Zustand (`src/lib/ui-store.ts`, sidebar) and lucide-react (sidebar icons). React Router DOM and TanStack Query are not yet in `package.json`. `npm install` them before building those features; don't assume the imports exist.
