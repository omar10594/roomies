export async function POST() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return new Response(null, { status: 302, headers: { Location: "/login" } });
}
