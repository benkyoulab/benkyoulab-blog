import { test } from "node:test";
import assert from "node:assert/strict";

import { checkLoginRateLimit, resetLoginRateLimit } from "./auth-rate-limit";

test("login rate limiter allows first attempts and blocks after limit", () => {
  const key = "user@example.com";

  resetLoginRateLimit(key);

  for (let i = 0; i < 5; i += 1) {
    const result = checkLoginRateLimit(key);
    assert.equal(result.allowed, true);
  }

  const blocked = checkLoginRateLimit(key);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterMs !== undefined);
});

test("login rate limiter resets when cleared", () => {
  const key = "clear@example.com";

  for (let i = 0; i < 5; i += 1) {
    checkLoginRateLimit(key);
  }

  const blocked = checkLoginRateLimit(key);
  assert.equal(blocked.allowed, false);

  resetLoginRateLimit(key);

  const allowed = checkLoginRateLimit(key);
  assert.equal(allowed.allowed, true);
});
