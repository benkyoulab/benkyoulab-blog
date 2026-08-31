import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts, users } from "@/db/schema";
import PostCard from "@/components/post-card";
import FadeIn from "@/components/fade-in";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCategory(slug: string) {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug));
  return row ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Benkyou Lab`,
    description: category.description ?? `Kumpulan artikel kategori ${category.name}.`,
  };
}

export default async function KategoriDetail({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const items = await db
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
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), eq(categories.slug, slug)))
    .orderBy(desc(posts.publishedAt))
    .limit(24);

  return (
    <main className="flex-1 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <FadeIn>
          <span className="rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
            {category.name}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {category.description ? "Materi " + category.name : "Artikel kategori " + category.name}
          </h1>
          {category.description && (
            <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">{category.description}</p>
          )}
          <p className="mt-3 text-sm text-gray-400">{items.length} artikel</p>
        </FadeIn>

        <div className="mt-10">
          {items.length === 0 ? (
            <FadeIn>
              <div className="rounded-2xl bg-white p-16 text-center shadow-sm dark:bg-gray-900">
                <p className="text-4xl">🌱</p>
                <h2 className="mt-4 font-semibold dark:text-white">Belum ada artikel di kategori ini</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Cek kembali lain waktu.</p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
