import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories, tags, postTags } from "@/db/schema";
import { auth } from "@/auth";
import PostCard from "@/components/post-card";
import SafeImg from "@/components/safe-img";
import FadeIn from "@/components/fade-in";
import ReadingProgress from "@/components/reading-progress";
import { formatTanggal } from "@/lib/format-date";

// ponytail: sengaja TIDAK pakai revalidate/ISR — halaman ini membaca sesi utk preview draft;
// hasil render per-sesi tidak boleh masuk Full Route Cache. Upgrade path: pisah rute preview
// (/admin/artikel/[id]/preview) kalau mau ISR untuk detail publik.

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  const [row] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      contentHtml: posts.contentHtml,
      thumbnailUrl: posts.thumbnailUrl,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      authorName: users.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.slug, slug));
  return row ?? null;
}

const cardColumns = {
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  thumbnailUrl: posts.thumbnailUrl,
  publishedAt: posts.publishedAt,
  authorName: users.name,
  categoryName: categories.name,
};

// Preview Task 4.4: draft hanya terlihat oleh sesi admin/writer.
async function getVisiblePost(slug: string) {
  const post = await getPost(slug);
  if (!post) return null;
  if (post.status === "published") return post;
  const session = await auth();
  return session?.user?.role ? post : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getVisiblePost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Benkyou Lab`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
      type: "article",
    },
  };
}

export default async function ArtikelDetail({ params }: Props) {
  const { slug } = await params;
  const post = await getVisiblePost(slug);
  if (!post) notFound();

  const articleTags = await db
    .select({ id: tags.id, name: tags.name, slug: tags.slug })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id))
    .orderBy(asc(tags.name));

  const tagIds = Array.from(new Set(articleTags.map((tag) => tag.id)));

  // Prioritas: artikel dengan tag yang sama, lalu se-kategori, lalu acak.
  const base = db
    .select(cardColumns)
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .$dynamic();

  const sameTag =
    tagIds.length > 0
      ? await db
          .select(cardColumns)
          .from(postTags)
          .innerJoin(posts, eq(posts.id, postTags.postId))
          .innerJoin(users, eq(posts.authorId, users.id))
          .leftJoin(categories, eq(posts.categoryId, categories.id))
          .where(and(eq(posts.status, "published"), ne(posts.id, post.id), inArray(postTags.tagId, tagIds)))
          .orderBy(desc(posts.publishedAt))
          .limit(3)
      : [];

  const seKategori = post.categorySlug
    ? await base
        .where(
          and(
            eq(posts.status, "published"),
            ne(posts.id, post.id),
            eq(categories.slug, post.categorySlug)
          )
        )
        .orderBy(desc(posts.publishedAt))
        .limit(3)
    : [];

  const related =
    sameTag.length > 0
      ? sameTag
      : seKategori.length > 0
        ? seKategori
        : await db
            .select(cardColumns)
            .from(posts)
            .innerJoin(users, eq(posts.authorId, users.id))
            .leftJoin(categories, eq(posts.categoryId, categories.id))
            .where(and(eq(posts.status, "published"), ne(posts.id, post.id)))
            .orderBy(sql`random()`)
            .limit(3);

  return (
    <main className="flex-1 bg-white dark:bg-gray-950">
      <ReadingProgress />

      <article className="mx-auto max-w-prose px-4 py-10 sm:py-14">
        <FadeIn y={12}>
          <nav className="text-sm text-gray-400">
            <Link href="/" className="transition-colors hover:text-red-600">
              Beranda
            </Link>
            <span className="mx-2">/</span>
            {post.categoryName && post.categorySlug ? (
              <Link href={`/kategori/${post.categorySlug}`} className="transition-colors hover:text-red-600">
                {post.categoryName}
              </Link>
            ) : (
              <span>Artikel</span>
            )}
          </nav>
        </FadeIn>

        <FadeIn delay={0.06} y={12}>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            {post.categoryName && (
              <Link
                href={`/kategori/${post.categorySlug}`}
                className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                {post.categoryName}
              </Link>
            )}
            {post.status === "draft" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                DRAFT — preview
              </span>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} y={12}>
          <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-gray-400">
            ✍️ {post.authorName} · 📅{" "}
            {formatTanggal(post.publishedAt ?? post.updatedAt)}
          </p>
        </FadeIn>

        {articleTags.length > 0 && (
          <FadeIn delay={0.12} y={12}>
            <div className="mt-5 flex flex-wrap gap-2">
              {articleTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/?tag=${tag.slug}`}
                  className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </FadeIn>
        )}

        {post.thumbnailUrl && (
          <FadeIn delay={0.15}>
            <SafeImg src={post.thumbnailUrl} alt={post.title} className="mt-8 w-full rounded-2xl shadow-sm" />
          </FadeIn>
        )}

        {/* Aman: HTML sudah disanitasi server-side saat simpan (lib/sanitize.ts) */}
        <div
          className="prose prose-gray mt-10 max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:font-medium prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-blockquote:border-l-red-300 prose-blockquote:bg-red-50/50 prose-blockquote:py-1 prose-blockquote:italic dark:prose-blockquote:border-l-red-500/50 dark:prose-blockquote:bg-red-500/5"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <FadeIn>
          <div className="mt-12 flex items-center gap-4 rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-xl font-bold text-white">
              勉
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.authorName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Menulis materi bahasa Jepang untuk pemula di Benkyou Lab.</p>
            </div>
          </div>
        </FadeIn>
      </article>

      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-900/40">
          <div className="mx-auto max-w-5xl px-4">
            <FadeIn>
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Artikel lainnya</h2>
                <Link href="/kategori" className="text-sm font-medium text-red-600 hover:text-red-700">
                  Semua kategori →
                </Link>
              </div>
            </FadeIn>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
