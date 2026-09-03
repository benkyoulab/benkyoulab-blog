import Link from "next/link";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories, tags, postTags } from "@/db/schema";
import PostCard from "@/components/post-card";
import FadeIn from "@/components/fade-in";

export const revalidate = 300;
export const dynamic = "force-dynamic";

const PER_PAGE = 12;

type Props = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    tag?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
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
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
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
  if (tagSlugs.length > 0) filters.push(inArray(tags.slug, tagSlugs));

  const relevanceOrder = query
    ? sql`
        CASE
          WHEN ${posts.title} ILIKE ${`%${query}%`} THEN 4
          WHEN ${posts.excerpt} ILIKE ${`%${query}%`} THEN 3
          WHEN ${posts.contentText} ILIKE ${`%${query}%`} THEN 2
          WHEN ${categories.name} ILIKE ${`%${query}%`} THEN 2
          WHEN ${tags.name} ILIKE ${`%${query}%`} THEN 2
          ELSE 0
        END DESC,
        ${posts.publishedAt} DESC
      `
    : sort === "oldest"
      ? asc(posts.publishedAt)
      : sort === "title"
        ? asc(posts.title)
        : desc(posts.publishedAt);

  const [articleRows, catRows, [{ total }]] = await Promise.all([
    db
      .select({
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        thumbnailUrl: posts.thumbnailUrl,
        publishedAt: posts.publishedAt,
        authorName: users.name,
        categoryName: categories.name,
        categorySlug: categories.slug,
        tagName: tags.name,
        tagSlug: tags.slug,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(postTags, eq(postTags.postId, posts.id))
      .leftJoin(tags, eq(tags.id, postTags.tagId))
      .where(and(...filters))
      .orderBy(relevanceOrder)
      .limit(PER_PAGE + 1)
      .offset((page - 1) * PER_PAGE),
    db
      .select({ name: categories.name, slug: categories.slug, n: sql<number>`count(${posts.id})::int` })
      .from(categories)
      .leftJoin(posts, eq(posts.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(categories.name),
    db
      .select({ total: sql<number>`count(distinct ${posts.id})::int` })
      .from(posts)
      .leftJoin(postTags, eq(postTags.postId, posts.id))
      .leftJoin(tags, eq(tags.id, postTags.tagId))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(...filters)),
  ]);

  const articleMap = new Map<string, { slug: string; title: string; excerpt: string | null; thumbnailUrl: string | null; publishedAt: Date | null; authorName: string | null; categoryName: string | null; categorySlug: string | null; tags: Array<{ name: string; slug: string }> }>();
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
      categorySlug: row.categorySlug,
      tags: [],
    };

    if (row.tagName && row.tagSlug) {
      const seen = existing.tags.some((tag) => tag.slug === row.tagSlug);
      if (!seen) existing.tags.push({ name: row.tagName, slug: row.tagSlug });
    }

    articleMap.set(key, existing);
  }

  const items = Array.from(articleMap.values()).slice(0, PER_PAGE);
  const hasMore = articleRows.length > PER_PAGE;
  const queryMode = Boolean(query);

  function pageHref(nextPage: number) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (category) next.set("category", category);
    if (tagSlugs.length > 0) next.set("tag", tagSlugs.join(","));
    if (sort && sort !== "latest") next.set("sort", sort);
    if (nextPage > 1) next.set("page", String(nextPage));
    const value = next.toString();
    return value ? `/search?${value}` : "/search";
  }

  return (
    <main className="flex-1 bg-[#f7f5f0] dark:bg-[#171816]">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <FadeIn>
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 dark:text-gray-200">Pencarian</span>
          </nav>
        </FadeIn>

        <div className="rounded-3xl border border-[#ded9cf] bg-white p-6 shadow-sm dark:border-[#353631] dark:bg-[#1b1c1a]">
          <form action="/search" method="get" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_170px]">
            <label className="sr-only" htmlFor="search-input">Cari artikel</label>
            <input
              id="search-input"
              name="q"
              defaultValue={query}
              placeholder="Cari berita, JLPT, budaya, bahasa, MEXT..."
              className="min-w-0 rounded-full border border-[#d4cdc1] bg-[#f8f6f2] px-4 py-3 text-sm text-[#20211f] outline-none placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-[#3b3c37] dark:bg-[#252622] dark:text-white"
            />
            <select name="category" defaultValue={category ?? ""} className="rounded-full border border-[#d4cdc1] bg-[#f8f6f2] px-4 py-3 text-sm text-[#20211f] outline-none focus:border-red-500 dark:border-[#3b3c37] dark:bg-[#252622] dark:text-white">
              <option value="">Semua rubrik</option>
              {catRows.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
            <select name="sort" defaultValue={sort ?? "relevance"} className="rounded-full border border-[#d4cdc1] bg-[#f8f6f2] px-4 py-3 text-sm text-[#20211f] outline-none focus:border-red-500 dark:border-[#3b3c37] dark:bg-[#252622] dark:text-white">
              <option value="relevance">Relevansi</option>
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="title">Judul A-Z</option>
            </select>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold uppercase tracking-[0.12em] text-[#c83c2d]">Status:</span>
            <span>{total} hasil</span>
            {query && <span>· kata kunci: “{query}”</span>}
            {category && <span>· rubrik: {category}</span>}
            {tagSlugs.length > 0 && <span>· tag: {tagSlugs.join(", ")}</span>}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {items.length === 0 ? (
            <FadeIn>
              <div className="rounded-2xl bg-white p-14 text-center shadow-sm dark:bg-[#1b1c1a]">
                <p className="text-5xl">🔎</p>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Tidak ada hasil yang cocok</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Coba kata kunci lain, rubrik lain, atau hapus filter untuk melihat semua artikel.</p>
                <Link href="/search" className="mt-5 inline-block rounded-full bg-[#c83c2d] px-5 py-2.5 text-sm font-bold text-white">Reset pencarian</Link>
              </div>
            </FadeIn>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {queryMode ? "Hasil yang paling relevan" : "Semua artikel terbaru"}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>

              {(page > 1 || hasMore) && (
                <nav className="mt-8 flex items-center justify-center gap-3">
                  {page > 1 && (
                    <Link href={pageHref(page - 1)} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">
                      ← Sebelumnya
                    </Link>
                  )}
                  {hasMore && (
                    <Link href={pageHref(page + 1)} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700">
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
