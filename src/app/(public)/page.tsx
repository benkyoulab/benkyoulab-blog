import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories } from "@/db/schema";
import PostCard from "@/components/post-card";
import FadeIn from "@/components/fade-in";
import KanjiFloat from "@/components/kanji-float";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const PER_PAGE = 12;

type Props = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [rows, catRows, [{ total }]] = await Promise.all([
    db
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
      .offset((page - 1) * PER_PAGE),
    db
      .select({ name: categories.name, slug: categories.slug, n: sql<number>`count(${posts.id})::int` })
      .from(categories)
      .leftJoin(posts, eq(posts.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(categories.name),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.status, "published")),
  ]);

  const hasMore = rows.length > PER_PAGE;
  const items = rows.slice(0, PER_PAGE);

  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-4 hidden select-none text-[11rem] leading-none font-bold text-red-50 md:block dark:text-red-500/5"
        >
          日本語
        </span>
        <div className="mx-auto max-w-5xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <FadeIn>
                <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <span>🎌</span> ブログ · Blog Belajar Bahasa Jepang
                </p>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                  Belajar bahasa Jepang,{" "}
                  <span className="relative inline-block text-red-600">
                    langkah demi langkah
                    <svg
                      aria-hidden
                      viewBox="0 0 220 10"
                      className="absolute -bottom-1 left-0 w-full text-red-200 dark:text-red-500/30"
                      fill="none"
                    >
                      <path d="M2 8C60 2 160 2 218 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.16}>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  Materi kanji, tata bahasa, kosakata, dan tips belajar — ditulis ringkas, praktis,
                  dan gratis. Mulai dari artikel terbaru di bawah.
                </p>
              </FadeIn>
              <FadeIn delay={0.24}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="#artikel"
                    className="rounded-full bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95"
                  >
                    Mulai Baca ↓
                  </Link>
                  <Link
                    href="/kategori"
                    className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    Lihat Kategori
                  </Link>
                </div>
              </FadeIn>

              {/* statistik */}
              <FadeIn delay={0.32}>
                <dl className="mt-12 grid max-w-md grid-cols-3 gap-4">
                  {[
                    { n: total, label: "artikel" },
                    { n: catRows.length, label: "kategori" },
                    { n: "100%", label: "gratis" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
                      <dt className="order-2 text-xs text-gray-500 dark:text-gray-400">{s.label}</dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">{s.n}</dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>

            {/* dekorasi kanji mengambang (desktop) */}
            <div className="hidden lg:block">
              <KanjiFloat />
            </div>
          </div>
        </div>
      </section>

      {/* CHIP KATEGORI */}
      <section className="border-y border-gray-100 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-gray-950/70">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <FadeIn y={10}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-semibold text-gray-400">Jelajahi:</span>
              {catRows.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kategori/${c.slug}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                >
                  {c.name}
                  <span className="ml-1.5 text-xs text-gray-400">{c.n}</span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* DAFTAR ARTIKEL */}
      <section id="artikel" className="bg-gray-50 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4">
          {items.length === 0 ? (
            <FadeIn>
              <div className="rounded-2xl bg-white p-16 text-center shadow-sm dark:bg-gray-900">
                <p className="text-4xl">🌸</p>
                <h2 className="mt-4 text-xl font-semibold dark:text-white">Belum ada artikel</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Segera hadir — nantikan materi pertamanya.</p>
              </div>
            </FadeIn>
          ) : (
            <>
              <FadeIn>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Artikel Terbaru</h2>
              </FadeIn>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
              {(page > 1 || hasMore) && (
                <nav className="mt-10 flex items-center justify-center gap-3">
                  {page > 1 && (
                    <Link
                      href={page === 2 ? "/" : `/?page=${page - 1}`}
                      className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                      ← Sebelumnya
                    </Link>
                  )}
                  {hasMore && (
                    <Link
                      href={`/?page=${page + 1}`}
                      className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
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

      {/* CTA strip */}
      <section className="bg-white py-14 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-600 to-red-700 px-8 py-12 text-center shadow-md sm:px-12">
              <span aria-hidden className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 hidden select-none text-[7rem] leading-none font-bold text-white/10 sm:block">
                学
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Siap mulai belajar hari ini?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-red-100">
                Satu artikel tiap hari lebih baik daripada maraton sekali sebulan.
              </p>
              <Link
                href="#artikel"
                className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-sm font-bold text-red-600 shadow-sm transition-all hover:shadow-md active:scale-95"
              >
                Pilih Artikel Pertamamu
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
