"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts } from "@/db/schema";
import { auth } from "@/auth";
import { categorySchema } from "@/lib/validators";
import { slugify, uniqueSlug } from "@/lib/slug";

export type ActionState = { error?: string };

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Khusus admin");
  return session;
}

function refreshPublicPaths() {
  revalidatePath("/");
  for (const c of ["kosakata", "kanji", "tata-bahasa", "tips-belajar"]) {
    revalidatePath(`/kategori/${c}`);
  }
}

export async function createCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const name = parsed.data.name;
  const slug = await uniqueSlug(slugify(name), async (s) => {
    const [row] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, s)).limit(1);
    return !!row;
  });

  try {
    await db.insert(categories).values({
      name,
      slug,
      description: parsed.data.description || null,
    });
  } catch {
    return { error: "Gagal menyimpan kategori." };
  }
  revalidatePath("/admin/kategori");
  return {};
}

export async function updateCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || !Number.isInteger(id)) return { error: parsed.error?.issues[0].message ?? "Data tidak valid" };

  try {
    await db
      .update(categories)
      .set({ name: parsed.data.name, description: parsed.data.description || null })
      .where(eq(categories.id, id));
  } catch {
    return { error: "Gagal memperbarui kategori." };
  }
  revalidatePath("/admin/kategori");
  return {};
}

// Hapus kategori tidak menghapus post — categoryId otomatis NULL (ON DELETE SET NULL).
export async function deleteCategory(id: number): Promise<void> {
  await requireAdmin();
  const used = await db.select({ id: posts.id }).from(posts).where(eq(posts.categoryId, id)).limit(1);
  if (used.length) {
    // tetap boleh hapus; post jadi tanpa kategori
  }
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/kategori");
  refreshPublicPaths();
}
