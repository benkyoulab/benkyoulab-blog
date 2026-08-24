"use client";

import Link from "next/link";
import { motion } from "motion/react";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/kategori", label: "Kategori" },
  { href: "/tentang", label: "Tentang" },
];

// Catatan: sengaja tidak ada link login/admin di sini — akses penulis hanya via URL langsung /login.
export default function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 right-2 select-none text-[9rem] leading-none font-bold text-red-50 dark:text-red-500/5"
      >
        学
      </span>
      <div className="relative mx-auto max-w-5xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between"
        >
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 font-bold text-white">
                勉
              </span>
              <span className="text-lg font-bold tracking-tight dark:text-white">
                Benkyou<span className="text-red-600">Lab</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              日本語を学ぼう、未来を築く — belajar bahasa Jepang langkah demi langkah, dari huruf
              pertama sampai percaya diri mengobrol.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Jelajahi
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-600 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        <p className="relative mt-10 border-t border-gray-200/70 pt-6 text-xs text-gray-400 dark:border-gray-800">
          © {new Date().getFullYear()} Benkyou Lab · Dibuat dengan 🍵 dan banyak kanji
        </p>
      </div>
    </footer>
  );
}
