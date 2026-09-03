# PRD — Benkyou Lab Blog

**Versi:** 1.1 · **Tanggal:** 2026-08-31 · **Status:** Baseline implementasi

---

## 1. Ringkasan

Benkyou Lab adalah blog berbahasa Indonesia tentang kabar dan kehidupan Jepang. Cakupannya meliputi berita, JLPT, MEXT dan beasiswa, budaya, bahasa, serta panduan praktis. Penulis (admin/writer) membuat artikel lewat dashboard dengan text editor WYSIWYG; pembaca umum membaca dan menemukan artikel gratis melalui situs publik.

**Non-goal:** multi-tenancy, komentar, i18n, aplikasi mobile, upload file gambar ke server.

## 2. Latar Belakang & Masalah

 Informasi tentang Jepang tersebar di banyak sumber dan sering sulit diikuti pembaca Indonesia. Dibutuhkan satu rumah editorial yang:
	- mudah diupdate non-teknis (writer tidak pegang kode),
	- membedakan berita, panduan, dan konten belajar melalui rubrik,
- cepat dan ramah SEO agar mudah ditemukan,
- murah dioperasikan (nol biaya di tahap awal).
Informasi tentang Jepang tersebar di banyak sumber dan sering sulit diikuti pembaca Indonesia. Dibutuhkan satu rumah editorial yang:
- mudah diupdate non-teknis (writer tidak pegang kode),
- membedakan berita, panduan, dan konten belajar melalui rubrik,

## 3. Pengguna & Peran

| Peran | Jumlah | Bisa apa |
|---|---|---|
| **Visitor** | Publik | Baca artikel, telusuri per kategori |
| **Writer** | ≤ 5 | Buat/edit artikel miliknya sendiri, simpan draft, publish, preview |
| **Admin** | 1–2 | Semua hak writer + kelola kategori + edit/hapus artikel siapa pun |

## 4. Ruang Lingkup Fungsional

### 4.1 Situs Publik
| ID | Fitur | Detail |
|---|---|---|
| P-01 | Beranda | Hero highlight/carousel, daftar artikel terbaru, thumbnail, judul, excerpt, rubrik, tanggal, pagination |
| P-02 | Detail artikel | Judul, thumbnail, konten rich text, info penulis & tanggal, kategori, tag, related posts, loading feedback, dan top views/recent |
| P-03 | Arsip kategori | Daftar artikel per kategori |
| P-04 | Search & discovery | Quick keyword search di navbar menuju `/search`, search realtime/detail di homepage, filter rubrik dan tag multi-tag, per-tag landing page, ranking relevansi, Trending/Recent/Top views, urutan terbaru/terlama/judul A-Z, URL query yang dapat dibagikan |
| P-05 | SEO | Meta title/description per artikel, Open Graph image dari thumbnail URL, sitemap.xml, robots.txt |

### 4.2 Dashboard
| ID | Fitur | Detail |
|---|---|---|
| A-01 | Login/logout | Email + password. Session JWT. Tidak ada registrasi mandiri — admin buat akun manual via DB/seed |
| A-02 | Kelola artikel | List + filter status; create/edit/delete; auto-simpan draft |
| A-03 | Text editor | WYSIWYG Tiptap: bold, italic, heading, list, quote, link, code block, **sisip gambar via URL**, placeholder teks |
| A-04 | Metadata artikel | Thumbnail (URL), excerpt, kategori, slug otomatis dari judul (bisa diedit) |
| A-05 | Alur publikasi | `draft → published` (dan sebaliknya). `published_at` terisi otomatis saat publish pertama |
| A-06 | Kelola kategori | CRUD kategori — khusus admin |
| A-07 | Preview | Writer/admin bisa lihat artikel draft sebelum publish |

### 4.3 Gambar
- **Tidak ada storage/upload.** Semua gambar (thumbnail & inline) berupa URL eksternal.
- Validasi: harus `https://`. Saran host gratis: Cloudinary free tier / imgbb / langsung dari CDN manapun.
- Konsekuensi: jika host eksternal mati, gambar hilang → tangani dengan placeholder rapi di front-end.

## 5. Model Data (ringkas)

Detail lengkap: [`02-schema.sql`](./02-schema.sql)

- **users** — id, name, email (unik), password_hash, role (`admin`|`writer`), timestamps
- **categories** — id, name, slug (unik), description?, timestamps
- **posts** — id, author_id→users, category_id→categories (nullable), title, slug (unik), excerpt?, content_html, content_text (untuk search/excerpt cadangan), thumbnail_url?, views (counter top views/trending), status (`draft`|`published`), published_at?, timestamps
- **tags** — id, name, slug (unik), description?, timestamps
- **post_tags** — id, post_id→posts, tag_id→tags, unique(post_id, tag_id)
- Aturan: writer hanya boleh memodifikasi post miliknya; hapus kategori yang masih dipakai post → tolak atau set NULL (pilih: set NULL, post jadi "tanpa kategori"). Tag bisa dipakai multi-tag per artikel untuk discovery dan rekomendasi otomatis.

## 6. Aturan Bisnis Penting

1. Slug unik global; bentrok → suffix `-2`, `-3`, dst.
2. Mengubah judul TIDAK mengubah slug yang sudah published (link stabil).
3. Unpublish = kembali ke draft; artikel hilang dari publik tapi datang utuh.
4. Hapus artikel = soft delete? **Tidak — hard delete** (YAGNI; sampah data tidak diperlukan).
5. Password di-hash bcrypt; kredensial tidak pernah dikirim ke client.
6. Konten HTML disanitasi server-side (whitelist tag editor) sebelum disimpan.

## 7. Non-Fungsional

| Aspek | Target |
|---|---|
| Performa | Halaman publik < 2s First Load; ISR/revalidate 300s; navigasi artikel menampilkan skeleton dan query detail independen diproses paralel |
| SEO | Skor Lighthouse SEO ≥ 90; sitemap otomatis |
| Biaya | $0 — Vercel Hobby + Supabase Free Tier |
| Keamanan | `/admin/*` dilindungi `proxy.ts` (session check — konvensi Next.js 16); role check di Server Actions (bukan cuma UI) |
| Backup | Backup harian bawaan Supabase (PITR sebagai add-on) |

## 8. Metrik Sukses (3 bulan pertama)

- ≥ 20 artikel published
- ≥ 500 pageview/bulan (Vercel Analytics)
- Waktu tulis 1 artikel standar < 30 menit bagi penulis non-teknis

## 9. Batasan & Risiko

| Risiko | Mitigasi |
|---|---|
| Host gambar eksternal mati/hotlink diblokir | Placeholder + dokumentasi host yang direkomendasikan |
| Vercel Hobby limit (100GB bandwidth) | Gambar tidak melewati server (langsung dari CDN eksternal) → bandwidth hanya HTML |
| Satu-satunya admin lupa password | Reset via script seed (jalankan sekali dari lokal) |

## 10. Di Luar Cakupan v1

Komentar, newsletter, editor multi-bahasa (JP/ID side-by-side), analitik lanjutan, scheduling publish, dan upload/storage gambar internal. Search v1 memakai `ILIKE` pada judul, excerpt, `content_text`, kategori, dan tag; halaman search memberi bobot relevansi pada title/excerpt/content. Full-text search berbasis indeks dapat dipertimbangkan ketika volume artikel meningkat.
