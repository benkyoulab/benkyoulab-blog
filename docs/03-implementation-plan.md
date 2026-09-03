# Implementation Plan — Benkyou Lab Blog

> Prasyarat: akun GitHub, Vercel, dan Supabase sudah dibuat. Node.js ≥ 20.9 terpasang (syarat minimal Next.js 16).
> Semua path relatif terhadap root proyek: `E:/Project/Web/benkyoulab/`

**Goal:** Blog editorial Next.js + Supabase yang live di Vercel, membahas kabar dan info Jepang dengan rubrik berita, JLPT, MEXT, budaya, bahasa, dan panduan praktis. Dashboard menyediakan editor WYSIWYG (Tiptap) dan gambar berbasis URL.

**Arsitektur:** Monorepo Next.js App Router. Publik = Server Components + dynamic DB reads; homepage memiliki carousel highlight dan discovery query. Admin = Client Components + Server Actions. DB diakses via Drizzle (postgres-js) melalui Supabase Transaction Pooler — pola untuk environment serverless seperti Vercel.

**Status hardening 2026-09-03:**
- Login credentials dilengkapi rate limiter dan retry policy.
- Akses admin dikunci di layout + route guard untuk mencegah bypass.
- Ownership guard untuk writer pada artikel ditetapkan di level halaman dan action.
- Cache invalidation dibuat sentral dan diuji agar halaman publik selalu diperbarui setelah mutasi data.
- Discovery editorial selesai: quick search navbar, halaman `/search` dengan ranking relevansi, filter multi-tag, landing page tag, related posts, Recent, dan Trending/Top views berbasis `posts.views`.
- Schema production sudah disinkronkan setelah penambahan kolom `posts.views`; gunakan `DRIZZLY_URL` session pooler `:5432` untuk tooling schema.
- UX performa artikel selesai: route loading skeleton tersedia dan query detail independen dijalankan paralel.

**Catatan Next.js 16 (dikonfirmasi dari docs resmi via Context7):**
- Next.js 16 menggunakan Turbopack sebagai default, tetapi proyek ini sengaja memakai webpack untuk dev dan build agar kompatibel dengan filesystem Windows tertentu.
- Konvensi `middleware.ts` diganti `proxy.ts` (export bernama `proxy`, runtime Node.js; edge tidak didukung di proxy).
- Semua Request API wajib async: `params`, `searchParams`, `cookies()` di-`await`. Tipe halaman bisa pakai helper bawaan `PageProps<'/route/[param]'>`.

---

Server Component: query `posts where status='published'` dengan `q`, `category`, `tag`, `sort`, dan pagination. Homepage memakai `force-dynamic` karena membaca database saat request; form discovery realtime memperbarui query URL dengan debounce 350 ms. Navbar menyediakan quick keyword search ke `/search`, sedangkan homepage mempertahankan pencarian detail.

Prinsip: pastikan "hello world" sudah LIVE di Vercel sebelum bikin fitur. Deploy gagal harus ketahuan di menit pertama, bukan di akhir.

### Task 0.1 — Inisialisasi proyek
```bash
cd /e/Project/Web
npx create-next-app@16 benkyoulab --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd benkyoulab
git init && git add -A && git commit -m "chore: bootstrap next.js"
```
✅ Verifikasi: `npm run dev` → buka `http://localhost:3000` tampil halaman default.

### Task 0.2 — Setup Supabase
1. Buat project baru di supabase.com — catat database password-nya.
2. Ambil connection string: **Project Settings → Database → Connection string → Transaction pooler**
   (host `aws-0-<region>.pooler.supabase.com`, port `6543`). Port 6543 wajib — direct connection (5432) cepat habis limit koneksi di serverless.
3. Simpan sementara di `.env.local`:
```
DATABASE_URL="postgresql://postgres.<project-ref>:***@aws-0-<region>.pooler.supabase.com:6543/postgres"
AUTH_SECRET="$(openssl rand -base64 32)"
```
✅ Verifikasi: koneksi berhasil dari lokal (Task 1.2).

### Task 0.3 — Push ke GitHub & hubungkan Vercel
```bash
gh repo create benkyoulab --private --source=. --push
```
Lalu di Vercel: Add New Project → import repo → tambahkan env `DATABASE_URL` & `AUTH_SECRET` → Deploy.
✅ Verifikasi: URL `*.vercel.app` tampil halaman default. Jalur deploy RESMI TERBUKTI.

---

## Fase 1 — Database layer (Drizzle)

### Task 1.1 — Install & konfigurasi Drizzle
```bash
npm i drizzle-orm postgres
npm i -D drizzle-kit dotenv
```
Buat `src/db/index.ts`:
```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// prepare: false wajib untuk Supabase Transaction Pooler (port 6543)
export const db = drizzle(postgres(process.env.DATABASE_URL!, { prepare: false }), { schema });
```
Buat `drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

### Task 1.2 — Definisikan schema `src/db/schema.ts`
Transliterasi dari `docs/02-schema.sql` ke Drizzle (tabel `users`, `categories`, `posts`, enum `user_role`, `post_status`, index sesuai SQL). Kolom `updatedAt` pakai `$onUpdate(() => new Date())`.
```bash
npx drizzle-kit push
```
✅ Verifikasi: `npx drizzle-kit studio` → ketiga tabel muncul. Commit.

### Task 1.3 — Script seed admin
Buat `scripts/seed-admin.ts` (tsx): hash password dengan `bcryptjs`, upsert 1 admin + 3 kategori dari PRD.
```bash
npm i -D tsx bcryptjs && npm i -D @types/bcryptjs
npx tsx scripts/seed-admin.ts
```
✅ Verifikasi: row admin muncul di drizzle-kit studio.

---

## Fase 2 — Auth & proxy

### Task 2.1 — Auth.js v5 Credentials
```bash
npm i next-auth@beta
```
- `auth.ts` (root/src): CredentialsProvider → verifikasi email+hash via Drizzle, `strategy: "jwt"`, callback `jwt` & `session` menyisipkan `role`.
- `app/api/auth/[...nextauth]/route.ts` → export handlers.
- Env: `AUTH_SECRET` (sudah), tambahkan `AUTH_TRUST_HOST=true` di Vercel.

✅ Verifikasi: login manual dengan akun seed berhasil; password salah ditolak.

### Task 2.2 — Proxy proteksi `/admin`
Konvensi Next.js 16: file `middleware.ts` menjadi `src/proxy.ts`, export function `proxy(request)` (runtime Node.js, bukan edge).
Matcher `/admin/:path*` → tanpa session valid redirect ke `/login`. Selain itu redirect user login yang buka `/login` ke `/admin`.

✅ Verifikasi: buka `/admin` tanpa login → dilempar ke `/login`. Commit.

---

## Fase 3 — Dashboard: kategori & layout admin

### Task 3.1 — Layout admin + nav
`app/admin/layout.tsx`: sidebar sederhana (Artikel, Kategori, Logout). Cek `role` dari session; sembunyikan menu Kategori untuk writer.

### Task 3.2 — CRUD kategori (admin only)
- `app/admin/kategori/page.tsx` — list + form tambah (Server Action).
- `app/admin/kategori/actions.ts` — `createCategory`, `updateCategory`, `deleteCategory` dengan `zod` validasi nama/slug.
✅ Verifikasi: tambah/ubah/hapus kategori lewat UI; writer yang buka URL `/admin/kategori` ditolak (guard di action + layout).

---

## Fase 4 — Editor & CRUD artikel (inti produk)

### Task 4.1 — Pasang Tiptap
```bash
npm i @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder
```
Buat `components/editor/rich-text-editor.tsx` (client):
- Extensions: StarterKit, Link (openOnClick false), Image, Placeholder.
- Toolbar tombol: B, I, H2, H3, • list, 1. list, quote, link, **gambar (URL)**, code block.
- Tombol gambar: `window.prompt("URL gambar")` → validasi mulai `http(s)://` → `editor.chain().focus().setImage({ src }).run()`.
- `onChange` mengembalikan `editor.getHTML()` ke form state.

✅ Verifikasi: ketik, format, sisip gambar via URL — semua tampil di editor.

### Task 4.2 — Sanitasi server-side
```bash
npm i isomorphic-dompurify zod
```
`lib/sanitize.ts`: bersihkan HTML (whitelist tag editor, buang event handler/script). Dipanggil di Server Action sebelum simpan — bukan cuma di render.

### Task 4.3 — Form & actions artikel
- `app/admin/artikel/page.tsx` — list artikel (admin: semua; writer: miliknya) + badge status.
- `app/admin/artikel/baru/page.tsx` & `[id]/edit/page.tsx` — form: judul (slug auto-generate, editable), excerpt, kategori (select), thumbnail URL, konten (RichTextEditor), tombol Simpan Draft / Publish.
- `app/admin/artikel/actions.ts` — `createPost`, `updatePost`, `deletePost`, `publishPost`:
  - Validasi zod (aturan bisnis §5.3 PRD).
  - Slug unik → kalau bentrok, tambah suffix `-2`, `-3`.
  - `published_at` diisi sekali saat transisi draft→published.
  - Setelah mutasi: `revalidatePath("/")` + path kategori + `/artikel/[slug]`.
  - Guard kepemilikan: writer ≠ owner → error.

✅ Verifikasi: buat draft → edit → publish → muncul di DB dengan `published_at`; non-owner writer tak bisa edit. Commit.

### Task 4.4 — Preview di admin
Tombol "Preview" membuka `/artikel/[slug]?preview=1` — halaman detail merender post berstatus apapun **hanya jika request membawa session penulis/admin** (cek di server component). Tanpa flag/session → 404 untuk draft.

✅ Verifikasi: draft bisa dilihat penulisnya via preview, tidak bisa oleh publik/incognito.

---

## Fase 5 — Situs publik

### Task 5.1 — Layout & komponen bersama
`components/post-card.tsx` (thumbnail `<img loading="lazy">` + placeholder kalau URL kosong), `featured-carousel.tsx`, `article-filters.tsx`, header/nav, footer. Styling mengikuti arah editorial study journal di `docs/04-design-guide.md`: DM Sans, Noto Serif JP, kertas hangat, vermilion hemat, garis tipis, dan kartu ringan. Tambah `@tailwindcss/typography` untuk konten artikel (`prose prose-gray`).

### Task 5.2 — Halaman daftar `/`
Server Component: query `posts where status='published'` dengan search `q`, filter `category` dan multi-tag, ranking relevansi, sort `latest|oldest|title`, dan pagination. Form discovery di client memperbarui URL realtime dengan debounce 350 ms; data tetap diambil server-side. `export const dynamic = "force-dynamic"` karena membaca database pada request.

### Task 5.2a — Quick search navbar dan search detail
Navbar desktop/mobile menerima keyword singkat melalui form GET dan mengarah ke `/search?q=...`. Halaman `/search` menampilkan hasil terpisah dengan ranking title/excerpt/content/category/tag, filter kategori/tag, sorting, dan pagination.

### Task 5.2b — Editorial discovery sidebar
Homepage menampilkan Trending berbasis `posts.views` dan Recent. Detail artikel menampilkan related posts, Top views, dan Recently. Detail artikel menambah counter `views` saat dibuka.

### Task 5.3 — Detail `/artikel/[slug]`
Render `content_html` tersanitasi + `dangerouslySetInnerHTML` (aman karena disanitasi saat simpan). Slug async: `const { slug } = await props.params` atau helper `PageProps<'/artikel/[slug]'>`. Metadata: title, description=excerpt, openGraph.images=[thumbnail_url]. Draft → notFound() kecuali preview (Task 4.4).

`loading.tsx` pada segment artikel menampilkan skeleton segera saat navigasi. View counter, tag, recent, dan top views dijalankan paralel; query related tetap mengikuti hasil tag/kategori yang diperlukan.

### Task 5.4 — Kategori `/kategori/[slug]`
Daftar artikel published per kategori + metadata.

✅ Verifikasi fase 5: alur end-to-end — publish artikel dari admin → muncul di carousel dan daftar `/`, quick search navbar menuju `/search`, search/filter/sort realtime, filter multi-tag dan landing tag, sidebar Trending/Recent, klik masuk detail dengan skeleton terlihat saat loading, filter kategori jalan. Cek incognito bahwa draft tak tampak. Commit.

---

## Fase 6 — SEO & polish

### Task 6.1 — `app/sitemap.ts` + `app/robots.ts`
sitemap membaca artikel dan kategori dari DB pada runtime; semua halaman publik penting tetap tercantum.

### Task 6.2 — Metadata global & favicon
`layout.tsx`: metadata template `%s · Benkyou Lab`, metadataBase dari env `NEXT_PUBLIC_SITE_URL`.

### Task 6.3 — Empty states & error boundary
Daftar kosong, gambar rusak (`onError` → placeholder), `not-found.tsx`, `error.tsx`.

✅ Verifikasi: Lighthouse mobile di URL Vercel — target Performa & SEO ≥ 90.

---

## Fase 7 — Production

- [ ] Ganti password admin seed (login pertama).
- [ ] Env Vercel lengkap: `DATABASE_URL`(pooled), `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`.
- [ ] Domain custom (opsional) + update `metadataBase`.
- [ ] Env Vercel memakai Transaction Pooler URL (port 6543), bukan direct connection.
- [ ] Ingat: Supabase free tier menjeda project setelah ±7 hari tidak aktif — aktifkan lagi dari dashboard bila terjadi.
- [x] Tulis `docs/panduan-writer.md` ringkas: cara login, menulis, memasukkan gambar URL, publish, dan verifikasi sumber editorial.

---

## Urutan commit yang diharapkan

```
chore: bootstrap next.js
feat(db): drizzle schema + supabase connection
feat(auth): credentials auth + admin proxy
feat(admin): kategori crud
feat(editor): tiptap richtext + image via url
feat(posts): artikel crud + publish flow
feat(public): home, detail, kategori
feat(design): inter font, red theme, typography plugin
feat(seo): sitemap, robots, metadata
```

## Estimasi

| Fase | Estimasi |
|---|---|
| 0 Bootstrap + deploy | 1–2 jam |
| 1–2 DB + Auth | 3–4 jam |
| 3–4 Dashboard + editor | 6–8 jam |
| 5–6 Publik + SEO | 4–6 jam |
| 7 Production | 1 jam |
| **Total** | **± 2–3 hari kerja** |
