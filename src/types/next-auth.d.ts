import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id?: string; role?: "admin" | "writer" } & DefaultSession["user"];
  }
  interface User {
    role?: "admin" | "writer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "writer";
  }
}
