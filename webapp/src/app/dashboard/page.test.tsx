import { describe, it, expect } from "vitest";
import { getInitialState } from "@/lib/data";

describe("Dashboard page data computations", () => {
  it("computes correct total expenses", () => {
    const state = getInitialState();
    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    expect(totalExpenses).toBe(2705.49);
  });

  it("computes correct total rent", () => {
    const state = getInitialState();
    const totalRent = state.rentPayments.reduce((sum, p) => sum + p.amount, 0);
    expect(totalRent).toBe(7200);
  });

  it("computes correct chores completion stats", () => {
    const state = getInitialState();
    const completed = state.chores.filter((c) => c.completed).length;
    const total = state.chores.length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    expect(completed).toBe(2);
    expect(total).toBe(5);
    expect(pending).toBe(3);
    expect(progress).toBe(40);
  });

  it("computes correct per-person expense split", () => {
    const state = getInitialState();
    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPerPerson = totalExpenses / state.roommates.length;
    expect(totalPerPerson).toBe(1352.745);
  });

  it("sorts expenses by date descending", () => {
    const state = getInitialState();
    const recent = [...state.expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    // June 18 should be first (most recent)
    expect(recent[0].title).toBe("Cleaning supplies");
  });

  it("filters pending chores", () => {
    const state = getInitialState();
    const upcoming = state.chores.filter((c) => !c.completed);
    expect(upcoming).toHaveLength(3);
  });

  it("renders roommate count correctly", () => {
    const state = getInitialState();
    expect(state.roommates.length).toBe(2);
  });

  it("computes settlement balances", () => {
    const state = getInitialState();
    const balances = state.roommates.map((roommate) => {
      const paid = state.expenses
        .filter((e) => e.paidBy === roommate.id)
        .reduce((sum, e) => sum + e.amount, 0);
      const share = state.expenses.reduce((sum, e) => {
        if (e.splitEvenly) return sum + e.amount * (roommate.sharePercentage / 100);
        return sum;
      }, 0);
      return { id: roommate.id, paid, share, balance: paid - share };
    });
    expect(balances).toHaveLength(2);
    const alex = balances.find((b) => b.id === "r1");
    const sam = balances.find((b) => b.id === "r2");
    expect(alex).toBeDefined();
    expect(sam).toBeDefined();
    // Alex paid: 2400 + 127.5 + 32.99 = 2560.49, Share: 2705.49/2 = 1352.745
    expect(alex!.paid).toBe(2560.49);
    // Sam paid: 85 + 60 = 145, Share: 2705.49/2 = 1352.745
    expect(sam!.paid).toBe(145);
  });
});
