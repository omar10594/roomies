import { NextRequest, NextResponse } from "next/server";
import { getRoomieBySlug } from "@/app/actions/data";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.formData();
  const code = body.get("code") as string;
  const roomie = await getRoomieBySlug(slug);

  if (!roomie || roomie.accessCode !== code) {
    return NextResponse.json({ success: false, message: "Código incorrecto" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(`roomie_${slug}`, "verified", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: `/${slug}`,
  });
  return response;
}
