"use server";

import { cookies } from "next/headers";
import { updateAdminCode } from "@/lib/auth";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "verified";
}

export async function changeAdminCodeAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
) {
  const newCode = formData.get("newCode") as string;
  if (newCode.length < 4 || newCode.length > 6 || !/^\d+$/.test(newCode)) {
    return { error: "El código debe tener entre 4 y 6 dígitos", success: false };
  }
  await updateAdminCode(newCode);
  return { error: "", success: true };
}
