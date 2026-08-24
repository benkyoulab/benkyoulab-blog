import postgres from "postgres";
import bcrypt from "bcryptjs";

const db = postgres(process.env.DATABASE_URL, { prepare: false });

// 1. Cek user ada
const res = await db`SELECT id,email,password_hash FROM users WHERE email='admin@benkyoulab.online'`;
console.log("USER:", JSON.stringify(res, null, 2));

// 2. Buat hash baru untuk password "password" dan update
const hash = await bcrypt.hash("password", 10);
const upd = await db`
  UPDATE users
  SET password_hash = ${hash}
  WHERE email = 'admin@benkyoulab.online'
  RETURNING id, email, role
`;
console.log("UPDATE:", JSON.stringify(upd, null, 2));

// 3. Verifikasi compare
const ok = await bcrypt.compare("password", hash);
console.log("VERIFY:", ok);

await db.end();