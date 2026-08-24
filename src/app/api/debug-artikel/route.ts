// DEBUG — hapus setelah issue resolved.
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, categories } from "@/db/schema";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";
    const uid = session?.user?.id;
    const rows = await db
      .select({
        id: posts.id,
        title: posts.title,
        author: users.name,
        category: categories.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(isAdmin ? undefined : eq(posts.authorId, Number(uid)))
      .orderBy(desc(posts.updatedAt))
      .limit(5);
    return NextResponse.json({
      ok: true,
      isAdmin,
      uid,
      "typeof uid": typeof uid,
      "Number(uid)": Number(uid),
      "isNaN": Number.isNaN(Number(uid)),
      count: rows.length,
      rows,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error)?.message, stack: (e as Error)?.stack?.slice(0, 800) },
      { status: 500 },
    );
  }
}