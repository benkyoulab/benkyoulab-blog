<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Benkyou Lab Conventions

- Produk ini adalah blog editorial berita dan info Jepang, bukan LMS. Konten mencakup berita, JLPT, MEXT, beasiswa, budaya, kehidupan sehari-hari, dan bahasa.
- Public UI mengikuti arah editorial study journal: kertas hangat, tinta gelap, aksen vermilion, garis tipis, dan whitespace. Hindari layout dashboard generik, kumpulan pill, serta dekorasi berlebihan.
- Motion publik memakai GSAP melalui `src/components/gsap-shell.tsx` dan Lenis untuk smooth scrolling. Gunakan `useGSAP` dengan cleanup; hormati `prefers-reduced-motion`.
- Framer Motion tetap digunakan untuk interaksi komponen yang sudah ada seperti carousel, menu, dan reveal lokal. Jangan menambahkan engine animasi ketiga tanpa alasan kuat.
- Gambar thumbnail dan gambar inline adalah URL eksternal `https://`; tidak ada upload atau storage gambar internal. Selalu sediakan fallback jika URL gagal.
- Homepage memiliki featured carousel serta search/filter/sort server-side dengan query URL. Jangan mengubah query parameter tanpa menjaga pagination dan shareable URL.
- Navbar memiliki quick keyword search yang mengarah ke `/search?q=...`; halaman `/search` adalah pencarian detail dengan ranking relevansi, filter kategori/tag, sorting, dan pagination.
- Homepage dan detail artikel memiliki blok editorial Trending/Recent/Top views. Trending memakai kolom `posts.views`, jadi perubahan schema harus disinkronkan ke Supabase sebelum deploy.
- Tag publik mendukung multi-tag query (`tag=slug-a,slug-b`) dan landing page `/tag/[slug]`; admin menyimpan tag melalui repeated checkbox values dan `FormData.getAll`.
- Route artikel memiliki `loading.tsx` skeleton untuk feedback navigasi cepat; pertahankan loading boundary ini saat mengubah struktur route publik.
- Query detail artikel yang independen dijalankan paralel. Jangan menambahkan `await` berantai untuk view counter, tag, recent, atau top views tanpa alasan performa yang jelas.
