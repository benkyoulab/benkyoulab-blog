"use server";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", { formData });
    return {};
  } catch (err) {
    // ponytail: NEXT_REDIRECT dibungkus RedirectError — harus dilempar ulang,
    // bukan dianggap AuthError, kalau tidak success akan kelihatan sebagai error login.
    if (isRedirectError(err)) throw err;
    if (err instanceof AuthError) return { error: "Email atau password salah." };
    throw err;
  }
}