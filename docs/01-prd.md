# PRD — Benkyou Lab Blog

**Versi:** 1.0 · **Tanggal:** 2026-08-24 · **Status:** Draft untuk review

---

## 1. Ringkasan

Benkyou Lab adalah blog materi belajar bahasa Jepang. Penulis (admin/writer) membuat artikel lewat dashboard dengan text editor WYSIWYG yang mudah dipakai; pembaca umum membaca artikel gratis melalui situs publik.

**Non-goal:** multi-tenancy, komentar, i18n, aplikasi mobile, upload file gambar ke server.

## 2. Latar Belakang & Masalah

Konten belajar bahasa Jepang saat ini tersebar dan tidak terstruktur. Dibutuhkan satu rumah digital yang:
- mudah diupdate non-teknis (writer tidak pegang kode),
- cepat dan ramah SEO agar mudah ditemukan,
- murah dioperasikan (nol biaya di tahap awal).

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
| P-01 | Beranda | Daftar artikel terbaru (thumbnail, judul, excerpt, kategori, tanggal), pagination |
| P-02 | Detail artikel | Judul, thumbnail, konten rich text, info penulis & tanggal, kategori |
| P-03 | Arsip kategori | Daftar artikel per kategori |
| P-04 | SEO | Meta title/description per artikel, Open Graph image dari thumbnail URL, sitemap.xml, robots.txt |

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
- **posts** — id, author_id→users, category_id→categories (nullable), title, slug (unik), excerpt?, content_html, content_text (untuk search/excerpt cadangan), thumbnail_url?, status (`draft`|`published`), published_at?, timestamps
- Aturan: writer hanya boleh memodifikasi post miliknya; hapus kategori yang masih dipakai post → tolak atau set NULL (pilih: set NULL, post jadi "tanpa kategori").

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
| Performa | Halaman publik < 2s First Load; ISR/revalidate 300s |
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

Pencarian teks penuh, komentar, newsletter, dark mode toggle, editor multi-bahasa (JP/ID side-by-side), analitik lanjutan, scheduling publish.
