import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ponytail: drive E: exFAT tidak mendukung junction point —
  // - `next dev` wajib --webpack (script di package.json); Turbopack dev panic saat bikin junction utk FS cache.
  // - `next build` TIDAK jalan di mesin lokal (Turbopack: junction panic; webpack: EISDIR/crash worker).
  //   Build produksi diserahkan ke Vercel (Linux, aman). Upgrade path: hapus flag --webpack
  //   bila project pindah ke drive NTFS.
};

export default nextConfig;
