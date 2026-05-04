import { db } from "../lib/db";
import { settings } from "../lib/db/schema";
import { eq } from "drizzle-orm";

export async function getAdminCode(): Promise<string | null> {
  const result = await db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, "admin_access_code"))
    .limit(1);

  return result[0]?.value ?? null;
}

export async function verifyAdminCode(inputCode: string): Promise<boolean> {
  const stored = await getAdminCode();
  if (!stored) return false;
  return stored === inputCode;
}

export async function updateAdminCode(newCode: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key: "admin_access_code", value: newCode })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: newCode },
    })
    .run();
}
