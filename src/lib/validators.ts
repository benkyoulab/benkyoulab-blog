import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https:\/\//.test(v), "Thumbnail harus https://");

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
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
});
