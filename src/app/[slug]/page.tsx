import { getRoomieBySlug, getPaymentsByRoomie, getDepositAccounts } from "@/app/actions/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import CopyButton from "./copy-button";
import RoomiePinLogin from "./roomie-pin-login";
import RoomieDashboard from "./roomie-dashboard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug} - Roomies` };
}

export default async function PublicRoomiePage({ params }: { params: Promise<{ slug: string }> }) {
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
