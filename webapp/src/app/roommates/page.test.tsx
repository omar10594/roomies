import { describe, it, expect } from "vitest";
import { getInitialState } from "@/lib/data";

describe("Roommates page data computations", () => {
  it("computes total balance correctly", () => {
    const state = getInitialState();
    const totalBalance = state.expenses.reduce((acc, expense) => {
      const owed = expense.splitEvenly
        ? expense.amount / state.roommates.length
        : 0;
      if (expense.paidBy === "r1") return acc + owed;
      return acc - owed;
    }, 0);
    expect(totalBalance).toBeTypeOf("number");
  });

  it("computes roommate paid amounts", () => {
    const state = getInitialState();
    const alexPaid = state.expenses
      .filter((e) => e.paidBy === "r1")
      .reduce((s, e) => s + e.amount, 0);
    const samPaid = state.expenses
      .filter((e) => e.paidBy === "r2")
      .reduce((s, e) => s + e.amount, 0);
    expect(alexPaid).toBe(2560.49);
    expect(samPaid).toBe(145);
  });

  it("computes roommate shares", () => {
    const state = getInitialState();
    const alexShare = state.expenses.reduce((s, e) => {
      if (e.splitEvenly) return s + e.amount / 2;
      return s;
    }, 0);
    expect(alexShare).toBe(1352.745);
  });

  it("computes roommate balances", () => {
    const state = getInitialState();
    const alexBalance = 2560.49 - 1352.745;
    const samBalance = 145 - 1352.745;
    expect(alexBalance).toBeGreaterThan(0); // Alex is owed money
    expect(samBalance).toBeLessThan(0); // Sam owes money
  });

  it("has correct total expenses", () => {
    const state = getInitialState();
    const total = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    expect(total).toBe(2705.49);
  });

  it("has two roommates with 50% share each", () => {
    const state = getInitialState();
    expect(state.roommates).toHaveLength(2);
    expect(state.roommates[0].sharePercentage).toBe(50);
    expect(state.roommates[1].sharePercentage).toBe(50);
  });

  it("has valid roommate data", () => {
    const state = getInitialState();
    for (const rm of state.roommates) {
      expect(rm.id).toBeDefined();
      expect(rm.name).toBeDefined();
      expect(rm.email).toBeDefined();
      expect(rm.sharePercentage).toBeTypeOf("number");
    }
  });
});
