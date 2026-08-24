import { z } from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
  excerpt: z.string().trim().max(320).optional().or(z.literal("")),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  thumbnailUrl: z
    .string()
    .trim()
    .url("Thumbnail harus URL valid")
    .refine((v) => v.startsWith("https://"), "Thumbnail harus https://")
    .optional()
    .or(z.literal("")),
  contentHtml: z.string().min(1, "Konten tidak boleh kosong"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
});
