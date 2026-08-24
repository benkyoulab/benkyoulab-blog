import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories } from "@/db/schema";
import { auth } from "@/auth";
import DeleteButton from "@/components/admin/delete-button";

export const metadata = { title: "Artikel" };

const badge = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-emerald-50 text-emerald-700",
} as const;

export default async function ArtikelListPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  // Admin: semua artikel. Writer: hanya miliknya (PRD §3).
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      updatedAt: posts.updatedAt,
      author: users.name,
      category: categories.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(isAdmin ? undefined : eq(posts.authorId, Number(session!.user!.id)))
    .orderBy(desc(posts.updatedAt));

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
        <Link
          href="/admin/artikel/baru"
          className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + Artikel Baru
        </Link>
      </div>

      <div className="rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Kategori</th>
              {isAdmin && <th className="px-4 py-3 text-center font-medium">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-400">/{p.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-gray-500 md:table-cell">{p.category ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/artikel/${p.id}/edit`} className="text-red-600 hover:underline">
                      Edit
                    </Link>
                    {isAdmin && <DeleteButton id={p.id} />}
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  Belum ada artikel. Klik “+ Artikel Baru” untuk mulai menulis.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
