# Panduan Writer — Benkyou Lab

## Masuk
1. Buka **benkyoulab-blog.vercel.app/login**.
2. Login dengan email & password yang diberikan admin.
3. Writer hanya bisa melihat & mengedit artikel miliknya sendiri. Menu **Kategori** khusus admin.

## Menulis artikel
1. Dashboard → **✍️ Tulis Artikel Baru**.
2. Isi:
   - **Judul** — slug URL dibuat otomatis dari judul.
   - **Kategori** — pilih rubrik yang tersedia, misalnya Berita Jepang, JLPT & Tes, MEXT & Beasiswa, Budaya Jepang, Kanji, Tata Bahasa, Kosakata, atau Tips Belajar.
   - **Tag** — pilih satu atau beberapa topik yang relevan. Multi-tag membantu artikel muncul di filter homepage, landing page `/tag/[slug]`, related posts, dan hasil pencarian.
   - **Thumbnail URL** — tempel URL langsung gambar `https://`. Gambar tidak di-upload atau disimpan di blog; hanya URL-nya yang disimpan. Kosong = placeholder.
   - **Excerpt** — kosongkan untuk potongan otomatis dari paragraf pertama.
3. Konten lewat editor: **B**old, *I*talic, H2/H3 untuk sub-judul, list, kutipan, link (ikon 🔗), dan **gambar via URL** (ikon gambar di toolbar → tempel link).

## Status artikel
- **Simpan Draft** — tersimpan, BELUM tampil di blog. Bisa dipreview sendiri lewat link artikel.
- **Publish** — langsung tampil di beranda (maks. ±5 menit karena cache) dan Google.
- Artikel published yang diedit lalu disimpan sbg draft akan hilang dari beranda.

## Cara pembaca menemukan artikel
- Keyword singkat dapat dicari dari input pencarian di navbar; hasil dibuka di halaman `/search`.
- Pencarian detail/live tetap tersedia di homepage, termasuk filter rubrik, multi-tag, dan urutan artikel.
- Pastikan tag benar-benar mencerminkan isi artikel. Jangan memilih tag hanya untuk mengejar jangkauan.

## Aturan penting
- Jangan pernah menaruh data pribadi/rahasia di artikel.
- Gambar: gunakan link langsung ke file gambar atau CDN yang stabil, bukan halaman websitenya. Pastikan penggunaan gambar memiliki izin yang sesuai.
- Judul & excerpt menentukan tampilan di Google — tulis menarik, maksimal ±60 karakter judul.
- Untuk berita, tulis tanggal kejadian/pembaruan dan cantumkan sumber resmi di dalam artikel.
- Jangan menyajikan jadwal ujian, beasiswa, visa, atau kebijakan sebagai kepastian tanpa mengecek sumber resmi terbaru.

## Khusus Admin
- Kelola kategori di menu **Kategori** (tambah/hapus).
- Bisa melihat & mengedit semua artikel semua penulis.

## Standar Artikel Berita dan Info
- Bedakan fakta, konteks, dan opini secara jelas.
- Cantumkan tanggal kejadian atau tanggal pembaruan.
- Sertakan tautan sumber resmi di bagian akhir artikel, terutama untuk JLPT, MEXT, beasiswa, visa, cuaca, transportasi, dan kebijakan.
- Thumbnail memakai URL HTTPS publik yang stabil; blog tidak menyimpan file gambar.
- Gunakan 1 kategori utama dan beberapa tag yang spesifik; kategori dan tag bukan pengganti satu sama lain.
- Hindari judul sensasional jika sumber resmi belum mengonfirmasi informasi tersebut.
