// DEBUG — hapus setelah issue solved.
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    return NextResponse.json({ hasSession: !!session, session: session ? { id: session.user?.id, email: session.user?.email, role: session.user?.role } : null });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message, stack: (e as Error).stack?.slice(0, 500) }, { status: 500 });
  }
}