"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ThemeToggle from "@/components/theme-toggle";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/kategori", label: "Kategori" },
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
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-gray-100 bg-white/85 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/85"
          : "border-transparent bg-white/60 backdrop-blur dark:bg-gray-950/60"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 font-bold text-white shadow-sm transition-transform group-hover:-rotate-6">
            勉
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Benkyou<span className="text-red-600">Lab</span>
          </span>
        </Link>

        {/* nav desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-red-50 dark:bg-red-500/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* tombol hamburger mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Buka menu"
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
            className="overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur md:hidden dark:border-gray-800 dark:bg-gray-950/95"
          >
            <div className="space-y-1 px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
