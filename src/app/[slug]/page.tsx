import { getRoomieBySlug, getPaymentsByRoomie, getDepositAccounts } from "@/app/actions/data";
import { notFound } from "next/navigation";
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

  const payments = await getPaymentsByRoomie(roomie.id);
  const depositAccounts = await getDepositAccounts();

  return <RoomieDashboard roomie={roomie} payments={payments} depositAccounts={depositAccounts} />;
}
