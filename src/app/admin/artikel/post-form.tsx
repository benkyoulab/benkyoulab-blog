"use client";

import { useActionState, useState } from "react";
import RichTextEditor from "@/components/editor/rich-text-editor";

type Cat = { id: number; name: string };
type Tag = { id: number; name: string };

export default function PostForm({
  categories,
  tags,
  saveAction,
  initial,
}: {
  categories: Cat[];
  tags: Tag[];
  saveAction: (s: { error?: string }, fd: FormData) => Promise<{ error?: string }>;
  initial?: {
    id: number;
    title: string;
    excerpt: string | null;
    categoryId: number | null;
    thumbnailUrl: string | null;
    contentHtml: string;
    status: "draft" | "published";
    tagNames?: string[];
  };
}) {
  const [state, formAction, pending] = useActionState(saveAction, {});
  const [html, setHtml] = useState(initial?.contentHtml ?? "");
  const selectedTags = initial?.tagNames ?? [];

  const input =
    "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100";

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="contentHtml" value={html} />

      <div className="space-y-4">
        <input name="title" required defaultValue={initial?.title} placeholder="Judul artikel" className={`${input} !text-lg font-semibold`} />
        <RichTextEditor content={initial?.contentHtml} onChange={setHtml} />
        {state.error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <fieldset className="rounded-2xl bg-white p-4 shadow-sm">
          <legend className="px-1 text-sm font-medium text-gray-900">Publikasi</legend>
          <p className="mb-3 text-xs text-gray-500">
            Status: <b>{initial?.status ?? "draft"}</b>
          </p>
          <div className="flex gap-2">
            <button
              type="submit"
              name="action"
              value="draft"
              disabled={pending}
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Simpan Draft
            </button>
            <button
              type="submit"
              name="action"
              value="publish"
              disabled={pending}
              className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              Publish
            </button>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl bg-white p-4 shadow-sm">
          <legend className="px-1 text-sm font-medium text-gray-900">Metadata</legend>
          <label className="mb-1 block text-xs text-gray-500">Kategori</label>
          <select name="categoryId" defaultValue={initial?.categoryId ?? ""} className={input}>
            <option value="">— Tanpa kategori —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="mb-1 mt-3 block text-xs text-gray-500">Thumbnail URL (https://…)</label>
          <input
            name="thumbnailUrl"
            type="url"
            defaultValue={initial?.thumbnailUrl ?? ""}
            placeholder="https://res.cloudinary.com/…"
            className={input}
          />

          <label className="mb-1 mt-3 block text-xs text-gray-500">Excerpt (opsional, max 320)</label>
          <textarea
            name="excerpt"
            rows={3}
            maxLength={320}
            defaultValue={initial?.excerpt ?? ""}
            placeholder="Kosongkan untuk otomatis dari konten"
            className={input}
          />

          <label className="mb-1 mt-3 block text-xs text-gray-500">Tag artikel</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const checked = selectedTags.includes(tag.name);
              return (
                <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700">
                  <input type="checkbox" name="tags" value={tag.name} defaultChecked={checked} className="h-3.5 w-3.5 accent-red-600" />
                  #{tag.name}
                </label>
              );
            })}
            {!tags.length && <p className="text-xs text-gray-400">Belum ada tag. Tambahkan tag di menu Kategori & Tag.</p>}
          </div>
        </fieldset>
      </div>
    </form>
  );
}
