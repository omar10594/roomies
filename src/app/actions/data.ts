"use server";

import { db } from "@/lib/db";
import { roomies, payments, depositAccounts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateId, toCents } from "@/lib/utils";

function getNextRentDay(today: Date, rentDay: number): Date {
  const year = today.getFullYear();
  const month = today.getMonth();
  let dueDate = new Date(year, month, rentDay);
  if (dueDate <= today) {
    dueDate = new Date(year, month + 1, rentDay);
  }
  return dueDate;
}

function getGraceEnd(dueDate: Date, graceDays: number): Date {
  return new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate() + graceDays);
}

export async function getDashboardData() {
  const allRoomies = await db.query.roomies.findMany();
  const activeRoomies = allRoomies.filter((r) => r.isActive);
  const inactiveRoomies = allRoomies.filter((r) => !r.isActive);

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
    const graceDays = r.graceDays ?? 5;
    const roomiePayments = allPayments.filter((p) => p.roomieId === r.id);
    const totalPaid = roomiePayments.reduce((acc, p) => acc + p.amount, 0);

    // Calculate pendiente: current period rent if past rentDay (regardless of grace)
    let pendiente = 0;
    if (r.startDate) {
      let d = new Date(r.startDate);
      while (true) {
        const dueDate = new Date(d.getFullYear(), d.getMonth(), r.rentDay);
        if (dueDate > today) break;
        const monthPaid = roomiePayments
          .filter((p) => {
            const pd = new Date(p.date);
            return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
          })
          .reduce((sum, p) => sum + p.amount, 0);
        const remaining = Math.max(0, r.rentAmount - monthPaid);
        pendiente += remaining;
        d.setMonth(d.getMonth() + 1);
      }
    }

    // Calculate atrasado: periods where grace period has expired
    let atrasado = 0;
    let hasAtrasado = false;
    if (r.startDate) {
      let d = new Date(r.startDate);
      while (true) {
        const dueDate = new Date(d.getFullYear(), d.getMonth(), r.rentDay);
        if (dueDate > today) break;
        const graceEnd = getGraceEnd(dueDate, graceDays);
        if (graceEnd < today) {
          const monthPaid = roomiePayments
            .filter((p) => {
              const pd = new Date(p.date);
              return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
            })
            .reduce((sum, p) => sum + p.amount, 0);
          const remaining = Math.max(0, r.rentAmount - monthPaid);
          if (remaining > 0) {
            atrasado += remaining;
            hasAtrasado = true;
          }
        }
        d.setMonth(d.getMonth() + 1);
      }
    }

    const isPaid = !hasAtrasado && pendiente === 0;
    const nextPaymentDate = getNextRentDay(today, r.rentDay);

    return {
      ...r,
      isPaid,
      pendiente,
      atrasado,
      hasAtrasado,
      nextPaymentDate,
    };
  });

  const totalExpected = activeRoomies.reduce((acc, r) => {
    const graceDays = r.graceDays ?? 5;
    const roomiePayments = allPayments.filter((p) => p.roomieId === r.id);
    let total = 0;
    if (r.startDate) {
      let d = new Date(r.startDate);
      while (true) {
        const dueDate = new Date(d.getFullYear(), d.getMonth(), r.rentDay);
        if (dueDate > today) break;
        const graceEnd = getGraceEnd(dueDate, graceDays);
        if (graceEnd < today) {
          const monthPaid = roomiePayments
            .filter((p) => {
              const pd = new Date(p.date);
              return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
            })
            .reduce((sum, p) => sum + p.amount, 0);
          total += Math.max(0, r.rentAmount - monthPaid);
        }
        d.setMonth(d.getMonth() + 1);
      }
    }
    return acc + total;
  }, 0);

  const recentPayments = allPayments.slice(0, 10);

  return {
    totalRoomies: allRoomies.length,
    activeRoomies: activeRoomies.length,
    inactiveRoomies: inactiveRoomies.length,
    totalExpected,
    totalCollected,
    totalPending: totalExpected,
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
  const graceDays = parseInt(formData.get("graceDays") as string) || 5;
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
  const graceDays = parseInt(formData.get("graceDays") as string) || 5;
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
