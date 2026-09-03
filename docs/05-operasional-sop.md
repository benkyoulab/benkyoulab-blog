# SOP Operasional: Deploy, Rollback, dan Backup

## 1. Tujuan

Dokumen ini menjelaskan alur operasional yang harus diikuti saat:
- deploy aplikasi ke Vercel
- rollback deploy jika terjadi masalah
- backup database dan konfigurasi penting
- memulihkan layanan bila terjadi incident

Tujuan utamanya adalah menjaga stabilitas, memudahkan penanggung jawab, dan mengurangi risiko downtime atau data loss.

## 2. Lingkup

SOP ini mencakup:
- GitHub repository
- Vercel production dan preview deployment
- Supabase/Postgres database
- konfigurasi environment
- proses keamanan dan verifikasi sebelum/after deploy

## 3. Role dan tanggung jawab

### Owner produk / admin
- menilai apakah deploy aman untuk production
- memastikan konten dan fitur yang akan rilis sudah siap
- memutuskan apakah rollback diperlukan

### Developer / maintainer
- membuat perubahan di branch feature
- menjalankan lint, typecheck, build lokal
- membuka PR dan melakukan review
- menjalankan deploy ke production bila disetujui

### Admin database / ops
- memastikan backup aktif
- memantau status DB dan performance
- melakukan restore bila terjadi data corruption atau bug critical

## 4. Tooling dan environment

### GitHub
- repository utama: benkyoulab/benkyoulab-blog
- branch utama: `main`
- PR harus dibuat untuk semua perubahan

### Vercel
- production URL saat ini: https://benkyoulab-blog.vercel.app
- production deployment dipicu dari branch `main`
- preview deployment dipicu dari PR jika fitur Preview sudah aktif di project
- environment variables dikelola di dashboard Vercel

### Supabase
- database utama menggunakan Supabase Postgres
- database url production memakai pooled transaction connection (port 6543)
- perubahan schema seperti `posts.views` harus diterapkan ke Supabase sebelum deployment yang memakai Trending/Top views
- backup default database aktif sesuai fitur Supabase

## 5. Prinsip dasar

- Jangan deploy langsung ke production tanpa PR dan review jika project sudah memiliki tim.
- Semua perubahan yang mengubah skema database harus dipikirkan sebagai migration berisiko.
- Kalau deploy gagal, rollback harus dilakukan sesegera mungkin.
- Tidak pernah mengubah secret secara manual di repo.
- Backup harus selalu tersedia sebelum perubahan yang berisiko.

## 6. Alur kerja deploy

### 6.1 Sebelum deploy

1. Pastikan branch sudah clean dan update terbaru.
2. Jalankan validasi lokal:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```
3. Pastikan `.env.local` atau env lokal sudah diisi sesuai `.env.example`; jangan pernah commit file env atau token ke Git.
4. Pastikan perubahan yang akan deploy sudah direview dan disetujui.
5. Jika ada perubahan schema, pastikan migration plan sudah siap.
6. Untuk perubahan schema lokal, gunakan session pooler melalui `DRIZZLY_URL` port `5432`; runtime aplikasi tetap memakai transaction pooler port `6543`.

### 6.2 Deploy ke preview

1. Buat PR dari branch feature ke `main`.
2. Vercel akan otomatis membuat preview deployment.
3. Verifikasi homepage, quick search, halaman `/search`, login admin, dashboard artikel, dan loading skeleton saat membuka artikel.
4. Jika preview gagal, berhenti dan perbaiki perubahan sebelum merge.

### 6.3 Deploy ke production

1. Pastikan preview sudah lolos pengecekan.
2. Merge PR ke `main`.
3. Vercel akan memulai production deployment otomatis.
4. Setelah build selesai, lakukan checklist berikut:
   - homepage dapat diakses
   - highlight carousel menampilkan artikel terbaru
   - quick search navbar menuju hasil keyword yang benar
   - search detail `/search`, filter rubrik/tag, ranking relevansi, dan sorting mengembalikan hasil yang benar
   - sidebar Trending, Recent, related, dan top views tampil tanpa error
   - klik artikel menampilkan loading skeleton sebelum halaman detail selesai
   - navigasi artikel tidak menunggu query independen secara berurutan
   - login admin dapat masuk
   - dashboard artikel dapat dibuka
   - publish artikel berjalan
   - sitemap dan robots dalam keadaan valid
5. Catat commit hash, timestamp, dan URL deployment pada log operasional. Untuk deployment saat ini, URL production adalah https://benkyoulab-blog.vercel.app.

### 6.4 Checklist post-deploy

- [ ] Homepage terbuka tanpa error 500
- [ ] Admin login berhasil
- [ ] CRUD artikel berjalan
- [ ] Draft tidak muncul di publik
- [ ] Published article muncul di homepage
- [ ] Quick search navbar dan halaman `/search` mengembalikan hasil
- [ ] Trending/Recent/top views tampil dan metrik views bertambah saat detail artikel dibuka
- [ ] Loading skeleton artikel terlihat saat navigasi lambat
- [ ] Sitemap bisa diakses
- [ ] No critical console error
- [ ] Waktu respon halaman masuk batas normal

## 7. SOP rollback

Rollback dibutuhkan jika:
- deploy gagal setelah merge
- bug critical muncul di production
- admin login error massal
- data artikel rusak atau skema database tidak kompatibel
- perubahan memengaruhi halaman publik secara serius

### 7.1 Rollback cepat (aplikasi)

Metode paling cepat:
1. Buka dashboard Vercel.
2. Pilih proyek benkyoulab.
3. Masuk ke tab Deployments.
4. Cari deployment sebelumnya yang stabil.
5. Klik "Promote" atau redeploy commit sebelumnya.
6. Pastikan env variables tetap sama.
7. Verifikasi homepage dan admin login setelah rollback.

### 7.2 Rollback via Git

Jika deployment dari Vercel gagal dan rollback manual diperlukan:

```bash

Catatan:
- lakukan hanya bila commit stabil diketahui dan sudah diuji.
- pastikan tidak ada perubahan database yang tidak bisa dibatalkan.

### 7.3 Rollback database

Jika perubahan data atau schema membuat sistem rusak:
1. Identifikasi perubahan yang menyebabkan masalah.
2. Lakukan restore dari backup terbaru jika issue bersifat data-damage.
3. Jika change hanya skema, kembalikan ke state terakhir yang stabil.
4. Pastikan semua tampilan aplikasi yang bergantung pada struktur DB kembali normal.

> **Catatan schema:** `posts.views` diperlukan oleh homepage Trending dan Top views. Jika production menampilkan `column posts.views does not exist`, terapkan schema dengan `DRIZZLY_URL` session pooler `:5432`, verifikasi query, lalu ulangi deployment/smoke test.

### 7.4 Prosedur rollback pasca incident

1. Stabilkan layanan dengan rollback aplikasi atau restore DB.
2. Catat root cause dan commit yang problematic.
3. Pastikan system kembali dapat diakses.
4. Lakukan pemeriksaan berikut:
   - admin login
   - publikasi artikel
   - query penting
   - error logs
5. Buat incident note dan jalankan perbaikan di branch baru.

## 8. SOP backup

### 8.1 Backup kode

- Repository GitHub otomatis menyimpan perubahan versi.
- Pastikan branch `main` selalu tercommit dengan perubahan yang valid.
Seeder artikel dapat dijalankan ulang dengan aman:

```bash
node --env-file=.env.local scripts/seed-artikel.mjs

Untuk memperbarui seluruh artikel demo menjadi konten editorial, jalankan:

```bash

Database utama harus dibackup secara rutin.
3. Pastikan backup otomatis aktif.
4. Cek bahwa backup terbaru tersedia sebelum deploy berisiko tinggi.
5. Simpan log backup tanggal dan waktu.

### 8.3 Backup environment dan konfigurasi

Backup semua konfigurasi penting:
- `.env.local` disimpan aman di vault / secret manager
- Vercel env variables dicatat dan dibackup di dokumentasi internal
- URL Supabase, database key, dan secret perlu dicatat dalam vault aman
- Jika token GitHub pernah tertulis di URL remote, segera revoke token tersebut, buat token pengganti dengan scope minimum, lalu gunakan credential helper atau SSH agar token tidak tersimpan di remote URL.

### 8.4 Retensi backup

Disarankan:
- kode: permanen di GitHub
- database: backup harian + PITR sesuai fitur Supabase
- env: disimpan aman dan tidak di commit ke repo

## 9. Titik kritis saat deploy

Hal yang harus diwaspadai:
- perubahan ke schema database
- perubahan auth/session
- perubahan environment variable
- perubahan pada route admin
- perubahan kerja pada file `.env` atau secret
- penentuan rollback strategy

## 10. Incident response

5. Jika DB error, restore dari backup yang terbaru.

### Jika login admin gagal
1. Cek `AUTH_SECRET` pada Vercel.
2. Cek apakah `published_at` terisi.
3. Cek revalidate path atau cache.
4. Cek apakah query DB berhasil.
5. Jika bug pada publish flow, rollback ke commit sebelumnya bila perlu.

- hasil verifikasi
- keputusan rollback / tidak rollback

- Author: developer
- Reason: fix admin auth and SEO metadata
- Status: success
- Verified: homepage, login, create article, publish article
```

## 12. Checklist pre-deploy final

- [ ] branch sudah ready
- [ ] lint, typecheck, build lancar
- [ ] backup DB selesai jika perubahan data/DB
- [ ] commit dan PR sudah approved
- [ ] Vercel env valid
- [ ] deployment plan ditulis
- [ ] rollback plan siap

Catatan build Windows: jalankan `npm run build`. Script tersebut memakai [scripts/build-safe.mjs](../scripts/build-safe.mjs) untuk menghindari masalah filesystem junction/readlink pada drive tertentu. Build production tetap dikonfirmasi oleh Vercel.

## 13. Checklist post-deploy final

- [ ] site dapat dibuka
- [ ] admin login berfungsi
- [ ] artikel bisa dipublish
- [ ] homepage dan kategori muncul benar
- [ ] logs tidak error kritis
- [ ] backup status valid
- [ ] catatan deployment telah di-log

## 14. Sumber referensi

- GitHub repository: benkyoulab/benkyoulab-blog
- Vercel dashboard
- Supabase dashboard
- project docs: [README.md](../README.md), [docs/03-implementation-plan.md](./03-implementation-plan.md), [docs/production-checklist.md](./production-checklist.md)
