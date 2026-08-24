import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ponytail: webpack utk dev+build karena drive E: exFAT — Turbopack FS cache
  // panic saat bikin junction point di exFAT (OS error 1).
  // Upgrade path: hapus kedua flag ini bila project pindah ke drive NTFS.
};

export default nextConfig;
