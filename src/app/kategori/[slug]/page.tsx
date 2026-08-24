import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts, users } from "@/db/schema";
import PostCard from "@/components/post-card";

export const revalidate = 300;

type Props = PageProps<"/kategori/[slug]">;

async function getCategory(slug: string) {
  const [row] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));
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
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <span className="rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
          {category.name}
        </span>
        {category.description && (
          <p className="mt-3 max-w-xl text-gray-600">{category.description}</p>
        )}
        <div className="mt-8">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <p className="text-4xl">🌱</p>
              <h2 className="mt-4 font-semibold">Belum ada artikel di kategori ini</h2>
              <p className="mt-1 text-sm text-gray-600">Cek kembali lain waktu.</p>
            </div>
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
