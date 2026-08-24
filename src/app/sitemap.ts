import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, categories } from "@/db/schema";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://benkyoulab-blog.vercel.app";

// ponytail: ISR 1 jam agar artikel baru dari admin masuk sitemap tanpa redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postRows, catRows] = await Promise.all([
    db.select({ slug: posts.slug, updatedAt: posts.updatedAt }).from(posts).where(eq(posts.status, "published")),
    db.select({ slug: categories.slug }).from(categories),
  ]);

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...catRows.map((c) => ({
      url: `${base}/kategori/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...postRows.map((p) => ({
      url: `${base}/artikel/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
