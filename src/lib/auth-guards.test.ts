import { test } from "node:test";
import assert from "node:assert/strict";

import { canManagePost, requireAdminAccess, requireUserSession } from "./auth-guards";

type TestSession = {
  user: {
    id: string;
    role: "admin" | "writer";
  };
};

test("requireUserSession rejects unauthenticated access", () => {
  assert.throws(() => requireUserSession(null), /login/i);
});

test("requireAdminAccess rejects non-admin users", () => {
  const session: TestSession = { user: { id: "2", role: "writer" } };
  assert.throws(() => requireAdminAccess(session), /admin/i);
});

test("writers can only manage their own posts", () => {
  const session: TestSession = { user: { id: "2", role: "writer" } };
  assert.equal(canManagePost(session, 2), true);
  assert.equal(canManagePost(session, 3), false);
});
