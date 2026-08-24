import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";

// DEBUG: cek apakah server (di Vercel) bisa login dengan kredensial default.
// HAPUS setelah troubleshooting selesai.
export async function GET() {
  try {
    const email = "admin@benkyoulab.online";
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return NextResponse.json({ ok: false, reason: "user not found in DB" });
    }
    const ok = await bcrypt.compare("password", user.passwordHash);
    return NextResponse.json({
      ok,
      userId: user.id,
      hashPrefix: user.passwordHash.slice(0, 7),
      hashLen: user.passwordHash.length,
      dbHost: new URL(process.env.DATABASE_URL ?? "").host,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}