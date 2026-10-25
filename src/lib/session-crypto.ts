const encoder = new TextEncoder();
const iterations = 100_000;
const hex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const validPin = (value: unknown): value is string => typeof value === "string" && /^\d{4}$/.test(value);
export const validSessionToken = (value: unknown): value is string => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
export const newSessionToken = () => hex(crypto.getRandomValues(new Uint8Array(32)));

export async function sessionHash(token: string): Promise<string> {
  return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(token))));
}

async function derivePin(pin: string, salt: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(pin), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", iterations, salt: encoder.encode(salt) }, key, 256));
}

export async function hashPin(pin: string): Promise<string> {
  if (!validPin(pin)) throw new Error("El código debe tener exactamente 4 dígitos");
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  return `pbkdf2:${iterations}:${salt}:${hex(await derivePin(pin, salt))}`;
}

export async function verifyPin(pin: unknown, stored: string): Promise<boolean> {
  if (!validPin(pin)) return false;
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2" || parts[1] !== String(iterations) || !/^[a-f0-9]{32}$/.test(parts[2]) || !/^[a-f0-9]{64}$/.test(parts[3])) return false;
  const actual = hex(await derivePin(pin, parts[2]));
  let different = 0;
  for (let i = 0; i < actual.length; i++) different |= actual.charCodeAt(i) ^ parts[3].charCodeAt(i);
  return different === 0;
}
