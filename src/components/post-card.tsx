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
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 text-4xl">
        🎌
      </div>
    );
  }
  return <SafeImg src={url} alt="" className="h-full w-full object-cover" />;
}

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <m.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="h-full"
    >
      <Link
        href={`/artikel/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-video overflow-hidden">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <Thumb url={post.thumbnailUrl} />
          </div>
          {post.categoryName && (
            <span className="absolute top-3 left-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {post.categoryName}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-red-600">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
          )}
          <p className="mt-auto pt-4 text-xs text-gray-400">
            {post.publishedAt ? formatTanggal(post.publishedAt) : "—"} · {post.authorName ?? "Tim"}
          </p>
        </div>
      </Link>
    </m.div>
  );
}
