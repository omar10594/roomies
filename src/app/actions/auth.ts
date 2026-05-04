"use server";

import { cookies } from "next/headers";
import { verifyAdminCode, updateAdminCode } from "@/lib/auth";

export async function verifyCodeAction(formData: FormData) {
  const code = formData.get("code") as string;
  const valid = await verifyAdminCode(code);
  if (!valid) {
    return { success: false, message: "Código incorrecto" };
  }
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "verified", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

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
