import type { Payment, Roomie } from "./db/schema";

type RentTerms = Pick<Roomie, "startDate" | "rentDay" | "rentAmount" | "graceDays">;

export function getRentSummary(
  roomie: RentTerms,
  payments: Pick<Payment, "amount">[],
  today = new Date(),
) {
  const periods = [];
  const currentMonth = today.getFullYear() * 12 + today.getMonth();
  const [startYear, startMonth] = (roomie.startDate ?? "").split("-").map(Number);
  let available = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Calendar months avoid skipping February when a tenancy starts on the 31st.
  // Keep the existing timeline through next month; payments cover oldest rent first.
  if (startYear && startMonth >= 1 && startMonth <= 12) {
    for (let monthIndex = startYear * 12 + startMonth - 1; monthIndex <= currentMonth + 1; monthIndex++) {
      const year = Math.floor(monthIndex / 12);
      const month = monthIndex % 12;
      const dueDate = new Date(year, month, roomie.rentDay);
      const graceEnd = new Date(year, month, roomie.rentDay + roomie.graceDays);
      const fifoPaid = Math.min(roomie.rentAmount, Math.max(0, available));
      const remaining = roomie.rentAmount - fifoPaid;
      available -= fifoPaid;

      periods.push({
        month,
        dueDate,
        fifoPaid,
        remaining,
        isFullyPaid: remaining === 0,
        isPartial: fifoPaid > 0 && remaining > 0,
        isPast: graceEnd < today,
        isCurrent: monthIndex === currentMonth,
        isUpcoming: dueDate > today,
      });
    }
  }

  const pendingPeriods = periods.filter(p => p.dueDate <= today && !p.isFullyPaid);
  const overduePeriods = pendingPeriods.filter(p => p.isPast);
  return {
    periods,
    pendingPeriods,
    overduePeriods,
    pendiente: pendingPeriods.reduce((sum, p) => sum + p.remaining, 0),
    atrasado: overduePeriods.reduce((sum, p) => sum + p.remaining, 0),
    nextPaymentDate: periods.find(p => p.isUpcoming && !p.isFullyPaid)?.dueDate ?? null,
  };
}
