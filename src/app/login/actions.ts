"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    // signIn melempar NEXT_REDIRECT saat sukses (via internal redirect) — itu wajar
    // dan harus dibiarkan terbang keluar dari action. Hanya AuthError spesifik login
    // yang boleh ditangkep dan ditampilkan ke user.
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (err) {
    // ponytail: NEXT_REDIRECT (sukses) & NOT_FOUND dll ditandai `digest` "NEXT_*";
    // hanya CredentialsSignin (gagal login) yang ditampilkan ke user.
    const digest = (err as { digest?: string })?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
    if (err instanceof AuthError) return { error: "Email atau password salah." };
    throw err;
  }
}