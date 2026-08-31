# Checklist Produksi Benkyou Lab

Status update: 2026-08-31

Catatan: item yang membutuhkan akses ke GitHub, Vercel, atau Supabase tidak bisa dijalankan dari workspace lokal saat ini. Item yang bisa diverifikasi di repo dan runtime lokal sudah dihitung dan dicatat sesuai hasil terkini.

## 1. Infrastructure
- [ ] GitHub repo aktif dan branch main stabil (blocked: butuh akses GitHub)
- [ ] Vercel project terhubung ke repo GitHub (blocked: butuh akses Vercel)
- [ ] Auto deploy dari main aktif (blocked: butuh akses Vercel)
- [ ] Preview deployment aktif untuk pull request (blocked: butuh akses Vercel)
- [x] Production URL dan preview URL terdokumentasi (README dan docs sudah mencatat flow deploy)
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
- [ ] Login protected dengan rate limit (not implemented yet)
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

## 10. Status saat ini
Proyek sudah berada pada fase repo-ready dan local-build-ready. Sisa yang benar-benar menandai final production-readiness adalah integrasi ke GitHub/Vercel/Supabase dan validasi live environment.
