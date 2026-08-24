import { pgTable, serial, varchar, text, timestamp, integer, pgEnum, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ponytail: enum native PG — upgrade path: ubah ke varchar+check kalau butuh nilai dinamis.
export const userRole = pgEnum("user_role", ["admin", "writer"]);
export const postStatus = pgEnum("post_status", ["draft", "published"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRole("role").notNull().default("writer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: varchar("description", { length: 300 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 250 }).notNull().unique(),
    excerpt: varchar("excerpt", { length: 320 }),
    contentHtml: text("content_html").notNull(),
    contentText: text("content_text").notNull().default(""),
    thumbnailUrl: text("thumbnail_url"),
    status: postStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
  },
  (t) => [
    index("idx_posts_status_published").on(t.status, t.publishedAt.desc()),
    index("idx_posts_category").on(t.categoryId),
    index("idx_posts_author").on(t.authorId),
  ]
);
