# Benkyou Lab — Blog

Blog untuk materi belajar bahasa Jepang. Dibangun dengan Next.js + Supabase (PostgreSQL), dideploy di Vercel.

## Stack

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 16 (App Router, TypeScript) | Native Vercel, SSR/ISR, Turbopack default |
| Database | Supabase (PostgreSQL + Transaction Pooler) | Gratis tier cukup, dashboard & backup bawaan |
| ORM | Drizzle ORM | Ringan, cocok untuk serverless (cold start kecil) |
| Auth | Auth.js v5 (Credentials Provider) | Cukup untuk ≤10 user internal (admin/writer) |
| Text Editor | Tiptap (StarterKit + Link + Image) | WYSIWYG mudah dipakai, gambar via input URL |
| Styling | Tailwind CSS | Cepat, minim keputusan |

## Struktur Dokumen

```
benkyoulab/
├── README.md                      ← kamu di sini
└── docs/
    ├── 01-prd.md                  Product Requirements Document
    ├── 02-schema.sql              Skema database (tempel ke Supabase SQL Editor)
    ├── 03-implementation-plan.md  Rencana implementasi bertahap
    └── 04-design-guide.md         Design tokens & komponen (mengikuti benkyoulab.online)
```

## Urutan Baca

1. `docs/01-prd.md` — apa yang dibangun dan kenapa
2. `docs/02-schema.sql` — struktur data
3. `docs/03-implementation-plan.md` — langkah kerja dari nol sampai live
4. `docs/04-design-guide.md` — panduan tampilan/UI

## Desain
Tampilan mengikuti [benkyoulab.online](https://benkyoulab.online): Inter, primary red-600, kartu putih radius besar, pill button, aksen kanji dekoratif. Detail lengkap: `docs/04-design-guide.md`.
