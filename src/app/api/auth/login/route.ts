import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { authenticateAdmin, sessionCookieName, sessionCookieOptions } from "@/lib/auth";
import { validPin } from "@/lib/session-crypto";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ success: false, message: "Solicitud no permitida" }, { status: 403 });
  }
  const limit = await env.LOGIN_LIMITER.limit({ key: request.headers.get("CF-Connecting-IP") || "unknown" });
  if (!limit.success) return NextResponse.json({ success: false, message: "Espera un minuto antes de intentar de nuevo" }, { status: 429, headers: { "Retry-After": "60" } });
  if (Number(request.headers.get("content-length")) > 1024) return new Response(null, { status: 413 });
  let code: FormDataEntryValue | null;
  try { code = (await request.formData()).get("code"); }
  catch { return NextResponse.json({ success: false, message: "Código no válido" }, { status: 400 }); }
  const token = validPin(code) ? await authenticateAdmin(code) : null;

  if (!token) {
    return NextResponse.json({ success: false, message: "Código incorrecto" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(sessionCookieName(), token, sessionCookieOptions());
  response.cookies.delete("admin_session");
  return response;
}
