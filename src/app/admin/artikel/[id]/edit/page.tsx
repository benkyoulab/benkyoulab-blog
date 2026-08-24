import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts } from "@/db/schema";
import { auth } from "@/auth";
import { savePost } from "../../actions";
import PostForm from "../../post-form";

export const metadata = { title: "Edit Artikel" };

export default async function EditArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Next 16: params adalah Promise
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const session = await auth();
  const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  if (!post) notFound();
  // Guard kepemilikan di level halaman (PRD §5): writer hanya miliknya.
  if (session?.user?.role !== "admin" && post.authorId !== Number(session!.user!.id)) notFound();

  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name));

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Artikel</h1>
      <PostForm
        categories={cats}
        saveAction={savePost}
        initial={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          categoryId: post.categoryId,
          thumbnailUrl: post.thumbnailUrl,
          contentHtml: post.contentHtml,
          status: post.status,
        }}
      />
    </>
  );
}
