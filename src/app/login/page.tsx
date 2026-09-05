import { isAdminAuthenticated } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import PinInput from "./pin-input";
import { Suspense } from "react";
import { PageLoading } from "@/components/page-loading";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoading className="min-h-screen bg-[#f8faf8]" />}>
      <LoginContent />
    </Suspense>
  );
}

async function LoginContent() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] p-4">
      <PinInput />
    </div>
  );
}
