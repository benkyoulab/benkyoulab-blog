import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // DRIZZLY_URL: override utk tooling lokal via Supabase SESSION pooler (:5432).
  // Transaction pooler (:6543) bikin drizzle-kit push hang.
  dbCredentials: { url: process.env.DRIZZLY_URL ?? process.env.DATABASE_URL! },
});
