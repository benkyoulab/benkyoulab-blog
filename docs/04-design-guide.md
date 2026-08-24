# Design Guide — Benkyou Lab Blog

> Referensi visual: [benkyoulab.online](https://benkyoulab.online) — diambil langsung dari CSS produksi situs tersebut (bukan tebakan).
> Tujuan: blog terasa satu brand dengan landing page utama.

---

## 1. Design Tokens

Semua warna di bawah adalah **palette bawaan Tailwind** → tidak perlu custom theme, pakai class langsung (`bg-red-600`, `text-gray-900`, dst).

### Warna
| Token | Nilai | Kelas Tailwind | Pemakaian |
|---|---|---|---|
| Primary | `#dc2626` | `red-600` | Tombol utama, link aktif, ikon aksen |
| Primary hover | `#b91c1c` | `red-700` | Hover tombol primary |
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
| UI + heading | **Inter** | Muat via `next/font/google`, variable `--font-inter`, `display: swap` |
| Mono / aksen Jepang | `ui-monospace` stack | Untuk label dekoratif berbahasa Jepang |

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
Sticky putih semi-transparan + blur (`sticky top-0 bg-white/80 backdrop-blur`), border bawah tipis. Kiri: logo wordmark "BenkyouLab" (「勉強」 sebagai aksen opsional). Kanan: nav (Beranda, Kategori) + tombol pill primary.

### Post Card (beranda & arsip)
```
┌─────────────────────┐
│ thumbnail 16:9      │  rounded-t-2xl, object-cover
│  ┌──────────┐       │
│  │chip kat. │       │  absolute top-3 left-3, bg-red-100 text-red-700
│  └──────────┘       │
├─────────────────────┤
│ Judul (semibold)    │  text-gray-900, max 2 baris (line-clamp-2)
│ Excerpt (2 baris)   │  text-gray-600, line-clamp-2, text-sm
│ 📅 tanggal · ✍ penulis │  text-gray-400 text-xs
└─────────────────────┘
bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition
```

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
| Beranda `/` | Hero ringkas (H1 + subtext + aksen kanji samar), grid Post Card 3 kolom (`md:grid-cols-3 gap-6`), pagination pill |
| Detail `/artikel/[slug]` | Pola "Halaman Artikel" §2, section terkait `bg-gray-50` |
| Kategori `/kategori/[slug]` | Header kategori dengan chip besar `bg-red-100`, grid Post Card |
| Login `/login` | Kartu tunggal putih center `rounded-2xl shadow-md`, logo, input `rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-100` |
| Admin | Bebas lebih fungsional, tapi tetap Inter + primary red-600 + radius pill/kartu agar konsisten |

## 4. Aturan Main (do / don't)

✅ Konsisten satu primary (red-600); putih dominan; abu untuk teks; radius besar; banyak whitespace.
❌ Jangan campur warna primary kedua (ungu/biru hanya jika benar-benar perlu); jangan full-dark theme; jangan sudut tajam; jangan border tebal.

## 5. Implementasi Teknis Ringkas

```css
/* src/app/globals.css — Tailwind v4 */
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-inter), system-ui, sans-serif;
}
/* Warna tidak perlu didaftarkan: semua token di atas = palette Tailwind standar */
```

```ts
// src/app/layout.tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// <html className={inter.variable}>
```

Dependensi tambahan Fase 5: `npm i -D @tailwindcss/typography`
