# Benkyou Lab Blog

Blog berita dan info Jepang — kabar terkini, JLPT, MEXT, beasiswa, budaya, kehidupan sehari-hari, dan bahasa. Ditulis ringkas, jernih, dan gratis.

## Live
- **Produksi:** https://benkyoulab-blog.vercel.app
- **Lokal dev:** http://localhost:3000 (`npm run dev`)

## Stack
- **Next.js 16** (App Router, route group `(public)`, Server Components default)
- **Supabase Postgres** (transaction pooler :6543 untuk runtime, session :5432 untuk tooling)
- **Drizzle ORM** + `drizzle-kit`
- **Auth.js v5** (JWT, Credentials provider, guard berlapis)
- **Tiptap v3** editor + `sanitize-html` allowlist
- **Tailwind CSS v4** + `@tailwindcss/typography` + `motion` (Framer Motion successor)
- **GSAP** + `@gsap/react` untuk entrance dan route transitions; **Lenis** untuk smooth scrolling
- **Vercel** untuk build & deploy

## Struktur Direktori
```
src/
├── app/
│   ├── (public)/           # publik: layout dgn header/footer/animasi
│   │   ├── page.tsx        # beranda (hero carousel + search/filter + grid artikel)
│   │   ├── artikel/[slug]/ # detail artikel + reading progress + related
│   │   ├── kategori/       # indeks kategori + per-kategori
│   │   └── tentang/        # halaman about
│   ├── admin/              # dashboard penulis (guarded)
│   ├── api/auth/[...nextauth]/
│   ├── login/              # halaman login
│   ├── error.tsx, not-found.tsx, robots.ts, sitemap.ts
│   └── layout.tsx          # root layout + script anti-flash tema
├── components/             # site-header, featured-carousel, article-filters,
│                           # site-footer, post-card, safe-img, motion-provider,
│                           # fade-in, gsap-shell, theme-toggle, editor/
├── db/                     # schema Drizzle + client (postgres-js)
├── lib/                    # format-date, sanitize, slug, validators, guards, cache refresh
├── auth.ts                 # NextAuth config (Credentials + JWT + role)
├── proxy.ts                # guard /admin/* (sebelumnya middleware.ts)
└── types/next-auth.d.ts    # augmentasi session.user.role
```

## Hardening produksi terkini
- Rate limiting login per email: 5 percobaan dalam 15 menit, lalu blok otomatis dengan retry-after.
- Guard auth berlapis di layout admin dan halaman sensitif untuk mencegah akses yang tidak terautentikasi.
- Sistem ownership guard: writer hanya dapat mengelola artikel miliknya sendiri, admin memiliki akses penuh.
- Cache invalidation dipusatkan agar halaman publik segar setelah create/update/delete artikel atau kategori.
- Regression tests mencakup rate limit, auth guard, dan cache refresh.

### Validator aktif
- `npx tsx --test src/lib/auth-rate-limit.test.ts src/lib/auth-guards.test.ts src/lib/cache-refresh.test.ts`
- `npx tsc --noEmit --pretty false`

## Setup Lokal
1. Clone: `git clone https://github.com/benkyoulab/benkyoulab-blog.git`
2. Install: `npm install`
3. Salin `.env.example` ke `.env.local` dan isi:
   ```
   DATABASE_URL="postgresql://postgres.<project>:***@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"
   AUTH_SECRET="..."           # openssl rand -base64 32
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```
4. Sinkron schema: `npx drizzle-kit push` (override `DRIZZLY_URL` ke :5432)
5. Seed admin: `node --env-file=.env.local scripts/seed-admin.mjs`
6. Seed artikel: `node --env-file=.env.local scripts/seed-artikel.mjs` (idempotent)
7. Jalankan: `npm run dev`

Seeder data awal: `node --env-file=.env.local scripts/seed-artikel.mjs`. Seeder idempotent, menambahkan rubrik editorial dan 10 artikel info Jepang dengan thumbnail URL eksternal.

Update konten editorial: `node --env-file=.env.local scripts/update-editorial-news.mjs`. Script ini mempertahankan slug/URL, memperbarui seluruh 19 artikel ke topik berita/info Jepang, menambahkan rujukan resmi, dan memastikan setiap artikel memiliki thumbnail URL HTTPS.

> ⚠️ Pada Windows / drive exFAT, build langsung dapat gagal karena problem filesystem junction/readlink. Gunakan `npm run build`, yang menyalin source ke direktori temporary lalu menjalankan build webpack secara aman.

## Skrip
| Script | Tujuan |
|---|---|
| `npm run dev` | Dev server (mode webpack) di :3000 |
| `npm run build` | Build produksi lewat Windows-safe wrapper; tetap dijalankan ulang oleh Vercel |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `node --env-file=.env.local scripts/test-slug.ts` | Unit test slug |
| `node --env-file=.env.local scripts/test-sanitize.ts` | Unit test sanitasi |
| `node --env-file=.env.local scripts/test-public.mjs` | E2E publik (9 skenario) |

Homepage menyediakan pencarian realtime berdasarkan judul, excerpt, dan isi artikel. Filter rubrik serta urutan terbaru, terlama, dan judul A-Z mengubah URL sehingga hasil dapat dibagikan.

Motion publik memakai GSAP + Lenis melalui `components/gsap-shell.tsx`: smooth scrolling, reveal saat route berubah, dan cleanup otomatis. Animasi dinonaktifkan otomatis saat browser mengaktifkan `prefers-reduced-motion`. Prinsip anti-AI-slop dan interaction thesis mengacu pada [genjutsu](https://github.com/AThevon/genjutsu), bukan sebagai dependency runtime.

## Deployment (Vercel)
1. Import repo `benkyoulab/benkyoulab-blog` di Vercel
2. Set environment variables (lihat Setup Lokal #3) — **password harus URL-encoded `=` jadi `%3D`, `@` jadi `%40`**
3. Push ke `main` → deploy otomatis

> ⚠️ Pada Windows / drive exFAT, `next build` dapat gagal karena problem filesystem junction/readlink. Gunakan `npm run build` yang sekarang memakai script aman di `scripts/build-safe.mjs` untuk bypass issue lokal. Build final tetap disarankan dijalankan di Vercel/Linux.

## SOP Operasional
- [docs/05-operasional-sop.md](docs/05-operasional-sop.md) — deploy, rollback, backup, dan recovery
- [docs/production-checklist.md](docs/production-checklist.md) — checklist kesiapan produksi

Quality gate terakhir (2026-08-31): `npm run lint`, `npm run typecheck`, `npm run test`, dan `npm run build` berhasil. Build lokal masih menampilkan warning non-blocking dari Next.js tentang `outputFileTracingRoot` pada workspace Windows; hasil build tetap sukses.

## Akses Admin
URL langsung (tidak ada link dari halaman publik):
- Login: `https://benkyoulab-blog.vercel.app/login`
- Dashboard: `https://benkyoulab-blog.vercel.app/admin`

**Kredensial default** (ganti setelah login pertama!):
- Email: `admin@benkyoulab.online`
- Password: `password`

Guard berlapis: `proxy.ts` middleware + `auth()` di setiap server action + cek role di layout admin.

## Troubleshooting
| Masalah | Solusi |
|---|---|
| `next build` crash lokal (panic junction / EISDIR) | Jalankan `npm run build` agar memakai Windows-safe wrapper; Vercel tetap menjalankan build production di Linux |
| `drizzle-kit push` hang lewat :6543 | Set `DRIZZLY_URL` ke session pooler :5432 |
| Login "Email atau password salah" padahal DB sudah benar | Coba incognito, hindari autofill; cek `AUTH_SECRET` di Vercel env sama dgn lokal |
| DB Supabase tidur (>7 hari idle) | Buka dashboard Supabase untuk wake up |
|| `/login` 500 (server component crash) | Jangan pernah `import { getCsrfToken } from "next-auth/react"` di **server component** — itu Client Component (`"use client"`); import-nya crash SSR. Solusi: `signIn("credentials")` otomatis handle CSRF via cookie. Jika butuh CSRF token, fetch via absolute URL (relatif `fetch("/api/...")` **gagal** di serverless: "Failed to parse URL"). |
|| `/admin/artikel` 500 — `Failed to parse URL from /api/auth/csrf` | Sama seperti di atas: hapus fetch relatif, gunakan `signIn` langsung, atau absolute URL `${process.env.NEXT_PUBLIC_APP_URL}/api/...`. |
|| Debug endpoint masih tersisa | Hapus semua route di `src/app/api/debug-*/` sebelum deploy production.|

## Lisensi
Konten artikel: CC BY-NC 4.0. Kode: MIT.