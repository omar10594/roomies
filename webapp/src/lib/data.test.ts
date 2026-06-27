import { describe, it, expect } from "vitest";
import {
  Roommate,
  Expense,
  RentPayment,
  ChoresTask,
  getInitialState,
  MOCK_ROOMMATES,
  MOCK_EXPENSES,
  MOCK_RENT_PAYMENTS,
  MOCK_CHORES,
} from "@/lib/data";

describe("getInitialState", () => {
  it("returns state with mock data", () => {
    const state = getInitialState();
    expect(state.roommates).toEqual(MOCK_ROOMMATES);
    expect(state.expenses).toEqual(MOCK_EXPENSES);
    expect(state.rentPayments).toEqual(MOCK_RENT_PAYMENTS);
    expect(state.chores).toEqual(MOCK_CHORES);
  });

  it("returns a fresh object each time", () => {
    const s1 = getInitialState();
    const s2 = getInitialState();
    expect(s1).not.toBe(s2);
  });
});

describe("MOCK_ROOMMATES", () => {
  it("has two roommates with equal split", () => {
    expect(MOCK_ROOMMATES).toHaveLength(2);
    expect(MOCK_ROOMMATES[0].sharePercentage).toBe(50);
    expect(MOCK_ROOMMATES[1].sharePercentage).toBe(50);
  });

  it("has valid roommate structure", () => {
    const roommate: Roommate = MOCK_ROOMMATES[0];
    expect(roommate.id).toBeDefined();
    expect(roommate.name).toBeDefined();
    expect(roommate.sharePercentage).toBeTypeOf("number");
  });
});

describe("MOCK_EXPENSES", () => {
  it("has five mock expenses", () => {
    expect(MOCK_EXPENSES).toHaveLength(5);
  });

  it("has valid expense structure", () => {
    const expense: Expense = MOCK_EXPENSES[0];
    expect(expense.id).toBeDefined();
    expect(expense.title).toBeDefined();
    expect(expense.amount).toBeTypeOf("number");
    expect(expense.category).toBeDefined();
    expect(expense.paidBy).toBeDefined();
    expect(expense.date).toBeDefined();
    expect(expense.splitEvenly).toBe(true);
  });

  it("covers multiple expense categories", () => {
    const categories = new Set(MOCK_EXPENSES.map((e) => e.category));
    expect(categories.has("rent")).toBe(true);
    expect(categories.has("utilities")).toBe(true);
    expect(categories.has("groceries")).toBe(true);
  });
});

describe("MOCK_RENT_PAYMENTS", () => {
  it("has three mock rent payments", () => {
    expect(MOCK_RENT_PAYMENTS).toHaveLength(3);
  });

  it("has valid rent payment structure", () => {
    const payment: RentPayment = MOCK_RENT_PAYMENTS[0];
    expect(payment.id).toBeDefined();
    expect(payment.amount).toBeTypeOf("number");
    expect(payment.month).toMatch(/^\d{4}-\d{2}$/);
    expect(payment.paidBy).toBeDefined();
    expect(payment.date).toBeDefined();
  });
});

describe("MOCK_CHORES", () => {
  it("has five mock chores", () => {
    expect(MOCK_CHORES).toHaveLength(5);
  });

  it("has valid chore structure", () => {
    const chore: ChoresTask = MOCK_CHORES[0];
    expect(chore.id).toBeDefined();
    expect(chore.title).toBeDefined();
    expect(chore.assignedTo).toBeDefined();
    expect(chore.frequency).toBeDefined();
    expect(chore.completed).toBeTypeOf("boolean");
    expect(chore.assignedAt).toBeDefined();
  });

  it("has mixed completion states", () => {
    const completed = MOCK_CHORES.filter((c) => c.completed);
    const pending = MOCK_CHORES.filter((c) => !c.completed);
    expect(completed.length).toBeGreaterThan(0);
    expect(pending.length).toBeGreaterThan(0);
  });

  it("has multiple frequencies", () => {
    const frequencies = new Set(MOCK_CHORES.map((c) => c.frequency));
    expect(frequencies.size).toBeGreaterThan(1);
  });
});
