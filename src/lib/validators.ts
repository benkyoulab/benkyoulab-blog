import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https:\/\//.test(v), "Thumbnail harus https://");

export function parseTagNamesFromFormData(formData: FormData): string[] {
  const rawValues = formData.getAll("tags");
  return Array.from(
    new Set(
      rawValues
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export const postSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
  excerpt: z.string().trim().max(320).optional().or(z.literal("")),
  // categoryId dari form datang sebagai string "" (kosong) atau "123" — coerce ke number,
  // null saat kosong, dan izinkan null (artikel tanpa kategori).
  categoryId: z
    .preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().positive().nullable())
    .nullable(),
  thumbnailUrl: optionalUrl,
  contentHtml: z.string().min(1, "Konten tidak boleh kosong"),
  tags: z.preprocess((v) => {
    if (v instanceof FormData) return parseTagNamesFromFormData(v);
    if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
    if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
    return [];
  }, z.array(z.string().min(1).max(40)).max(10).default([])),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
});

export const tagSchema = z.object({
  name: z.string().trim().min(2, "Nama tag minimal 2 karakter").max(80),
  description: z.string().trim().max(240).optional().or(z.literal("")),
});
