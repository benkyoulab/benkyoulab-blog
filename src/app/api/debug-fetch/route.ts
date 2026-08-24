// DEBUG — hapus setelah solved.
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("/api/auth/csrf", { cache: "no-store", redirect: "manual" });
    const txt = await res.text();
    return NextResponse.json({ status: res.status, body: txt.slice(0,100), ok: res.ok });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message, stack: (e as Error).stack?.slice(0,400) }, { status: 500 });
  }
}