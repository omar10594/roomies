import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/app/actions/auth";
import Sidebar from "@/components/admin/sidebar";
import { Suspense } from "react";
import { PageLoading } from "@/components/page-loading";

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AdminLoadingShell />}>
      <AuthenticatedAdminLayout>{children}</AuthenticatedAdminLayout>
    </Suspense>
  );
}

async function AuthenticatedAdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pt-14 md:pt-6 md:pl-64">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminLoadingShell() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pt-14 md:pt-6 md:pl-64">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <PageLoading />
        </div>
      </main>
    </div>
  );
}
