import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { auth } from "@/auth";
import { createCategory, deleteCategory } from "./actions";
import CategoryManager from "./category-manager";

export const metadata = { title: "Kategori" };

export default async function KategoriPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/admin/artikel");

  const rows = await db.select().from(categories).orderBy(asc(categories.name));
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Kategori</h1>
      <CategoryManager
        categories={rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description }))}
        createAction={createCategory}
        deleteAction={deleteCategory}
      />
    </>
  );
}
