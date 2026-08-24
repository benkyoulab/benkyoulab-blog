"use client";

import { m } from "motion/react";
import FadeIn from "@/components/fade-in";

const CARDS = [
  {
    k: "日",
    cls: "top-[8%] left-[10%] h-24 w-24 text-5xl text-red-600 dark:text-red-400",
    d: 3.6,
  },
  {
    k: "語",
    cls: "top-[30%] right-[6%] h-20 w-20 text-4xl text-gray-900 dark:text-gray-100",
    d: 4.3,
  },
  {
    k: "学",
    cls: "bottom-[18%] left-[22%] h-16 w-16 text-3xl text-gray-900 dark:text-gray-100",
    d: 5.0,
  },
  {
    k: "文",
    cls: "right-[24%] bottom-[6%] h-28 w-28 text-6xl text-red-600 dark:text-red-400",
    d: 4.0,
  },
];

// Kartu kanji mengambang untuk hero beranda — murni dekoratif.
export default function KanjiFloat() {
  return (
    <FadeIn delay={0.2}>
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="relative mx-auto aspect-square w-full max-w-sm"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-red-100 to-gray-100 dark:from-red-500/10 dark:to-gray-800/60"
        />
        <m.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          aria-hidden
          className="absolute inset-[-14px] rounded-[2.8rem] border-2 border-dashed border-red-200/70 dark:border-red-500/20"
        />
        {CARDS.map((c) => (
          <m.span
            key={c.k}
            initial={{ y: 0 }}
            animate={{ y: [0, -14, 0] }}
            transition={{
              duration: c.d,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (c.d / 2) % 1.5,
            }}
            aria-hidden
            className={`absolute flex items-center justify-center rounded-2xl bg-white font-bold shadow-lg ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800 ${c.cls}`}
          >
            {c.k}
          </m.span>
        ))}
      </m.div>
    </FadeIn>
  );
}
