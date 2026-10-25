import type { D1Database } from "@cloudflare/workers-types";
import { hashPin, newSessionToken, sessionHash, SESSION_TTL_MS, validSessionToken, verifyPin } from "./session-crypto";

type AuthDatabase = Pick<D1Database, "prepare" | "batch">;

export async function authenticatePin(database: AuthDatabase, pin: unknown, now = Date.now()): Promise<string | null> {
  const credential = await database.prepare("SELECT value FROM settings WHERE key = 'admin_access_code'").first<{ value: string }>();
  if (!credential || !await verifyPin(pin, credential.value)) return null;
  const token = newSessionToken();
  await database.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").bind(now).run();
  // A concurrent PIN change must not allow a session based on an old credential.
  const result = await database.prepare("INSERT INTO admin_sessions (token_hash, expires_at) SELECT ?, ? FROM settings WHERE key = 'admin_access_code' AND value = ?")
    .bind(await sessionHash(token), now + SESSION_TTL_MS, credential.value).run();
  return result.meta.changes === 1 ? token : null;
}

export async function hasAdminSession(database: AuthDatabase, token: unknown, now = Date.now()): Promise<boolean> {
  if (!validSessionToken(token)) return false;
  const session = await database.prepare("SELECT token_hash FROM admin_sessions WHERE token_hash = ? AND expires_at > ?")
    .bind(await sessionHash(token), now).first();
  return Boolean(session);
}

export async function revokeAdminSession(database: AuthDatabase, token: unknown): Promise<void> {
  if (validSessionToken(token)) await database.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").bind(await sessionHash(token)).run();
}

export async function rotateAdminPin(database: AuthDatabase, pin: string): Promise<void> {
  const hashed = await hashPin(pin);
  await database.batch([
    database.prepare("INSERT INTO settings (key, value) VALUES ('admin_access_code', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(hashed),
    database.prepare("DELETE FROM admin_sessions"),
  ]);
}
