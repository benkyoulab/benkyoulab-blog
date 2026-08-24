import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// prepare:false wajib untuk Supabase Transaction Pooler (port 6543)
export const db = drizzle(postgres(process.env.DATABASE_URL!, { prepare: false }), { schema });
