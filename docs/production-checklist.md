# Checklist Produksi Benkyou Lab

Status update: 2026-09-03

Catatan: verifikasi lokal dan status deployment live sudah diperbarui berdasarkan hasil terakhir. Item yang memerlukan akses dashboard atau kredensial production tetap harus dikonfirmasi langsung di layanan terkait.

## 1. Infrastructure
- [x] GitHub repo aktif dan branch main stabil (`main` sudah tersinkron ke origin)
- [x] Vercel project terhubung ke repo GitHub (deployment production sudah live)
- [x] Auto deploy dari main aktif (perubahan `main` sudah berhasil dipush untuk deployment)
- [ ] Preview deployment aktif untuk pull request (perlu konfirmasi di dashboard Vercel)
- [x] Production URL terdokumentasi: https://benkyoulab-blog.vercel.app
- [x] Rollback plan siap ([docs/05-operasional-sop.md](./05-operasional-sop.md))

## 2. Environment
- [x] `.env.example` sudah ada ([.env.example](../.env.example))
- [ ] Semua secret tersimpan di Vercel/GitHub secret (blocked: butuh akses dashboard eksternal)
- [ ] `DATABASE_URL` memakai pooled Supabase transaction URL (blocked: butuh valid database credentials dari Supabase)
- [ ] `AUTH_SECRET` sudah di-generate dan unik (blocked: butuh secret production)
- [ ] `NEXT_PUBLIC_SITE_URL` sesuai domain produksi (blocked: butuh domain Vercel final)
- [ ] `AUTH_TRUST_HOST=true` di production (blocked: butuh env Vercel production)

## 3. Quality Gate
- [x] `npm run lint` berhasil
- [x] `npm run typecheck` berhasil
- [x] `npm run test` berhasil
- [x] `npm run build` berhasil lewat Windows-safe workaround ([scripts/build-safe.mjs](../scripts/build-safe.mjs))
- [ ] PR wajib green check sebelum merge (blocked: butuh GitHub Actions / repo branch protection)

## 4. Security
- [x] Login protected dengan rate limit
- [ ] Cookie/session secure (needs production session hardening review)
- [x] Admin route protected di backend ([src/proxy.ts](../src/proxy.ts), [src/auth.ts](../src/auth.ts))
- [x] Role check di server action valid (guard role sudah ada di admin actions)
- [x] Form input divalidasi dan disanitasi ([src/lib/sanitize.ts](../src/lib/sanitize.ts))
- [x] Security headers aktif ([next.config.ts](../next.config.ts))

## 5. Database & Recovery
- [ ] Backup otomatis aktif (blocked: butuh akses Supabase dashboard)
- [x] Restore plan terdokumentasi ([docs/05-operasional-sop.md](./05-operasional-sop.md))
- [ ] Seeder admin teruji (require DB real + env production)
- [ ] Script migration jelas dipakai (belum ada migration workflow formal yang terintegrasi)
- [x] Koneksi DB production dan local dibedakan (konfigurasi dokumentasi sudah memisahkan local vs pooled prod)

## 6. Content & SEO
- [x] Metadata untuk halaman utama dan artikel konsisten ([src/app/layout.tsx](../src/app/layout.tsx), [src/app/(public)/artikel/[slug]/page.tsx](../src/app/(public)/artikel/[slug]/page.tsx))
- [x] Sitemap dan robots valid ([src/app/sitemap.ts](../src/app/sitemap.ts), [src/app/robots.ts](../src/app/robots.ts))
- [x] Thumbnail fallback dan placeholder aktif ([src/components/safe-img.tsx](../src/components/safe-img.tsx))
- [x] Gambar eksternal dengan URL valid (alur admin/content sudah menerapkan validation URL)
- [x] SOP penulisan artikel dan kategori dibuat ([docs/panduan-writer.md](./panduan-writer.md))
- [x] Homepage memiliki highlight carousel artikel terbaru
- [x] Search realtime, filter rubrik, dan sorting tersedia di homepage
- [x] Quick keyword search tersedia di navbar dan mengarah ke `/search`
- [x] Search detail `/search` dengan ranking relevansi, filter kategori/tag, sorting, dan pagination
- [x] Multi-tag landing page dan filter URL tersedia
- [x] Sidebar Trending, Recent, related posts, dan top views tersedia
- [x] Kolom `posts.views` tersinkron ke database production
- [x] 10 artikel editorial Jepang dengan thumbnail URL sudah di-seed
- [x] Rubrik editorial Berita Jepang, JLPT & Tes, MEXT & Beasiswa, dan Budaya Jepang tersedia

## 7. Operations
- [ ] Admin password diganti dari default (blocked: butuh login ke environment production)
- [ ] SOP login & reset password ditulis (belum dibuat khusus untuk admin ops)
- [x] SOP deploy dan rollback ditulis ([docs/05-operasional-sop.md](./05-operasional-sop.md))
- [x] SOP backup/recovery ditulis ([docs/05-operasional-sop.md](./05-operasional-sop.md))
- [x] SOP content review sebelum publish dibuat ([docs/panduan-writer.md](./panduan-writer.md))

## 8. Launch Ready
- [ ] Login admin berhasil (blocked: butuh DB production valid dan env setup)
- [ ] Artikel bisa dibuat, diedit, dan dipublish (blocked: butuh DB real + admin login)
- [ ] Draft tidak tampil di publik (needs end-to-end validation on production DB)
- [ ] Published article muncul di homepage dan kategori (needs end-to-end validation on production DB)
- [ ] Browser check mobile + desktop selesai (blocked: no browser QA against deployed environment)
- [ ] SEO dasar dan performance basic check selesai (blocked: butuh deployed site + real browser audit)

## 9. Hasil eksekusi yang sudah tervalidasi di local
- [x] lint: berhasil
- [x] typecheck: berhasil
- [x] smoke test: berhasil
- [x] production build: berhasil lewat workaround Windows-safe build ([scripts/build-safe.mjs](../scripts/build-safe.mjs))
- [x] route production berhasil dibuat untuk homepage, admin, artikel, kategori, login, sitemap, dan robots
- [x] lint final berhasil tanpa warning ESLint

## 10. Status saat ini
Proyek sudah berada pada fase repo-ready, local-build-ready, dan ter-deploy di Vercel, dengan homepage editorial, carousel highlight, quick search navbar, search detail berbasis relevansi, filter multi-tag, landing page tag, sidebar Trending/Recent, related posts, dan top views. Verifikasi operasional yang masih membutuhkan akses dashboard adalah smoke test browser production, konfirmasi environment variable dan backup Supabase, serta rotasi password admin default.
