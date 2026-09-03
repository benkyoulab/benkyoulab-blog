import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts, users, categories, tags, postTags } from "@/db/schema";
import PostCard from "@/components/post-card";
import FadeIn from "@/components/fade-in";

export const revalidate = 300;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getTag(slug: string) {
  const [row] = await db.select().from(tags).where(eq(tags.slug, slug));
  return row ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) return {};

  return {
    title: `#${tag.name} — Benkyou Lab`,
    description: tag.description ?? `Kumpulan artikel dengan topik ${tag.name}.`,
  };
}

export default async function TagLandingPage({ params }: Props) {
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) notFound();

  const items = await db
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
    .from(postTags)
    .innerJoin(posts, eq(posts.id, postTags.postId))
    .innerJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(and(eq(posts.status, "published"), eq(tags.slug, slug)))
    .orderBy(desc(posts.publishedAt))
    .limit(24);

  const articles = Array.from(
    new Map(
      items.map((row) => [
        row.slug,
        {
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          thumbnailUrl: row.thumbnailUrl,
          publishedAt: row.publishedAt,
          authorName: row.authorName,
          categoryName: row.categoryName,
          tags: items
            .filter((item) => item.slug === row.slug)
            .filter((item) => item.tagName && item.tagSlug)
            .map((item) => ({ name: item.tagName, slug: item.tagSlug }))
            .filter((item, index, arr) => arr.findIndex((candidate) => candidate.slug === item.slug) === index),
        },
      ]),
    ).values(),
  );

  return (
    <main className="flex-1 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <FadeIn>
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 dark:text-gray-200">#{tag.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              #{tag.name}
            </span>
            <span className="text-sm text-gray-500">{articles.length} artikel</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Kumpulan artikel #{tag.name}
          </h1>
          {tag.description && (
            <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">{tag.description}</p>
          )}
        </FadeIn>

        <div className="mt-10">
          {articles.length === 0 ? (
            <FadeIn>
              <div className="rounded-2xl bg-white p-16 text-center shadow-sm dark:bg-gray-900">
                <p className="text-4xl">🔎</p>
                <h2 className="mt-4 font-semibold dark:text-white">Belum ada artikel di tag ini</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Coba tag lain atau kembali ke beranda.</p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
