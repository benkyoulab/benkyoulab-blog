// DEBUG — hapus setelah issue solved.
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user
        ? { id: session.user.id, email: session.user.email, role: session.user.role, name: session.user.name }
        : null,
      isAdmin: session?.user?.role === "admin",
      "typeof id": typeof session?.user?.id,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message, stack: (e as Error).stack?.slice(0,400) }, { status: 500 });
  }
}