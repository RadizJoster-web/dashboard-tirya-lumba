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
