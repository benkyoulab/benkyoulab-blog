# Design Guide — Benkyou Lab Blog

> Arah visual: editorial study journal — hangat seperti halaman catatan, terstruktur seperti majalah kecil, dengan aksen vermilion yang hemat.
> Tujuan: blog terasa khas, tenang, mudah dipindai, dan tidak bergantung pada pola landing page generik.

---

## 1. Design Tokens

Warna utama memakai token editorial khusus agar identitas blog tidak terasa seperti dashboard template.

### Warna
| Token | Nilai | Kelas Tailwind | Pemakaian |
|---|---|---|---|
| Primary | `#c83c2d` | custom vermilion | Tombol utama, link aktif, aksen editorial |
| Primary hover | `#a92f24` | custom vermilion gelap | Hover tombol primary |
| Primary soft | `#ef4444` | `red-500` | Ikon, hover link, badge border |
| Tint | `#fee2e2` | `red-100` | Background chip/badge kategori |
| Tint muda | `#fef2f2` | `red-50` | Background section highlight |
| Heading | `#111827` | `gray-900` | Judul artikel & section |
| Body | `#4b5563` | `gray-600` | Paragraf, deskripsi |
| Muted | `#9ca3af` | `gray-400` | Tanggal, meta, placeholder |
| Border | `#e5e7eb` | `gray-200` | Card, divider, input |
| Section bg | `#f9fafb` | `gray-50` | Background selang-seling section |
| Surface | `#ffffff` | `white` | Kartu, header sticky |
| Aksen kuning | `#facc15` | `yellow-400` | Bintang/rating, highlight kecil |
| Sukses | `#059669` | `emerald-600` | Badge "Published" |

### Tipografi
| Elemen | Font | Catatan |
|---|---|---|
| UI + heading | **DM Sans** | Muat via `next/font/google`, variable `--font-dm-sans`, `display: swap` |
| Display Jepang | **Noto Serif JP** | Untuk kanji dekoratif dan penanda editorial, variable `--font-noto-serif-jp` |

Skala: H1 `text-4xl md:text-5xl font-bold tracking-tight` · H2 section `text-3xl font-bold` · judul card `text-lg font-semibold` · body `text-base leading-relaxed`.

### Bentuk & bayangan
| Token | Nilai | Pemakaian |
|---|---|---|
| Radius card | `1rem–1.5rem` | `rounded-2xl` |
| Radius hero/banner | `2rem–2.5rem` | `rounded-[2rem]` |
| Radius tombol/chip | penuh | `rounded-full` (pill) |
| Bayangan card | lembut | `shadow-sm hover:shadow-md transition-shadow` |

---

## 2. Pola Komponen (dari situs referensi)

### Header
Sticky transparan dengan blur dan garis bawah aktif yang tipis. Desktop memiliki utility strip kecil untuk menegaskan bahwa situs adalah blog berita dan info Jepang. Kiri: logo wordmark "BenkyouLab" dengan aksen 勉 dan descriptor singkat. Kanan: quick search keyword bergaris bawah, lalu nav Beranda, Terbaru, Rubrik, dan Tentang yang aktif melalui underline, bukan pill. Submit quick search menuju `/search?q=...`. Mobile menampilkan input pencarian di menu dan navigasi horizontal yang dapat di-scroll.

### Post Card (beranda & arsip)
```
┌─────────────────────┐
│ thumbnail 4:3       │  object-cover
│  ┌──────────┐       │
│  │chip kat. │       │  absolute top-3 left-3, bg-red-100 text-red-700
│  └──────────┘       │
├─────────────────────┤
│ Judul (semibold)    │  text-gray-900, max 2 baris (line-clamp-2)
│ Excerpt (2 baris)   │  text-gray-600, line-clamp-2, text-sm
│ 📅 tanggal · ✍ penulis │  text-gray-400 text-xs
└─────────────────────┘
bg-white rounded-xl, garis vermilion, shadow sangat lembut
```

### Featured Carousel (beranda)
- Hero menampilkan maksimal tiga artikel published terbaru sebagai cover story.
- Gambar berasal dari `thumbnailUrl`; jika kosong, gunakan panel tipografi Jepang sebagai fallback.
- Headline, kategori, dan tanggal harus tetap terbaca di atas overlay gambar.
- Autoplay berjalan pelan setiap 6,5 detik dan selalu memiliki kontrol indikator yang dapat diklik.
- Carousel adalah highlight editorial, bukan pengganti daftar artikel terbaru di bawahnya.

### Search, Filter, dan Sort (beranda)
- Gunakan form GET agar pencarian dapat dibookmark dan dibagikan, dengan parameter `q`, `category`, dan `sort`.
- Search mencakup judul, excerpt, dan isi teks artikel; filter rubrik memakai slug kategori.
- Urutan yang tersedia: terbaru, terlama, dan judul A-Z.
- Pagination harus mempertahankan semua parameter aktif.
- Empty state menjelaskan bahwa hasil tidak ditemukan dan menyediakan aksi untuk menghapus filter.
- Search diperbarui realtime dengan debounce 350 ms; perubahan rubrik dan urutan langsung memperbarui URL serta hasil.

### Search Detail dan Sidebar Editorial
- Halaman `/search` mempertahankan gaya editorial yang sama, tetapi memberi ruang untuk hasil keyword, ranking relevansi, filter kategori/tag, sorting, dan pagination.
- Search query mencakup judul, excerpt, isi teks, kategori, dan tag. Hasil dengan kecocokan judul mendapat prioritas tertinggi.
- Sidebar homepage memakai blok Trending yang lebih dominan dengan nomor ranking dan metrik views, lalu blok Recent dengan daftar ringkas.
- Detail artikel mempertahankan Related, Top views, dan Recently sebagai modul discovery sekunder.
- Gunakan hierarchy berita: label rubrik kecil, headline jelas, metadata ringan. Hindari menumpuk chip atau kartu dekoratif di area sidebar.

### Motion dan Scroll
- GSAP mengatur entrance dan route transition pada `components/gsap-shell.tsx`; Lenis mengatur smooth scrolling dengan satu ticker GSAP.
- Transition dibuat singkat dan editorial: opacity + gerak vertikal kecil, bukan page wipe atau efek berlebihan.
- Semua resource/listener harus dibersihkan saat unmount atau route berubah.
- Saat `prefers-reduced-motion: reduce` aktif, Lenis dan GSAP transition dimatikan dan browser kembali ke scroll native.
- Gunakan genjutsu sebagai acuan interaction thesis dan mini-audit anti-slop; dependency runtime tetap GSAP/Lenis.

### Halaman Artikel
- Container baca `max-w-prose mx-auto px-4`.
- Header artikel: chip kategori, H1, meta (penulis · tanggal · waktu baca opsional), thumbnail full-width `rounded-2xl`.
- Konten: plugin **`@tailwindcss/typography`** → bungkus `<article class="prose prose-gray">`, override: heading tetap gray-900, link `text-red-600 no-underline hover:underline`, gambar & blockquote `rounded-2xl`. Ini satu-satunya cara rapi merender HTML dari editor.
- Footer artikel: kartu penulis kecil + CTA "Artikel lainnya".

### Tombol
| Varian | Class |
|---|---|
| Primary | `bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2.5 font-medium transition-colors` |
| Secondary | `border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 rounded-full px-6 py-2.5` |
| Ghost/link | `text-red-600 hover:text-red-700 font-medium` |

### Badge / Chip
- Kategori: `bg-red-100 text-red-700 text-xs font-medium rounded-full px-3 py-1`
- Status draft/published (admin): `bg-gray-100 text-gray-600` / `bg-emerald-50 text-emerald-600`

### Section pattern (publik)
Selang-seling: `bg-white` → `bg-gray-50`. Judul section pola situs referensi: eyebrow kecil (opsional, `text-red-600 font-semibold uppercase text-sm`) + H2 bold + satu kalimat deskripsi `text-gray-600`, semuanya center atau kiri konsisten.

### Aksen estetika Jepang (khas BenkyouLab)
- Ornamen teks Jepang dekoratif (contoh dari situs: 「日本語を学ぼう」「未来を築く」) sebagai elemen besar samar — `text-gray-100`/`text-red-50` ukuran ekstra besar, posisi absolut di belakang hero/footer.
- Emoji kecil pada kartu fitur boleh dipertahankan (🌸🎌) — itu ciri situs aslinya.
- Tagline bilingual JP→ID pada footer.

---

## 3. Penerapan per Halaman

| Halaman | Penerapan token |
|---|---|
| Beranda `/` | Hero editorial, quick search di navbar, search/filter detail realtime, grid artikel, sidebar Trending/Recent, pagination sederhana |
| Detail `/artikel/[slug]` | Pola "Halaman Artikel" §2, section terkait `bg-gray-50` |
| Kategori `/kategori/[slug]` | Hub rubrik seperti Berita Jepang, JLPT, MEXT, Budaya, dan Bahasa; grid Post Card |
| Search `/search` | Search detail berbasis keyword, relevansi, filter kategori/tag, sorting, dan pagination |
| Tag `/tag/[slug]` | Landing page topik dengan daftar artikel published dan metadata tag |
| Login `/login` | Kartu tunggal putih center `rounded-2xl shadow-md`, logo, input `rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-100` |
| Admin | Bebas lebih fungsional, tapi tetap DM Sans + vermilion + radius ringan agar konsisten |

## 4. Aturan Main (do / don't)

✅ Gunakan kertas hangat (`#f7f5f0`), tinta gelap (`#20211f`), dan vermilion (`#c83c2d`) sebagai aksen; pakai garis, ritme whitespace, dan hierarki editorial.
❌ Hindari kumpulan kartu mengambang, pill berulang, gradient dekoratif, dan ornamen yang mengambil perhatian dari judul artikel.

## 5. Implementasi Teknis Ringkas

```css
/* src/app/globals.css — Tailwind v4 */
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-dm-sans), sans-serif;
  --font-display: var(--font-noto-serif-jp), serif;
}
```

```ts
// src/app/layout.tsx
import { DM_Sans, Noto_Serif_JP } from "next/font/google";
```

Dependensi tambahan Fase 5: `npm i -D @tailwindcss/typography`
