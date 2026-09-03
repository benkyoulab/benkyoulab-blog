function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-12 w-full rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="aspect-[16/9] w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export default function ArticleLoading() {
  return (
    <main className="flex-1 bg-white dark:bg-gray-950" aria-label="Memuat artikel">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="max-w-prose">
          <ArticleSkeleton />
        </section>
        <aside className="hidden space-y-4 pt-4 lg:block">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />
          ))}
        </aside>
      </div>
    </main>
  );
}
