"use server";

import { isAdminAuthenticated as authenticated, requireAdmin, updateAdminCode } from "@/lib/auth";
import { validPin } from "@/lib/session-crypto";

export async function isAdminAuthenticated(): Promise<boolean> {
  return authenticated();
}

export async function changeAdminCodeAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
) {
  await requireAdmin();
  const newCode = formData.get("newCode");
  if (!validPin(newCode)) {
    return { error: "El código debe tener exactamente 4 dígitos", success: false };
  }
  await updateAdminCode(newCode);
  return { error: "", success: true };
}
