"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type CategoryOption = { slug: string; name: string };

type Props = {
  query: string;
  category: string;
  sort: string;
  categories: CategoryOption[];
};

export default function ArticleFilters({ query, category, sort, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(query);

  function updateUrl(next: { q?: string; category?: string; sort?: string }) {
    const params = new URLSearchParams();
    const nextQuery = next.q ?? search;
    const nextCategory = next.category ?? category;
    const nextSort = next.sort ?? sort;

    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextCategory) params.set("category", nextCategory);
    if (nextSort && nextSort !== "latest") params.set("sort", nextSort);

    const value = params.toString();
    router.replace(value ? `${pathname}?${value}#artikel` : `${pathname}#artikel`, { scroll: false });
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (search.trim() === query) return;
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (category) params.set("category", category);
      if (sort && sort !== "latest") params.set("sort", sort);
      const value = params.toString();
      router.replace(value ? `${pathname}?${value}#artikel` : `${pathname}#artikel`, { scroll: false });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search, query, category, sort, pathname, router]);

  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="mb-10 grid gap-3 border-y border-[#d8d2c7] py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] dark:border-[#3b3c37]"
    >
      <label className="sr-only" htmlFor="search">Cari artikel</label>
      <input
        id="search"
        name="q"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cari berita, JLPT, MEXT, budaya..."
        className="min-w-0 border-b border-[#bdb7ac] bg-transparent px-0 py-2 text-sm text-[#20211f] outline-none placeholder:text-gray-500 focus:border-[#c83c2d] dark:border-[#4a4b45] dark:text-white"
      />
      <label className="sr-only" htmlFor="category">Filter rubrik</label>
      <select
        id="category"
        name="category"
        value={category}
        onChange={(event) => updateUrl({ category: event.target.value })}
        className="border-b border-[#bdb7ac] bg-transparent px-0 py-2 text-sm text-[#20211f] outline-none focus:border-[#c83c2d] dark:border-[#4a4b45] dark:bg-[#1d1e1b] dark:text-white"
      >
        <option value="">Semua rubrik</option>
        {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
      </select>
      <label className="sr-only" htmlFor="sort">Urutkan artikel</label>
      <select
        id="sort"
        name="sort"
        value={sort || "latest"}
        onChange={(event) => updateUrl({ sort: event.target.value })}
        className="border-b border-[#bdb7ac] bg-transparent px-0 py-2 text-sm text-[#20211f] outline-none focus:border-[#c83c2d] dark:border-[#4a4b45] dark:bg-[#1d1e1b] dark:text-white"
      >
        <option value="latest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="title">Judul A-Z</option>
      </select>
      <p className="text-xs text-gray-500 sm:col-span-3">Hasil diperbarui otomatis saat kamu mengetik atau memilih rubrik.</p>
    </form>
  );
}
