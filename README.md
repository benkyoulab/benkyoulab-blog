# Benkyou Lab Blog

Blog materi bahasa Jepang — kanji, tata bahasa, kosakata, dan tips belajar JLPT. Ditulis ringkas, praktis, dan gratis.

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
- **Vercel** untuk build & deploy

## Struktur Direktori
```
src/
├── app/
│   ├── (public)/           # publik: layout dgn header/footer/animasi
│   │   ├── page.tsx        # beranda (hero + statistik + grid artikel)
│   │   ├── artikel/[slug]/ # detail artikel + reading progress + related
│   │   ├── kategori/       # indeks kategori + per-kategori
│   │   └── tentang/        # halaman about
│   ├── admin/              # dashboard penulis (guarded)
│   ├── api/auth/[...nextauth]/
│   ├── login/              # halaman login
│   ├── error.tsx, not-found.tsx, robots.ts, sitemap.ts
│   └── layout.tsx          # root layout + script anti-flash tema
├── components/             # site-header, site-footer, post-card, kanji-float,
│                           # safe-img, motion-provider, fade-in, theme-toggle, editor/
├── db/                     # schema Drizzle + client (postgres-js)
├── lib/                    # format-date, sanitize, slug, validators
├── auth.ts                 # NextAuth config (Credentials + JWT + role)
├── proxy.ts                # guard /admin/* (sebelumnya middleware.ts)
└── types/next-auth.d.ts    # augmentasi session.user.role
```

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

> ⚠️ **`next build` lokal GAGAL di drive exFAT** (panic junction Turbopack / EISDIR webpack). Lokal cukup `npm run dev`; build produksi di Vercel (Linux). Scripts sudah pakai `--webpack` supaya dev juga aman.

## Skrip
| Script | Tujuan |
|---|---|
| `npm run dev` | Dev server (mode webpack) di :3000 |
| `npm run build` | Build produksi — **hanya jalan di Vercel** |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `node --env-file=.env.local scripts/test-slug.ts` | Unit test slug |
| `node --env-file=.env.local scripts/test-sanitize.ts` | Unit test sanitasi |
| `node --env-file=.env.local scripts/test-public.mjs` | E2E publik (9 skenario) |

## Deployment (Vercel)
1. Import repo `benkyoulab/benkyoulab-blog` di Vercel
2. Set environment variables (lihat Setup Lokal #3) — **password harus URL-encoded `=` jadi `%3D`, `@` jadi `%40`**
3. Push ke `main` → deploy otomatis

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
| `next build` crash lokal (panic junction / EISDIR) | Wajar di exFAT; push ke Vercel untuk build |
| `drizzle-kit push` hang lewat :6543 | Set `DRIZZLY_URL` ke session pooler :5432 |
| Login "Email atau password salah" padahal DB sudah benar | Coba incognito, hindari autofill; cek `AUTH_SECRET` di Vercel env sama dgn lokal |
| DB Supabase tidur (>7 hari idle) | Buka dashboard Supabase untuk wake up |

## Lisensi
Konten artikel: CC BY-NC 4.0. Kode: MIT.