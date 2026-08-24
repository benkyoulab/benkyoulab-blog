import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories } from "@/db/schema";
import PostCard from "@/components/post-card";

export const revalidate = 300;

const PER_PAGE = 12;

export default async function HomePage({
  searchParams,
}: PageProps<"/">) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const rows = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      thumbnailUrl: posts.thumbnailUrl,
      publishedAt: posts.publishedAt,
      authorName: users.name,
      categoryName: categories.name,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(PER_PAGE + 1)
    .offset((page - 1) * PER_PAGE);

  const hasMore = rows.length > PER_PAGE;
  const items = rows.slice(0, PER_PAGE);

  return (
    <main className="flex-1">
      {/* hero ringkas dengan aksen kanji samar */}
      <section className="relative overflow-hidden bg-white">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 right-0 hidden select-none text-[10rem] leading-none font-bold text-red-50 md:block"
        >
          日本語
        </span>
        <div className="relative mx-auto max-w-5xl px-4 pt-14 pb-10">
          <p className="text-sm font-semibold text-red-600 uppercase">Benkyou Lab</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Belajar bahasa Jepang, langkah demi langkah
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-gray-600">
            Materi kanji, tata bahasa, kosakata, dan tips latihan — ditulis untuk pemula sampai
            menengah.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-4">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <p className="text-4xl">🌸</p>
              <h2 className="mt-4 text-xl font-semibold">Belum ada artikel</h2>
              <p className="mt-1 text-gray-600">
                Publish artikel pertama dari{" "}
                <Link href="/admin" className="text-red-600 hover:underline">
                  dashboard admin
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
              {(page > 1 || hasMore) && (
                <nav className="mt-10 flex items-center justify-center gap-3">
                  {page > 1 && (
                    <Link
                      href={page === 2 ? "/" : `/?page=${page - 1}`}
                      className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium hover:bg-gray-100"
                    >
                      ← Sebelumnya
                    </Link>
                  )}
                  {hasMore && (
                    <Link
                      href={`/?page=${page + 1}`}
                      className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Berikutnya →
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
