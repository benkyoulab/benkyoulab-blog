"use client";

import { m } from "motion/react";
import FadeIn from "@/components/fade-in";

const CARDS = [
  { k: "日", cls: "top-[10%] left-[12%] text-5xl text-[#c83c2d] dark:text-red-400", d: 3.6 },
  { k: "語", cls: "top-[28%] right-[10%] text-4xl text-[#20211f] dark:text-gray-100", d: 4.3 },
  { k: "学", cls: "bottom-[20%] left-[24%] text-3xl text-[#20211f] dark:text-gray-100", d: 5.0 },
  { k: "文", cls: "right-[25%] bottom-[8%] text-6xl text-[#c83c2d] dark:text-red-400", d: 4.0 },
];

// Kartu kanji mengambang untuk hero beranda — murni dekoratif.
export default function KanjiFloat() {
  return (
    <FadeIn delay={0.2}>
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="relative mx-auto aspect-square w-full max-w-sm border border-[#d8d2c7] dark:border-[#3b3c37]"
      >
        <span
          aria-hidden
          className="absolute inset-5 border border-[#d8d2c7] dark:border-[#3b3c37]"
        />
        <m.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          aria-hidden
          className="absolute inset-[-10px] border border-dashed border-[#c83c2d]/40 dark:border-red-500/20"
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
            className={`font-display absolute flex items-center justify-center font-bold ${c.cls}`}
          >
            {c.k}
          </m.span>
        ))}
        <span className="absolute right-6 bottom-5 text-[0.65rem] font-bold tracking-[0.2em] text-gray-400 uppercase">
          study / note 01
        </span>
      </m.div>
    </FadeIn>
  );
}
