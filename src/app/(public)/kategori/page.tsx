import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts } from "@/db/schema";
import FadeIn from "@/components/fade-in";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kategori — Benkyou Lab",
  description: "Jelajahi materi belajar bahasa Jepang per kategori.",
};

const ICONS: Record<string, string> = {
  kanji: "漢",
  "tata-bahasa": "文",
  kosakata: "話",
  "tips-belajar": "💡",
};

export default async function KategoriIndex() {
  const rows = await db
    .select({
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      n: sql<number>`count(${posts.id})::int`,
    })
    .from(categories)
    .leftJoin(posts, eq(posts.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.name));

  return (
    <main className="flex-1 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <FadeIn>
          <p className="text-sm font-semibold text-red-600 uppercase">カテゴリー</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Jelajahi berdasarkan kategori
          </h1>
          <p className="mt-2 max-w-lg text-gray-600 dark:text-gray-400">
            Setiap kategori adalah jalur belajar — mulai dari satu, susun pelan-pelan.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((c, i) => (
            <FadeIn key={c.slug} delay={i * 0.06}>
              <Link
                href={`/kategori/${c.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md dark:bg-gray-900 dark:ring-gray-800"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl font-bold text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white dark:bg-red-500/10 dark:text-red-400">
                  {ICONS[c.slug] ?? "📚"}
                </span>
                <h2 className="mt-4 font-semibold text-gray-900 group-hover:text-red-600 dark:text-gray-100 dark:group-hover:text-red-400">{c.name}</h2>
                {c.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{c.description}</p>
                )}
                <p className="mt-auto pt-4 text-xs text-gray-400">{c.n} artikel →</p>
              </Link>
            </FadeIn>
          ))}
          {rows.length === 0 && <p className="text-gray-600">Belum ada kategori.</p>}
        </div>
      </div>
    </main>
  );
}
