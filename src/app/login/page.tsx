import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction } from "./actions";
import LoginForm from "./login-form";

export const metadata = { title: "Masuk" };

export default async function LoginPage() {
  if (await auth()) redirect("/admin");

  // csrfToken dikirim otomatis oleh Auth.js lewat cookie — tidak perlu fetch di server.
  // login-form.tsx butuh prop string; beri string kosong, action akan inject via signIn.
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
        <div className="mb-6 text-center">
          <p className="text-xs font-medium tracking-widest text-red-600 uppercase">Benkyou Lab</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">Masuk ke Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">勉強 — area penulis &amp; admin</p>
        </div>
        <LoginForm action={loginAction} />
      </div>
    </main>
  );
}