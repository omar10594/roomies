import { cookies } from "next/headers";
import { env } from "cloudflare:workers";
import { authenticatePin, hasAdminSession, revokeAdminSession, rotateAdminPin } from "./admin-store";
import { SESSION_TTL_MS } from "./session-crypto";

export const sessionCookieName = () => process.env.NODE_ENV === "production" ? "__Host-roomies_admin" : "roomies_admin_dev";
export const sessionCookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, maxAge: SESSION_TTL_MS / 1000, path: "/" });

export async function authenticateAdmin(pin: unknown): Promise<string | null> {
  return authenticatePin(env.DB, pin);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(sessionCookieName())?.value;
  return hasAdminSession(env.DB, token);
}

export async function requireAdmin(): Promise<void> {
  if (!await isAdminAuthenticated()) throw new Error("Acceso de administrador requerido");
}

export async function endAdminSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(sessionCookieName())?.value;
  await revokeAdminSession(env.DB, token);
  store.delete(sessionCookieName());
  store.delete("admin_session");
}

export async function updateAdminCode(pin: string): Promise<void> {
  await rotateAdminPin(env.DB, pin);
  const token = await authenticateAdmin(pin);
  if (!token) throw new Error("No se pudo renovar la sesión");
  (await cookies()).set(sessionCookieName(), token, sessionCookieOptions());
}
