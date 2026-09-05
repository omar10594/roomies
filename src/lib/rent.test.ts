import assert from "node:assert/strict";
import test from "node:test";
import { getRentSummary } from "./rent";

const terms = { startDate: "2026-01-01", rentDay: 5, rentAmount: 10000, graceDays: 5 };

test("late and partial payments settle oldest rent first", () => {
  const summary = getRentSummary(terms, [{ amount: 15000 }], new Date(2026, 1, 7));
  assert.deepEqual(summary.periods.map(p => p.fifoPaid), [10000, 5000, 0]);
  assert.equal(summary.pendiente, 5000);
  assert.equal(summary.atrasado, 0);
  assert.equal(summary.pendingPeriods[0].month, 1);
  assert.equal(summary.periods[1].isPartial, true);
});

test("only unpaid rent past its grace period is overdue", () => {
  const summary = getRentSummary(terms, [{ amount: 5000 }], new Date(2026, 1, 7));
  assert.equal(summary.pendiente, 15000);
  assert.equal(summary.atrasado, 5000);
  assert.deepEqual(summary.overduePeriods.map(p => p.month), [0]);
});

test("month-end start dates do not skip February", () => {
  const summary = getRentSummary({ ...terms, startDate: "2026-01-31" }, [], new Date(2026, 2, 12));
  assert.deepEqual(summary.periods.map(p => p.month), [0, 1, 2, 3]);
  assert.equal(summary.pendiente, 30000);
});

test("zero grace days are honored", () => {
  const summary = getRentSummary({ ...terms, graceDays: 0 }, [], new Date(2026, 0, 6));
  assert.equal(summary.atrasado, 10000);
});

test("advance payments do not create negative balances", () => {
  const summary = getRentSummary(terms, [{ amount: 100000 }], new Date(2026, 0, 7));
  assert.equal(summary.pendiente, 0);
  assert.equal(summary.atrasado, 0);
  assert.ok(summary.periods.every(p => p.remaining === 0));
  assert.equal(summary.nextPaymentDate, null);
});

test("missing or invalid start dates do not produce periods", () => {
  for (const startDate of [null, "invalid"]) {
    assert.deepEqual(getRentSummary({ ...terms, startDate }, []).periods, []);
  }
});

test("future rent is not pending and periods cross year boundaries", () => {
  const summary = getRentSummary({ ...terms, startDate: "2025-12-01" }, [{ amount: 10000 }], new Date(2026, 0, 2));
  assert.equal(summary.pendiente, 0);
  assert.equal(summary.nextPaymentDate?.getTime(), new Date(2026, 0, 5).getTime());
  assert.deepEqual(summary.periods.map(p => p.month), [11, 0, 1]);
});
