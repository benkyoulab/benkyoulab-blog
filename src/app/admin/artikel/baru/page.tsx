import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, tags } from "@/db/schema";
import { savePost } from "../actions";
import PostForm from "../post-form";

export const metadata = { title: "Artikel Baru" };

export default async function ArtikelBaruPage() {
  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name));
  const tagRows = await db.select({ id: tags.id, name: tags.name }).from(tags).orderBy(asc(tags.name));
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Artikel Baru</h1>
      <PostForm categories={cats} tags={tagRows} saveAction={savePost} />
    </>
  );
}
