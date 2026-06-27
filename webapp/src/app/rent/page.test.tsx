import { describe, it, expect } from "vitest";
import { getInitialState } from "@/lib/data";

describe("Rent page data computations", () => {
  it("computes total rent paid", () => {
    const state = getInitialState();
    const totalRent = state.rentPayments.reduce((sum, p) => sum + p.amount, 0);
    expect(totalRent).toBe(7200);
  });

  it("has correct monthly rent amount", () => {
    const state = getInitialState();
    expect(state.rentPayments[0].amount).toBe(2400);
  });

  it("tracks correct number of unique months", () => {
    const state = getInitialState();
    const uniqueMonths = new Set(state.rentPayments.map((p) => p.month));
    expect(uniqueMonths.size).toBe(3);
  });

  it("computes per-person rent", () => {
    const state = getInitialState();
    const perPerson = state.rentPayments[0].amount / state.roommates.length;
    expect(perPerson).toBe(1200);
  });

  it("has three rent payments", () => {
    const state = getInitialState();
    expect(state.rentPayments).toHaveLength(3);
  });

  it("has payments from both roommates", () => {
    const state = getInitialState();
    const payers = new Set(state.rentPayments.map((p) => p.paidBy));
    expect(payers.has("r1")).toBe(true);
    expect(payers.has("r2")).toBe(true);
  });

  it("sorts rent payments by date descending", () => {
    const state = getInitialState();
    const sorted = [...state.rentPayments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // Most recent first
    expect(sorted[0].month).toBe("2026-06");
  });

  it("has valid payment structure", () => {
    const state = getInitialState();
    for (const p of state.rentPayments) {
      expect(p.id).toBeDefined();
      expect(p.amount).toBeTypeOf("number");
      expect(p.month).toMatch(/^\d{4}-\d{2}$/);
      expect(p.paidBy).toBeDefined();
      expect(p.date).toBeDefined();
    }
  });
});
