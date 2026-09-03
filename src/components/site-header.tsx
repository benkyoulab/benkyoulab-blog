"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ThemeToggle from "@/components/theme-toggle";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/#artikel", label: "Terbaru" },
  { href: "/kategori", label: "Rubrik" },
  { href: "/tentang", label: "Tentang" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

    useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href === "/#artikel" ? false : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-gray-100 bg-white/85 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/85"
          : "border-transparent bg-white/60 backdrop-blur dark:bg-gray-950/60"
      }`}
    >
      <div className="hidden border-b border-[#e8e4db] bg-[#20211f] text-[#f7f5f0] dark:border-[#353631] md:block">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-between px-4 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
          <span>Blog berita & info Jepang</span>
          <span className="text-[#f2a39b]">Kabar · Panduan · Cerita</span>
        </div>
      </div>

      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-display flex h-10 w-10 items-center justify-center border border-[#c83c2d] text-lg text-[#c83c2d] transition-transform group-hover:-rotate-6">
            勉
          </span>
          <span>
            <span className="block text-[1.05rem] font-bold tracking-[-0.03em] text-[#20211f] dark:text-white">
              Benkyou<span className="text-red-600">Lab</span>
            </span>
            <span className="hidden text-[0.62rem] font-bold tracking-[0.12em] text-gray-400 uppercase sm:block">
              Japan, explained
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          <form action="/search" method="get" role="search" className="mr-2 flex w-52 items-center border-b border-[#cfc9be] transition-colors focus-within:border-[#c83c2d] dark:border-gray-700">
            <label htmlFor="navbar-search" className="sr-only">Cari artikel</label>
            <span aria-hidden className="mr-2 text-sm text-[#c83c2d]">⌕</span>
            <input
              id="navbar-search"
              name="q"
              type="search"
              placeholder="Cari artikel..."
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#20211f] outline-none placeholder:text-gray-400 dark:text-white"
            />
          </form>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute right-4 bottom-0 left-4 -z-10 h-px bg-red-600 dark:bg-red-400"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <span className="mx-2 h-5 w-px bg-[#d8d2c7] dark:bg-[#3b3c37]" />
          <ThemeToggle />
        </nav>

        {/* tombol hamburger mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <div className="relative h-4 w-5">
              <motion.span
                animate={open ? { rotate: 45, top: 7 } : { rotate: 0, top: 0 }}
                className="absolute left-0 h-0.5 w-full rounded bg-current"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="absolute top-[7px] left-0 h-0.5 w-full rounded bg-current"
              />
              <motion.span
                animate={open ? { rotate: -45, top: 7 } : { rotate: 0, top: 14 }}
                className="absolute left-0 h-0.5 w-full rounded bg-current"
              />
            </div>
          </button>
        </div>
      </div>

      {/* menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden border-t border-gray-100 bg-[#f7f5f0]/95 backdrop-blur md:hidden dark:border-gray-800 dark:bg-[#171816]/95"
          >
            <div className="border-b border-[#ded9cf] px-4 py-3 dark:border-[#353631]">
              <p className="mb-2 text-[0.65rem] font-bold tracking-[0.14em] text-[#c83c2d] uppercase">Navigasi</p>
              <form action="/search" method="get" role="search" className="mb-3 flex items-center border-b border-[#bdb7ac] dark:border-[#4a4b45]">
                <label htmlFor="mobile-navbar-search" className="sr-only">Cari artikel</label>
                <span aria-hidden className="mr-2 text-sm text-[#c83c2d]">⌕</span>
                <input
                  id="mobile-navbar-search"
                  name="q"
                  type="search"
                  placeholder="Cari berita, JLPT, budaya..."
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#20211f] outline-none placeholder:text-gray-400 dark:text-white"
                />
              </form>
              <div className="flex gap-5 overflow-x-auto pb-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`shrink-0 border-b-2 px-0 py-2 text-sm font-bold ${
                    isActive(item.href)
                      ? "border-[#c83c2d] text-[#c83c2d] dark:text-red-400"
                      : "border-transparent text-gray-700 hover:border-[#cfc9be] dark:text-gray-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
