import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/app/actions/auth";
import { Suspense } from "react";
import { PageLoading } from "@/components/page-loading";

export default function HomePage() {
  return (
    <Suspense fallback={<PageLoading className="min-h-screen bg-[#f8faf8]" />}>
      <HomeRedirect />
    </Suspense>
  );
}

async function HomeRedirect() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) {
    return redirect("/admin/dashboard");
  }
  return redirect("/login");
}
