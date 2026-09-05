import { getRoomieBySlug, getPaymentsByRoomie, getDepositAccounts } from "@/app/actions/data";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import RoomiePinLogin from "./roomie-pin-login";
import RoomieDashboard from "./roomie-dashboard";
import { Suspense } from "react";
import { PageLoading } from "@/components/page-loading";

type PublicRoomiePageProps = {
  readonly params: Promise<{ readonly slug: string }>;
};

export async function generateMetadata({ params }: PublicRoomiePageProps) {
  const { slug } = await params;
  return { title: `${slug} - Roomies` };
}

export default function PublicRoomiePage({ params }: PublicRoomiePageProps) {
  return (
    <Suspense fallback={<PageLoading className="min-h-screen bg-[#f8faf8]" />}>
      <PublicRoomieContent params={params} />
    </Suspense>
  );
}

async function PublicRoomieContent({ params }: PublicRoomiePageProps) {
  const { slug } = await params;
  const roomie = await getRoomieBySlug(slug);

  if (!roomie) {
    notFound();
  }

  // Check if already verified via cookie
  const cookieStore = await cookies();
  const verified = cookieStore.get(`roomie_${slug}`)?.value === "verified";

  if (roomie.accessCode && !verified) {
    return <RoomiePinLogin slug={roomie.slug} name={roomie.name} />;
  }

  const payments = await getPaymentsByRoomie(roomie.id);
  const depositAccounts = await getDepositAccounts();

  return <RoomieDashboard roomie={roomie} payments={payments} depositAccounts={depositAccounts} />;
}
