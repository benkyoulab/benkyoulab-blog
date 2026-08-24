import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const email = creds?.email?.toString().trim().toLowerCase();
        const password = creds?.password?.toString();
        console.log("[auth] attempt:", { email, passwordLen: password?.length });
        if (!email || !password) return null;

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        console.log("[auth] user found:", user?.id, "hash prefix:", user?.passwordHash?.slice(0, 7));
        // ponytail: bcrypt compare selalu jalan (dummy hash saat user tak ada) supaya
        // timing konsisten — upgrade path: rate-limit login per IP kalau diserang.
        const ok = await bcrypt.compare(
          password,
          user?.passwordHash ?? "$2a$10$C6UzMDM.H6dfI/f/IKcEeO7ZBpQ0N0JmBq1P0zXK9u0uLmRlZ6y2W"
        );
        console.log("[auth] bcrypt ok:", ok);
        if (!user || !ok) return null;

        return { id: String(user.id), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: "admin" | "writer" }).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role as "admin" | "writer" | undefined;
      return session;
    },
  },
});
