const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const loginAttempts = new Map<string, { count: number; firstAttemptAt: number; blockedUntil?: number }>();

export function checkLoginRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    loginAttempts.set(key, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (record.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterMs: Math.max(0, record.blockedUntil - now),
    };
  }

  if (record.blockedUntil && record.blockedUntil <= now) {
    loginAttempts.delete(key);
    loginAttempts.set(key, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  const nextCount = record.count + 1;

  if (nextCount > MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - record.firstAttemptAt);
    loginAttempts.set(key, {
      count: nextCount,
      firstAttemptAt: record.firstAttemptAt,
      blockedUntil: now + retryAfterMs,
    });
    return {
      allowed: false,
      retryAfterMs: Math.max(1000, retryAfterMs),
    };
  }

  loginAttempts.set(key, { ...record, count: nextCount });
  return { allowed: true };
}

export function resetLoginRateLimit(key: string): void {
  loginAttempts.delete(key);
}
