import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories } from "@/db/schema";
import PostCard from "@/components/post-card";
import FadeIn from "@/components/fade-in";
import FeaturedCarousel from "@/components/featured-carousel";

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
    <main className="flex-1 bg-[#f7f5f0] dark:bg-[#171816]">
      {/* HERO */}
      <section className="paper-grid relative overflow-hidden border-b border-[#ded9cf] dark:border-[#353631]">
        <span
          aria-hidden
          className="font-display pointer-events-none absolute -top-8 -right-4 hidden select-none text-[11rem] leading-none font-bold text-[#c83c2d]/[0.07] md:block dark:text-red-400/[0.08]"
        >
          日本語
        </span>
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <FadeIn>
                <p className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-[#c83c2d] uppercase dark:text-red-400">
                  <span className="h-px w-8 bg-[#c83c2d]" />
                  ブログ · Catatan dari Jepang
                </p>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h1 className="mt-5 max-w-2xl text-4xl leading-[1.08] font-bold tracking-[-0.04em] text-[#20211f] sm:text-6xl dark:text-white">
                  Mengikuti Jepang,{" "}
                  <span className="relative inline-block text-[#c83c2d]">
                    satu cerita setiap waktu
                    <svg
                      aria-hidden
                      viewBox="0 0 220 10"
                      className="absolute -bottom-1 left-0 w-full text-[#c83c2d]/30 dark:text-red-400/30"
                      fill="none"
                    >
                      <path d="M2 8C60 2 160 2 218 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.16}>
                <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-[#5c5b55] dark:text-gray-400">
                  Berita, panduan, dan cerita tentang Jepang — dari kabar terkini sampai JLPT,
                  MEXT, budaya, dan bahasa sehari-hari. Ringkas, jernih, dan mudah diikuti.
                </p>
              </FadeIn>
              <FadeIn delay={0.24}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="#artikel"
                    className="bg-[#c83c2d] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#a92f24] hover:shadow-md active:scale-95"
                  >
                    Baca yang terbaru ↓
                  </Link>
                  <Link
                    href="/kategori"
                    className="border border-[#cfc9be] bg-transparent px-6 py-3 text-sm font-bold text-[#20211f] transition-colors hover:border-[#20211f] dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-300"
                  >
                    Jelajahi rubrik
                  </Link>
                </div>
              </FadeIn>

              {/* statistik */}
              <FadeIn delay={0.32}>
                <dl className="mt-12 grid max-w-md grid-cols-3 gap-0 border-y border-[#d8d2c7] dark:border-[#3b3c37]">
                  {[
                    { n: total, label: "artikel" },
                    { n: catRows.length, label: "kategori" },
                    { n: "100%", label: "gratis" },
                  ].map((s) => (
                    <div key={s.label} className="border-r border-[#d8d2c7] px-4 py-4 first:pl-0 last:border-0 dark:border-[#3b3c37]">
                      <dt className="order-2 text-xs text-gray-500 dark:text-gray-400">{s.label}</dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">{s.n}</dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <FeaturedCarousel articles={page === 1 ? items.slice(0, 3) : []} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CHIP KATEGORI */}
      <section className="border-b border-[#ded9cf] bg-[#f7f5f0] dark:border-gray-800 dark:bg-[#171816]">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <FadeIn y={10}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-bold tracking-[0.12em] text-gray-400 uppercase">Jelajahi:</span>
              {catRows.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kategori/${c.slug}`}
                  className="border-b border-[#cfc9be] px-2 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#c83c2d] hover:text-[#c83c2d] dark:border-gray-700 dark:text-gray-300 dark:hover:text-red-400"
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
      <section id="artikel" className="bg-[#eeece6] py-16 dark:bg-[#1d1e1b]">
        <div className="mx-auto max-w-6xl px-4">
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
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.14em] text-[#c83c2d] uppercase">Edisi terbaru</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[#20211f] dark:text-white">Cerita dan kabar Jepang</h2>
                  </div>
                  <span className="hidden text-sm text-gray-500 sm:block">Yang baru, yang penting, yang layak diikuti.</span>
                </div>
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
      <section className="bg-[#f7f5f0] py-16 dark:bg-[#171816]">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="relative overflow-hidden border-y-2 border-[#c83c2d] bg-[#20211f] px-8 py-12 text-center sm:px-12 dark:bg-[#272824]">
              <span aria-hidden className="font-display pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 hidden select-none text-[7rem] leading-none font-bold text-white/[0.08] sm:block">
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
                className="mt-6 inline-block bg-[#f7f5f0] px-7 py-3 text-sm font-bold text-[#20211f] shadow-sm transition-all hover:bg-white active:scale-95"
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
