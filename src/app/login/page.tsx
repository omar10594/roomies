import { isAdminAuthenticated } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import PinInput from "./pin-input";

export default async function LoginPage() {
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
