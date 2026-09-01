import { test } from "node:test";
import assert from "node:assert/strict";

import { canManagePost, requireAdminAccess, requireUserSession } from "./auth-guards";

test("requireUserSession rejects unauthenticated access", () => {
  assert.throws(() => requireUserSession(null), /login/i);
});

test("requireAdminAccess rejects non-admin users", () => {
  assert.throws(() => requireAdminAccess({ user: { id: "2", role: "writer" } } as any), /admin/i);
});

test("writers can only manage their own posts", () => {
  const session = { user: { id: "2", role: "writer" } } as any;
  assert.equal(canManagePost(session, 2), true);
  assert.equal(canManagePost(session, 3), false);
});
