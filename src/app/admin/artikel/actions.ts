"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/auth";
import { postSchema } from "@/lib/validators";
import { sanitizeHtml, htmlToText } from "@/lib/sanitize";
import { slugify, uniqueSlug } from "@/lib/slug";

export type PostActionState = { error?: string };

async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("Harus login");
  return session;
}

function refreshPublic(slug?: string | null) {
  revalidatePath("/");
  if (slug) revalidatePath(`/artikel/${slug}`);
  for (const c of ["kosakata", "kanji", "tata-bahasa", "tips-belajar"]) {
    revalidatePath(`/kategori/${c}`);
  }
}

async function slugExists(slug: string) {
  const [row] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1);
  return !!row;
}

export async function savePost(_prev: PostActionState, formData: FormData): Promise<PostActionState> {
  const session = await requireUser();
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  const id = Number(formData.get("id")) || null;
  const publish = formData.get("action") === "publish";

  // Sanitasi server-side — bukan cuma di render.
  const contentHtml = sanitizeHtml(d.contentHtml);

  // Slug baru hanya saat create; judul berubah TIDAK mengubah slug published (PRD §6.2).
  let slug: string;
  if (!id) {
    slug = await uniqueSlug(slugify(d.title), slugExists);
  } else {
    const [existing] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!existing) return { error: "Artikel tidak ditemukan." };
    // Guard kepemilikan (PRD §5): writer hanya boleh edit miliknya.
    if (session.user.role !== "admin" && existing.authorId !== Number(session.user.id)) {
      return { error: "Bukan artikel milikmu." };
    }
    slug = existing.slug;
  }

  try {
    if (!id) {
      await db.insert(posts).values({
        authorId: Number(session.user.id),
        categoryId: d.categoryId || null,
        title: d.title,
        slug,
        excerpt: d.excerpt || htmlToText(contentHtml).slice(0, 300),
        contentHtml,
        contentText: htmlToText(contentHtml),
        thumbnailUrl: d.thumbnailUrl || null,
        status: publish ? "published" : "draft",
        publishedAt: publish ? new Date() : null,
      });
    } else {
      const [existing] = await db.select({ status: posts.status, publishedAt: posts.publishedAt }).from(posts).where(eq(posts.id, id));
      await db
        .update(posts)
        .set({
          categoryId: d.categoryId || null,
          title: d.title,
          excerpt: d.excerpt || htmlToText(contentHtml).slice(0, 300),
          contentHtml,
          contentText: htmlToText(contentHtml),
          thumbnailUrl: d.thumbnailUrl || null,
          // Aturan sederhana & konsisten dgn PRD §6.3: tombol menentukan status.
          status: publish ? "published" : "draft",
          // published_at diisi SEKALI saat transisi draft→published pertama.
          publishedAt: publish && !existing.publishedAt ? new Date() : existing.publishedAt,
        })
        .where(eq(posts.id, id));
    }
  } catch {
    return { error: "Gagal menyimpan ke database." };
  }

  refreshPublic(id ? slug : null);
  revalidatePath("/admin/artikel");
  return {};
}

export async function deletePost(id: number): Promise<void> {
  const session = await requireUser();
  const [existing] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!existing) return;
  if (session.user.role !== "admin" && existing.authorId !== Number(session.user.id)) {
    throw new Error("Bukan artikel milikmu");
  }
  await db.delete(posts).where(eq(posts.id, id));
  refreshPublic(existing.slug);
  revalidatePath("/admin/artikel");
}
