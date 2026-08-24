export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // buang simbol; kata jepang diromaji dulu oleh penulis
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = base || "artikel";
  for (let i = 2; ; i++) {
    if (!(await exists(slug))) return slug;
    slug = `${base}-${i}`;
  }
}
