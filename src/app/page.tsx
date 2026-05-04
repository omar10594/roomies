import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/app/actions/auth";

export default async function HomePage() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) {
    redirect("/admin/dashboard");
  }
  redirect("/login");
}
