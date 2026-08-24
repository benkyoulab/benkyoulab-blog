import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction } from "./actions";
import LoginForm from "./login-form";

export const metadata = { title: "Masuk" };

export default async function LoginPage() {
  if (await auth()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-medium tracking-widest text-red-600 uppercase">Benkyou Lab</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Masuk ke Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">勉強 — area penulis & admin</p>
        </div>
        <LoginForm action={loginAction} />
      </div>
    </main>
  );
}
