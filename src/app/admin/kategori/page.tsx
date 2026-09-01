import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, tags } from "@/db/schema";
import { auth } from "@/auth";
import { createCategory, createTag, deleteCategory, deleteTag } from "./actions";
import CategoryManager from "./category-manager";

export const metadata = { title: "Kategori" };

export default async function KategoriPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/admin/artikel");

  const rows = await db.select().from(categories).orderBy(asc(categories.name));
  const tagRows = await db.select().from(tags).orderBy(asc(tags.name));
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Kategori & Tag</h1>
      <CategoryManager
        categories={rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description }))}
        tags={tagRows.map((t) => ({ id: t.id, name: t.name, slug: t.slug, description: t.description }))}
        createAction={createCategory}
        createTagAction={createTag}
        deleteAction={deleteCategory}
        deleteTagAction={deleteTag}
      />
    </>
  );
}
