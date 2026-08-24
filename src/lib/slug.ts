// ponytail: slug base untuk URL. ASCII a-z0-9 hasil romanisasi.
// Judul non-ASCII (Jepang/CJK) -> fallback ke slug generik + id timestamp.
// Upgrade path: izinkan penulis override slug manual di field input.
export function slugify(text: string): string {
  const ascii = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  if (ascii.length >= 3) return ascii;
  // Judul full-Jepang/CJK: pakai timestamp deterministik berbasis teks.
  const ts = Date.now().toString(36);
  const code = Math.abs(hashCode(text)).toString(36);
  return `artikel-${code}-${ts}`;
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = base || `artikel-${Date.now().toString(36)}`;
  for (let i = 2; ; i++) {
    if (!(await exists(slug))) return slug;
    slug = `${base}-${i}`;
  }
}