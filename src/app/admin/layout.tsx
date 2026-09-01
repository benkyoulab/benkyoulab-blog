import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { requireUserSession } from "@/lib/auth-guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  try {
    requireUserSession(session);
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link href="/admin" className="font-bold text-gray-900">
            Benkyou<span className="text-red-600">Lab</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/artikel" className="text-gray-700 hover:text-red-600">
              Artikel
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin/kategori" className="text-gray-700 hover:text-red-600">
                Kategori
              </Link>
              )}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-gray-500">{session?.user?.name}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-50">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
