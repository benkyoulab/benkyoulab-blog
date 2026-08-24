import Link from "next/link";

export default function AdminHome() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/artikel/baru" className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-3xl">✍️</p>
          <p className="mt-2 font-semibold text-gray-900">Tulis Artikel Baru</p>
          <p className="text-sm text-gray-500">Mulai draft dan publish materi baru</p>
        </Link>
        <Link href="/admin/artikel" className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-3xl">📚</p>
          <p className="mt-2 font-semibold text-gray-900">Kelola Artikel</p>
          <p className="text-sm text-gray-500">Edit, publish, atau hapus artikel</p>
        </Link>
      </div>
    </>
  );
}
