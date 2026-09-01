import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { checkLoginRateLimit, resetLoginRateLimit } from "@/lib/auth-rate-limit";

const formatRetryDelay = (retryAfterMs?: number): string => {
  if (!retryAfterMs || retryAfterMs <= 0) return "beberapa saat";
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return `${seconds} detik`;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const email = creds?.email?.toString().trim().toLowerCase();
        const password = creds?.password?.toString();
        if (!email || !password) return null;

        const rate = checkLoginRateLimit(email);
        if (!rate.allowed) {
          const retryMessage = `Terlalu banyak percobaan login. Silakan coba lagi dalam ${formatRetryDelay(rate.retryAfterMs)}.`;
          console.warn(`[auth] login rate limit reached for ${email}. Retry after ${formatRetryDelay(rate.retryAfterMs)}.`);
          throw new CredentialsSignin(retryMessage);
        }

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        // ponytail: bcrypt compare selalu jalan (dummy hash saat user tak ada) supaya
        // timing konsisten — upgrade path: rate-limit login per IP kalau diserang.
        const ok = await bcrypt.compare(
          password,
          user?.passwordHash ?? "$2a$10$C6UzMDM.H6dfI/f/IKcEeO7ZBpQ0N0JmBq1P0zXK9u0uLmRlZ6y2W"
        );

        if (!user || !ok) {
          return null;
        }

        resetLoginRateLimit(email);
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
      if (session.user) {
        session.user.id = token.sub as string;  // pastikan author_id selalu valid di seluruh server action
        session.user.role = token.role as "admin" | "writer" | undefined;
      }
      return session;
    },
  },
});
