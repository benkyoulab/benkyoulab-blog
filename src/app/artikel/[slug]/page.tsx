import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories } from "@/db/schema";
import { auth } from "@/auth";
import PostCard from "@/components/post-card";
import { formatTanggal } from "@/lib/format-date";

// ponytail: sengaja TIDAK pakai revalidate/ISR — halaman ini membaca sesi utk preview draft;
// hasil render per-sesi tidak boleh masuk Full Route Cache. Upgrade path: pisah rute preview
// (/admin/artikel/[id]/preview) kalau mau ISR untuk detail publik.

type Props = PageProps<"/artikel/[slug]">;

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

  // Prioritas: se-kategori. Kalau kosong: acak dari kategori lain.
  // NB: .where() pada dynamic builder bersifat menimpa — semua kondisi dikomposisi sekali di tiap cabang.
  const base = db
    .select(cardColumns)
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .$dynamic();

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
    seKategori.length > 0
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
    <main className="flex-1 bg-white">
      <article className="mx-auto max-w-prose px-4 py-10">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {post.categoryName && (
            <Link
              href={`/kategori/${post.categorySlug}`}
              className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
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

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">{post.title}</h1>
        <p className="mt-3 text-sm text-gray-400">
          {post.authorName} · {formatTanggal(post.publishedAt ?? post.updatedAt)}
        </p>

        {post.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.thumbnailUrl} alt={post.title} className="mt-6 w-full rounded-2xl" />
        )}

        {/* Aman: HTML sudah disanitasi server-side saat simpan (lib/sanitize.ts) */}
        <div
          className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-blockquote:border-red-200"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50 py-10">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Artikel lainnya</h2>
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
