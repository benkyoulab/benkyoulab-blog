"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { auth } from "@/auth";
import { postSchema } from "@/lib/validators";
import { sanitizeHtml, htmlToText } from "@/lib/sanitize";
import { slugify, uniqueSlug } from "@/lib/slug";
import { refreshPublicCache } from "@/lib/cache-refresh";

export type PostActionState = { error?: string };

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Harus login");
  return session;
}

function refreshPublic(slug?: string | null) {
  refreshPublicCache({ slug });
}

async function ensureTag(tagName: string) {
  const normalized = tagName.trim();
  if (!normalized) return null;
  const baseSlug = slugify(normalized);
  const [existing] = await db.select().from(tags).where(eq(tags.slug, baseSlug)).limit(1);
  if (existing) return existing.id;
  const [created] = await db
    .insert(tags)
    .values({ name: normalized, slug: baseSlug, description: `Tag otomatis: ${normalized}` })
    .returning({ id: tags.id });
  return created?.id ?? null;
}

async function syncPostTags(postId: number, tagNames: string[]) {
  const unique = Array.from(new Set(tagNames.map((item) => item.trim()).filter(Boolean))).slice(0, 10);
  await db.delete(postTags).where(eq(postTags.postId, postId));
  if (!unique.length) return;

  const ids = (await Promise.all(unique.map((name) => ensureTag(name)))).filter((id): id is number => typeof id === "number");
  if (!ids.length) return;

  await db.insert(postTags).values(ids.map((tagId) => ({ postId, tagId })));
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
  const tagNames = d.tags ?? [];

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
    let postId = id;

    if (!id) {
      const [created] = await db
        .insert(posts)
        .values({
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
        })
        .returning({ id: posts.id });
      postId = created?.id ?? null;
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
          status: publish ? "published" : "draft",
          publishedAt: publish && !existing.publishedAt ? new Date() : existing.publishedAt,
        })
        .where(eq(posts.id, id));
    }

    if (postId) {
      await syncPostTags(postId, tagNames);
    }
  } catch (e) {
    console.error("[savePost] DB error:", e);
    return { error: `Gagal menyimpan ke database: ${(e as Error).message}` };
  }

  refreshPublic(id ? slug : null);
  revalidatePath("/admin/artikel");
  return {};
}

// Delete via FormData — dipakai langsung sebagai `action` di <form>.
// Return void (bukan state) supaya kompatibel dengan form action type React.
export async function deletePostAction(fd: FormData): Promise<void> {
  const id = Number(fd.get("id"));
  if (Number.isNaN(id)) throw new Error("id tidak valid");
  const session = await requireUser();
  const [existing] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!existing) throw new Error("Artikel tidak ditemukan.");
  if (session.user.role !== "admin" && existing.authorId !== Number(session.user.id)) {
    throw new Error("Bukan artikel milikmu.");
  }
  await db.delete(posts).where(eq(posts.id, id));
  refreshPublic(existing.slug);
  revalidatePath("/admin/artikel");
}
