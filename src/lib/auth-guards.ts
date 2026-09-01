import { redirect } from "next/navigation";

export type AppSessionUser = { id?: string | null; role?: "admin" | "writer" | null; name?: string | null };
export type AppSession = { user?: AppSessionUser | null } | null | undefined;

export function requireUserSession(session: AppSession): { user: AppSessionUser } {
  const user = session?.user;
  if (!user?.id) {
    throw new Error("Harus login untuk mengakses halaman ini.");
  }
  return { user };
}

export function requireAdminAccess(session: AppSession): { user: AppSessionUser } {
  const { user } = requireUserSession(session);
  if (user.role !== "admin") {
    throw new Error("Akses admin diperlukan.");
  }
  return { user };
}

export function canManagePost(session: AppSession, authorId: number | null | undefined): boolean {
  const user = session?.user;
  if (!user?.id) return false;
  if (user.role === "admin") return true;
  return Number(user.id) === Number(authorId);
}

export function redirectIfUnauthenticated(session: AppSession): void {
  try {
    requireUserSession(session);
  } catch {
    redirect("/login");
  }
}
