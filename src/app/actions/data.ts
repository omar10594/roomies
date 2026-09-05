"use server";

import { db } from "@/lib/db";
import { roomies, payments, depositAccounts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateId, toCents } from "@/lib/utils";
import { getRentSummary } from "@/lib/rent";

export async function getDashboardData() {
  const allRoomies = await db.query.roomies.findMany();
  const activeRoomies = allRoomies.filter((r) => r.isActive);

  const allPayments = await db
    .select()
    .from(payments)
    .orderBy(desc(payments.date));

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthPayments = allPayments.filter((p) => {
    const d = new Date(p.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalCollected = monthPayments.reduce((acc, p) => acc + p.amount, 0);

  const roomieStatuses = activeRoomies.map((r) => {
    const { pendiente, atrasado } = getRentSummary(
      r,
      allPayments.filter(p => p.roomieId === r.id),
      today,
    );
    return {
      ...r,
      isPaid: pendiente === 0,
      pendiente,
      atrasado,
      hasAtrasado: atrasado > 0,
    };
  });

  const recentPayments = allPayments.slice(0, 10);

  return {
    activeRoomies: activeRoomies.length,
    totalCollected,
    totalPending: roomieStatuses.reduce((sum, r) => sum + r.pendiente, 0),
    recentPayments,
    roomieStatuses,
  };
}

export async function getRoomies() {
  return await db.select().from(roomies).orderBy(roomies.name);
}

export async function createRoomieAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const rentAmount = toCents(parseInt(formData.get("rentAmount") as string));
  const rentDay = parseInt(formData.get("rentDay") as string);
  const startDate = formData.get("startDate") as string || null;
  const graceDays = Number((formData.get("graceDays") as string) || 5);
  const accessCode = formData.get("accessCode") as string || null;
  const isActive = formData.get("isActive") === "on";

  if (!name || !slug || !rentAmount || !rentDay) {
    return { error: "Todos los campos son requeridos" };
  }

  await db.insert(roomies).values({
    id: generateId(),
    name,
    slug,
    rentAmount,
    rentDay,
    startDate: startDate || null,
    graceDays,
    accessCode: accessCode || null,
    isActive,
  });

  return null;
}

export async function updateRoomieAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const rentAmount = toCents(parseInt(formData.get("rentAmount") as string));
  const rentDay = parseInt(formData.get("rentDay") as string);
  const startDate = formData.get("startDate") as string || null;
  const graceDays = Number((formData.get("graceDays") as string) || 5);
  const accessCode = formData.get("accessCode") as string || null;
  const isActive = formData.get("isActive") === "on";

  if (!id || !name || !slug || !rentAmount || !rentDay) {
    return { error: "Todos los campos son requeridos" };
  }

  await db
    .update(roomies)
    .set({ name, slug, rentAmount, rentDay, startDate: startDate || null, graceDays, accessCode: accessCode || null, isActive })
    .where(eq(roomies.id, id));

  return null;
}

export async function deleteRoomieAction(roomieId: string) {
  await db.delete(payments).where(eq(payments.roomieId, roomieId));
  await db.delete(roomies).where(eq(roomies.id, roomieId));
}

export async function recordPaymentAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
) {
  const roomieId = formData.get("roomieId") as string;
  const amount = toCents(parseInt(formData.get("amount") as string));
  const date = formData.get("date") as string;
  const note = (formData.get("note") as string) || null;

  if (!roomieId || !amount || !date) {
    return { error: "Todos los campos son requeridos", success: false };
  }

  await db.insert(payments).values({
    id: generateId(),
    roomieId,
    amount,
    date,
    note,
  });

  return { error: "", success: true };
}

export async function getPayments() {
  return await db
    .select({
      payment: payments,
      roomieName: roomies.name,
      roomieSlug: roomies.slug,
    })
    .from(payments)
    .leftJoin(roomies, eq(payments.roomieId, roomies.id))
    .orderBy(desc(payments.date));
}

export async function updatePaymentAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
) {
  const id = formData.get("id") as string;
  const roomieId = formData.get("roomieId") as string;
  const amount = toCents(parseInt(formData.get("amount") as string));
  const date = formData.get("date") as string;
  const note = (formData.get("note") as string) || null;

  if (!id || !roomieId || !amount || !date) {
    return { error: "Todos los campos son requeridos", success: false };
  }

  await db
    .update(payments)
    .set({ roomieId, amount, date, note })
    .where(eq(payments.id, id));

  return { error: "", success: true };
}

export async function deletePaymentAction(paymentId: string) {
  await db.delete(payments).where(eq(payments.id, paymentId));
}

export async function getDepositAccounts() {
  return await db.select().from(depositAccounts).orderBy(depositAccounts.label);
}

export async function createDepositAccountAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const clabe = formData.get("clabe") as string;
  const label = formData.get("label") as string;

  if (!clabe || !label) {
    return { error: "Todos los campos son requeridos" };
  }

  await db.insert(depositAccounts).values({
    id: generateId(),
    clabe,
    label,
    isActive: true,
  });

  return null;
}

export async function updateDepositAccountAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const id = formData.get("id") as string;
  const clabe = formData.get("clabe") as string;
  const label = formData.get("label") as string;
  const isActive = formData.get("isActive") === "on";

  if (!id || !clabe || !label) {
    return { error: "Todos los campos son requeridos" };
  }

  await db
    .update(depositAccounts)
    .set({ clabe, label, isActive })
    .where(eq(depositAccounts.id, id));

  return null;
}

export async function deleteDepositAccountAction(accountId: string) {
  await db.delete(depositAccounts).where(eq(depositAccounts.id, accountId));
}

export async function getRoomieBySlug(slug: string) {
  return await db.query.roomies.findFirst({
    where: eq(roomies.slug, slug),
  });
}

export async function getPaymentsByRoomie(roomieId: string) {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.roomieId, roomieId))
    .orderBy(desc(payments.date));
}
