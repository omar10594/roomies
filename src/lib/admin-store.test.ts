import assert from "node:assert/strict";
import test from "node:test";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { authenticatePin, hasAdminSession, revokeAdminSession, rotateAdminPin } from "./admin-store";
import { SESSION_TTL_MS } from "./session-crypto";

test("real D1 sessions reject forged cookies, expire, revoke on logout, and invalidate after a PIN change", async () => {
  const runtime = new Miniflare(convertV4MiniflareOptions({ modules: true, script: "export default { fetch() { return new Response('test'); } }", compatibilityDate: "2026-10-22", d1Databases: { DB: "isolated-admin-test" } }));
  try {
    const database = await runtime.getD1Database("DB");
    await database.prepare("CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)").run();
    await database.prepare("CREATE TABLE admin_sessions (token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL)").run();
    await rotateAdminPin(database, "0123");
    const now = Date.now();
    assert.equal(await authenticatePin(database, "3210", now), null);
    assert.equal(await authenticatePin(database, "01234", now), null);
    assert.equal(await hasAdminSession(database, "verified", now), false);
    assert.equal(await hasAdminSession(database, "a".repeat(64), now), false);
    const first = await authenticatePin(database, "0123", now);
    assert.ok(first);
    assert.equal(await hasAdminSession(database, first, now), true);
    assert.equal(await hasAdminSession(database, first, now + SESSION_TTL_MS), false);
    const stored = await database.prepare("SELECT token_hash FROM admin_sessions").first<{ token_hash: string }>();
    assert.notEqual(stored?.token_hash, first);
    await revokeAdminSession(database, first);
    assert.equal(await hasAdminSession(database, first, now), false);
    const second = await authenticatePin(database, "0123", now);
    const third = await authenticatePin(database, "0123", now);
    await rotateAdminPin(database, "0456");
    assert.equal(await hasAdminSession(database, second, now), false);
    assert.equal(await hasAdminSession(database, third, now), false);
    assert.equal(await authenticatePin(database, "0123", now), null);
    assert.ok(await authenticatePin(database, "0456", now));
  } finally { await runtime.dispose(); }
});
