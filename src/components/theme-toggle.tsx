"use client";

import { useState } from "react";

// Toggle tema: manual + persist. Default pertama kali mengikuti preferensi sistem
// (sudah diterapkan oleh theme-init.ts sebelum paint).
export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="flex h-10 w-10 items-center justify-center rounded-full text-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {dark ? "🌞" : "🌙"}
    </button>
  );
}
