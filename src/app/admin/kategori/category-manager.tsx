"use client";

import { useActionState } from "react";

type Cat = { id: number; name: string; slug: string; description: string | null };

type Tag = { id: number; name: string; slug: string; description: string | null };

export default function CategoryManager({
  categories,
  tags,
  createAction,
  createTagAction,
  deleteAction,
  deleteTagAction,
}: {
  categories: Cat[];
  tags: Tag[];
  createAction: (s: { error?: string }, fd: FormData) => Promise<{ error?: string }>;
  createTagAction: (s: { error?: string }, fd: FormData) => Promise<{ error?: string }>;
  deleteAction: (id: number) => Promise<void>;
  deleteTagAction: (id: number) => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(createAction, {});
  const [tagState, tagFormAction, tagPending] = useActionState(createTagAction, {});

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8">
        <div className="rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {c.name}
                    {c.description && <p className="text-xs font-normal text-gray-500">{c.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Hapus kategori "${c.name}"? Artikel terkait jadi tanpa kategori.`)) {
                          void deleteAction(c.id);
                        }
                      }}
                      className="rounded-full px-3 py-1 text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {!categories.length && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                    Belum ada kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Tag</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{tag.name}
                    {tag.description && <p className="text-xs font-normal text-gray-500">{tag.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{tag.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Hapus tag "${tag.name}"?`)) {
                          void deleteTagAction(tag.id);
                        }
                      }}
                      className="rounded-full px-3 py-1 text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {!tags.length && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                    Belum ada tag.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <form action={formAction} className="h-fit rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-900">Tambah Kategori</h2>
          <input
            name="name"
            required
            placeholder="Nama kategori"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
          />
          <textarea
            name="description"
            placeholder="Deskripsi (opsional)"
            rows={2}
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
          />
          {state.error && <p role="alert" className="mt-2 text-sm text-red-600">{state.error}</p>}
          <button
            disabled={pending}
            className="mt-3 w-full rounded-full bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {pending ? "Menyimpan…" : "Simpan"}
          </button>
        </form>

        <form action={tagFormAction} className="h-fit rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-900">Tambah Tag</h2>
          <input
            name="name"
            required
            placeholder="Nama tag"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
          />
          <textarea
            name="description"
            placeholder="Deskripsi tag (opsional)"
            rows={2}
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
          />
          {tagState.error && <p role="alert" className="mt-2 text-sm text-red-600">{tagState.error}</p>}
          <button
            disabled={tagPending}
            className="mt-3 w-full rounded-full bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {tagPending ? "Menyimpan…" : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
