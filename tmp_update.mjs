import('postgres').then(async ({default: sql}) => {
  const {default: bcrypt}=await import('bcryptjs');
  const h=await bcrypt.hash('password',10);
  await sql`UPDATE users SET password_hash=${h} WHERE email='admin@benkyoulab.online'`;
  const u=await sql`SELECT password_hash FROM users WHERE email='admin@benkyoulab.online'`;
  console.log('hash:',u[0].password_hash);
  await sql.end();
});