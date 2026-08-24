"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", { formData });
    return {};
  } catch (err) {
    if (err instanceof AuthError) return { error: "Email atau password salah." };
    throw err;
  }
}
