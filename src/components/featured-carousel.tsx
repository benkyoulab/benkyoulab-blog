"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SafeImg from "@/components/safe-img";
import { formatTanggal } from "@/lib/format-date";

type FeaturedArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
  categoryName: string | null;
  tags?: Array<{ name: string; slug: string }>;
};

export default function FeaturedCarousel({ articles }: { articles: FeaturedArticle[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (articles.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % articles.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [articles.length]);

  if (articles.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-end border border-[#d8d2c7] bg-[#ebe8df] p-6 dark:border-[#3b3c37] dark:bg-[#2c2d29]">
        <p className="font-display text-5xl text-[#c83c2d]/70">記事</p>
      </div>
    );
  }

  const article = articles[active];

  return (
    <div className="relative overflow-hidden border border-[#d8d2c7] bg-[#20211f] dark:border-[#3b3c37]">
      <div className="relative aspect-[4/3]">
        <AnimatePresence mode="wait">
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {article.thumbnailUrl ? (
              <SafeImg src={article.thumbnailUrl} alt="" className="h-full w-full object-cover opacity-75" />
            ) : (
              <div className="font-display flex h-full w-full items-center justify-center bg-[#ebe8df] text-8xl text-[#c83c2d]/70 dark:bg-[#2c2d29]">
                記事
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#20211f] via-[#20211f]/35 to-transparent" />
            <Link href={`/artikel/${article.slug}`} className="absolute inset-0" aria-label={`Baca: ${article.title}`} />
            <div className="absolute right-5 bottom-5 left-5 text-white sm:right-7 sm:bottom-7 sm:left-7">
              <p className="text-[0.68rem] font-bold tracking-[0.14em] text-[#f2a39b] uppercase">
                {article.categoryName ?? "Catatan"} · {article.publishedAt ? formatTanggal(article.publishedAt) : "Terbaru"}
              </p>
              <h2 className="mt-2 max-w-lg text-2xl leading-tight font-bold tracking-[-0.03em] sm:text-3xl">
                {article.title}
              </h2>
              {article.excerpt && <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/75">{article.excerpt}</p>}

              {article.tags && article.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={`${article.slug}-${tag.slug}`}
                      href={`/tag/${tag.slug}`}
                      className="rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {articles.length > 1 && (
        <div className="absolute top-5 right-5 flex items-center gap-2" aria-label="Pilih highlight">
          {articles.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Highlight ${index + 1}: ${item.title}`}
              aria-current={index === active}
              className={`h-1.5 transition-all ${index === active ? "w-8 bg-[#f2a39b]" : "w-3 bg-white/50 hover:bg-white"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
