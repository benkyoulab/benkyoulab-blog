"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    // signIn("credentials", {...}) otomatis POST ke /api/auth/callback/credentials
    // termasuk csrfToken dari cookie. Tapi di App Router server action,
    // csrfToken harus dikirim eksplisit via body (ada di formData dari hidden input).
    const csrfToken = formData.get("csrfToken");
    await signIn("credentials", {
      redirectTo: "/admin",
      email: formData.get("email"),
      password: formData.get("password"),
      csrfToken: csrfToken ? csrfToken.toString() : undefined,
    });
    return {};
  } catch (err) {
    // Auth.js lempar NEXT_REDIRECT / REVALIDATE saat redirectTo (sukses) — jangan tangkep.
    const digest = (err as { digest?: string })?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;
    if (err instanceof AuthError) return { error: "Email atau password salah." };
    throw err;
  }
}