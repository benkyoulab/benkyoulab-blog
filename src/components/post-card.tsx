import Link from "next/link";
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

// ponytail: <img> biasa + fallback client via SafeImg — next/image butuh daftar domain host eksternal.
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
    <Link
      href={`/artikel/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden">
        <Thumb url={post.thumbnailUrl} />
        {post.categoryName && (
          <span className="absolute top-3 left-3 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            {post.categoryName}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-red-600">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
        )}
        <p className="mt-auto pt-3 text-xs text-gray-400">
          {post.publishedAt ? formatTanggal(post.publishedAt) : "—"} · {post.authorName ?? "Tim"}
        </p>
      </div>
    </Link>
  );
}
