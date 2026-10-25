import { endAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return new Response(null, { status: 403 });
  await endAdminSession();
  return new Response(null, { status: 302, headers: { Location: "/login", "Cache-Control": "no-store" } });
}
