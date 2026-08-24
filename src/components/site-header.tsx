import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight">
            Benkyou<span className="text-red-600">Lab</span>
          </span>
          <span className="hidden text-xs text-gray-400 sm:inline">勉強</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            Beranda
          </Link>
          <Link
            href="/kategori"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            Kategori
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Tulis
          </Link>
        </nav>
      </div>
    </header>
  );
}
