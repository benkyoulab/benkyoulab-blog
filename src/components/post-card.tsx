"use client";

import Link from "next/link";
import { m } from "motion/react";
import SafeImg from "@/components/safe-img";
import { formatTanggal } from "@/lib/format-date";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
  authorName: string | null;
  categoryName: string | null;
};

// ponytail: <img> via SafeImg (fallback placeholder) — next/image butuh daftar domain host eksternal.
function Thumb({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 text-4xl dark:from-red-500/10 dark:to-gray-800">
        🎌
      </div>
    );
  }
  return <SafeImg src={url} alt="" className="h-full w-full object-cover" />;
}

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <m.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="h-full"
    >
      <Link
        href={`/artikel/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_0_rgba(32,33,31,0.08)] ring-1 ring-[#e8e4db] transition-shadow hover:shadow-[0_12px_30px_rgba(32,33,31,0.1)] dark:bg-[#20211f] dark:ring-[#353631]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#ebe8df] dark:bg-[#2c2d29]">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <Thumb url={post.thumbnailUrl} />
          </div>
          {post.categoryName && (
            <span className="absolute top-3 left-3 bg-[#c83c2d] px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.08em] text-white uppercase">
              {post.categoryName}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col border-t-2 border-[#c83c2d] p-5">
          <h3 className="line-clamp-2 text-[1.05rem] leading-snug font-bold text-[#20211f] transition-colors group-hover:text-[#c83c2d] dark:text-gray-100 dark:group-hover:text-red-400">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {post.excerpt}
            </p>
          )}
          <p className="mt-auto pt-4 text-xs text-gray-400">
            {post.publishedAt ? formatTanggal(post.publishedAt) : "—"} · {post.authorName ?? "Tim"}
          </p>
        </div>
      </Link>
    </m.div>
  );
}
