import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCode } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const code = body.get("code") as string;
  const valid = await verifyAdminCode(code);

  if (!valid) {
    return NextResponse.json({ success: false, message: "Código incorrecto" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "verified", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return response;
}
