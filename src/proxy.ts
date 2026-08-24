import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Konvensi Next.js 16: middleware.ts -> proxy.ts (runtime Node.js).
export async function proxy(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !session) {
    return Response.redirect(new URL("/login", req.url));
  }
  if (pathname === "/login" && session) {
    return Response.redirect(new URL("/admin", req.url));
  }
}

export const config = { matcher: ["/admin/:path*", "/login"] };
