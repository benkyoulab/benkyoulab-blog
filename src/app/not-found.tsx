import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4">
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm dark:bg-gray-900">
        <p className="text-5xl">🍂</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">404 — halaman yang kamu cari tidak ada atau sudah dipindah.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-red-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
