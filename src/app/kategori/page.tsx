import type { Metadata } from "next";
import Link from "next/link";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts } from "@/db/schema";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kategori — Benkyou Lab",
  description: "Jelajahi materi belajar bahasa Jepang per kategori.",
};

export default async function KategoriIndex() {
  const rows = await db
    .select({ name: categories.name, slug: categories.slug, description: categories.description })
    .from(categories)
    .orderBy(asc(categories.name));

  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Kategori</h1>
        <p className="mt-2 text-gray-600">Pilih topik yang ingin kamu pelajari.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                {c.name}
              </span>
              {c.description && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-600">{c.description}</p>
              )}
            </Link>
          ))}
          {rows.length === 0 && <p className="text-gray-600">Belum ada kategori.</p>}
        </div>
      </div>
    </main>
  );
}
