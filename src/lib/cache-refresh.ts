import { revalidatePath } from "next/cache";

const PUBLIC_CATEGORY_PATHS = [
  "kosakata",
  "kanji",
  "tata-bahasa",
  "tips-belajar",
] as const;

export function getCacheInvalidationPaths({
  slug,
  categorySlug,
}: {
  slug?: string | null;
  categorySlug?: string | null;
} = {}) {
  const paths = new Set<string>(["/", "/kategori"]);

  if (slug) paths.add(`/artikel/${slug}`);
  if (categorySlug) paths.add(`/kategori/${categorySlug}`);

  for (const category of PUBLIC_CATEGORY_PATHS) {
    paths.add(`/kategori/${category}`);
  }

  return Array.from(paths);
}

export function refreshPublicCache({
  slug,
  categorySlug,
}: {
  slug?: string | null;
  categorySlug?: string | null;
} = {}) {
  for (const path of getCacheInvalidationPaths({ slug, categorySlug })) {
    revalidatePath(path);
  }
}
