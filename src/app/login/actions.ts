"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    // Auth.js Credentials provider — signIn server function otomatis handle CSRF
    // lewat cookie header yang sama request. Cukup kirim email+password.
    await signIn("credentials", {
      redirectTo: "/admin",
      email: formData.get("email"),
      password: formData.get("password"),
    });
    return {};
  } catch (err) {
    // Auth.js lempar redirect error (sukses) — jangan tangkep sebagai error login.
    const digest = (err as { digest?: string })?.digest;
    if (typeof digest === "string" && /^NEXT_/.test(digest)) throw err;
    if (err instanceof AuthError) {
      const message = err.message?.trim();
      return {
        error: /Terlalu banyak|Too many/i.test(message)
          ? message || "Terlalu banyak percobaan login. Silakan coba lagi nanti."
          : "Email atau password salah.",
      };
    }
    throw err;
  }
}