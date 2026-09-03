import Link from "next/link";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories, tags, postTags } from "@/db/schema";
import PostCard from "@/components/post-card";
import FadeIn from "@/components/fade-in";
import FeaturedCarousel from "@/components/featured-carousel";
import ArticleFilters from "@/components/article-filters";
import KanjiCalligraphy from "@/components/kanji-calligraphy";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const PER_PAGE = 12;

type Props = {
  searchParams: Promise<{
    page?: string | string[];
    q?: string | string[];
    category?: string | string[];
    tag?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const rawTagValues = Array.isArray(params.tag) ? params.tag : params.tag ? [params.tag] : [];
  const tagSlugs = Array.from(
    new Set(
      rawTagValues
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
  const tag = tagSlugs.length > 0 ? tagSlugs.join(",") : undefined;
  const sort = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const page = Math.max(1, Number(pageParam) || 1);

  const filters = [eq(posts.status, "published")];
  if (query) {
    filters.push(
      or(
        ilike(posts.title, `%${query}%`),
        ilike(posts.excerpt, `%${query}%`),
        ilike(posts.contentText, `%${query}%`),
        ilike(categories.name, `%${query}%`),
        ilike(tags.name, `%${query}%`),
      )!,
    );
  }
  if (category) filters.push(eq(categories.slug, category));
  if (tagSlugs.length > 0) {
    filters.push(inArray(tags.slug, tagSlugs));
  }

  const orderBy = sort === "oldest" ? asc(posts.publishedAt) : sort === "title" ? asc(posts.title) : desc(posts.publishedAt);

  const [articleRows, catRows, tagRows, trendingRows, recentRows, [{ total }]] = await Promise.all([
    db
      .select({
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        thumbnailUrl: posts.thumbnailUrl,
        publishedAt: posts.publishedAt,
        authorName: users.name,
        categoryName: categories.name,
        tagName: tags.name,
        tagSlug: tags.slug,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(postTags, eq(postTags.postId, posts.id))
      .leftJoin(tags, eq(tags.id, postTags.tagId))
      .where(and(...filters))
      .orderBy(orderBy)
      .limit(PER_PAGE + 1)
      .offset((page - 1) * PER_PAGE),
    db
      .select({ name: categories.name, slug: categories.slug, n: sql<number>`count(${posts.id})::int` })
      .from(categories)
      .leftJoin(posts, eq(posts.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(categories.name),
    db
      .select({ name: tags.name, slug: tags.slug, n: sql<number>`count(${postTags.postId})::int` })
      .from(tags)
      .leftJoin(postTags, eq(postTags.tagId, tags.id))
      .groupBy(tags.id)
      .orderBy(asc(tags.name)),
    db
      .select({
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        publishedAt: posts.publishedAt,
        categoryName: categories.name,
        views: posts.views,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.views), desc(posts.publishedAt))
      .limit(5),
    db
      .select({
        slug: posts.slug,
        title: posts.title,
        publishedAt: posts.publishedAt,
        categoryName: categories.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt))
      .limit(5),
    db
      .select({ total: sql<number>`count(distinct ${posts.id})::int` })
      .from(posts)
      .leftJoin(postTags, eq(postTags.postId, posts.id))
      .leftJoin(tags, eq(tags.id, postTags.tagId))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(...filters)),
  ]);

  const articleMap = new Map<string, { slug: string; title: string; excerpt: string | null; thumbnailUrl: string | null; publishedAt: Date | null; authorName: string | null; categoryName: string | null; tags: Array<{ name: string; slug: string }> }>();
  for (const row of articleRows) {
    const key = row.slug;
    const existing = articleMap.get(key) ?? {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      thumbnailUrl: row.thumbnailUrl,
      publishedAt: row.publishedAt,
      authorName: row.authorName,
      categoryName: row.categoryName,
      tags: [],
    };

    if (row.tagName && row.tagSlug) {
      const seen = existing.tags.some((tag) => tag.slug === row.tagSlug);
      if (!seen) existing.tags.push({ name: row.tagName, slug: row.tagSlug });
    }

    articleMap.set(key, existing);
  }

  const hasMore = articleRows.length > PER_PAGE;
  const items = Array.from(articleMap.values()).slice(0, PER_PAGE);
  const hasFilters = Boolean(query || category || tag || sort === "oldest" || sort === "title");
  const activeTag = tagSlugs.length > 0 ? tagRows.find((entry) => entry.slug === tagSlugs[0]) : null;

  function pageHref(nextPage: number) {
    const next = new URLSearchParams();
    if (nextPage > 1) next.set("page", String(nextPage));
    if (query) next.set("q", query);
    if (category) next.set("category", category);
    if (tagSlugs.length > 0) next.set("tag", tagSlugs.join(","));
    if (sort) next.set("sort", sort);
    const value = next.toString();
    return value ? `/?${value}` : "/";
  }

  return (
    <main className="flex-1 bg-[#f7f5f0] dark:bg-[#171816]">
      {/* HERO */}
      <section className="paper-grid relative overflow-hidden border-b border-[#ded9cf] dark:border-[#353631]">
        <KanjiCalligraphy />
        <span
          aria-hidden
          className="font-display pointer-events-none absolute -top-8 -right-4 hidden select-none text-[11rem] leading-none font-bold text-[#c83c2d]/[0.07] md:block dark:text-red-400/[0.08]"
        >
          日本語
        </span>
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-14 pb-12 sm:pt-20 sm:pb-16">
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
            <div className="space-y-3">
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

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-2 text-xs font-bold tracking-[0.12em] text-gray-400 uppercase">Tag:</span>
                <Link
                  href={tagSlugs.length > 0 ? `/?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}), ...(sort ? { sort } : {}) }).toString() || "/"}` : "/"}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${tagSlugs.length === 0 ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-700"}`}
                >
                  Semua
                </Link>
                {tagRows.map((entry) => {
                  const selected = tagSlugs.includes(entry.slug);
                  const nextTagSlugs = selected ? tagSlugs.filter((slug) => slug !== entry.slug) : [...tagSlugs, entry.slug];
                  const nextTag = nextTagSlugs.length > 0 ? nextTagSlugs.join(",") : undefined;
                  const nextParams = new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}), ...(sort ? { sort } : {}) });
                  if (nextTag) nextParams.set("tag", nextTag);
                  else nextParams.delete("tag");

                  return (
                    <Link
                      key={entry.slug}
                      href={`/?${nextParams.toString()}`}
                      className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${selected ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-700"}`}
                    >
                      #{entry.name}
                      <span className="ml-1 text-[10px] opacity-70">{entry.n}</span>
                    </Link>
                  );
                })}
              </div>

              {tagSlugs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-500 uppercase tracking-[0.1em]">Filter aktif:</span>
                  {tagSlugs.map((slug) => {
                    const tagEntry = tagRows.find((entry) => entry.slug === slug);
                    if (!tagEntry) return null;
                    return (
                      <span key={slug} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                        #{tagEntry.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* DAFTAR ARTIKEL */}
      <section id="artikel" className="bg-[#eeece6] py-16 dark:bg-[#1d1e1b]">
        <div className="mx-auto max-w-6xl px-4">
          <ArticleFilters query={query} category={category ?? ""} sort={sort ?? "latest"} categories={catRows} />

          {items.length === 0 ? (
            <FadeIn>
              <div className="rounded-2xl bg-white p-16 text-center shadow-sm dark:bg-gray-900">
                <p className="font-display text-5xl text-[#c83c2d]/70">検索</p>
                <h2 className="mt-4 text-xl font-semibold dark:text-white">Tidak ada artikel yang cocok</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Coba kata kunci atau rubrik yang berbeda.</p>
                {hasFilters && <Link href="/#artikel" className="mt-5 inline-block text-sm font-bold text-[#c83c2d] hover:underline">Hapus semua filter</Link>}
              </div>
            </FadeIn>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div>
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
                        href={pageHref(page - 1)}
                        className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                      >
                        ← Sebelumnya
                      </Link>
                    )}
                    {hasMore && (
                      <Link
                        href={pageHref(page + 1)}
                        className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                      >
                        Berikutnya →
                      </Link>
                    )}
                  </nav>
                )}
              </div>

              <aside className="space-y-6 pt-2">
                <div className="rounded-3xl border border-[#e4ddd0] bg-[#20211f] p-5 text-white shadow-sm dark:border-[#303330]">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[0.68rem] font-bold tracking-[0.16em] text-[#f2a39b] uppercase">Trending</p>
                    <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[0.6rem] font-medium text-white/80">Hot</span>
                  </div>
                  <div className="space-y-3">
                    {trendingRows.map((story, index) => (
                      <Link key={story.slug} href={`/artikel/${story.slug}`} className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition-colors hover:border-[#f2a39b]/40 hover:bg-white/[0.08]">
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2a39b] text-xs font-bold text-[#20211f]">{index + 1}</span>
                          <div>
                            <p className="text-[0.58rem] font-semibold tracking-[0.12em] text-[#f2a39b] uppercase">{story.categoryName ?? "Artikel"}</p>
                            <h3 className="mt-1 text-sm leading-snug font-semibold text-white group-hover:text-red-100">{story.title}</h3>
                            <p className="mt-1 text-[0.7rem] text-white/60">{story.views ?? 0} views</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#e4ddd0] bg-white p-5 shadow-sm dark:border-[#303330] dark:bg-[#1b1c1a]">
                  <p className="text-[0.68rem] font-bold tracking-[0.16em] text-[#c83c2d] uppercase">Recent</p>
                  <div className="mt-4 space-y-3">
                    {recentRows.map((story) => (
                      <Link key={story.slug} href={`/artikel/${story.slug}`} className="block rounded-2xl border border-[#efe9df] p-3 transition-colors hover:border-red-200 hover:bg-red-50/60 dark:border-[#2d2f2b] dark:hover:border-red-500/30 dark:hover:bg-red-500/5">
                        <p className="text-[0.58rem] font-semibold tracking-[0.12em] text-gray-500 uppercase dark:text-gray-400">{story.categoryName ?? "Artikel"}</p>
                        <h4 className="mt-1 text-sm leading-snug font-semibold text-[#20211f] dark:text-white">{story.title}</h4>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
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
