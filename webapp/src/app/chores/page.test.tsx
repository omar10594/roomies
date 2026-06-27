import { describe, it, expect } from "vitest";
import { getInitialState } from "@/lib/data";

describe("Chores page data computations", () => {
  it("computes correct pending count", () => {
    const state = getInitialState();
    const pending = state.chores.filter((c) => !c.completed).length;
    expect(pending).toBe(3);
  });

  it("computes correct completed count", () => {
    const state = getInitialState();
    const completed = state.chores.filter((c) => c.completed).length;
    expect(completed).toBe(2);
  });

  it("computes correct completion rate", () => {
    const state = getInitialState();
    const completed = state.chores.filter((c) => c.completed).length;
    const total = state.chores.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    expect(rate).toBe(40);
  });

  it("has five total chores", () => {
    const state = getInitialState();
    expect(state.chores).toHaveLength(5);
  });

  it("has chores assigned to each roommate", () => {
    const state = getInitialState();
    const alexChores = state.chores.filter((c) => c.assignedTo === "r1");
    const samChores = state.chores.filter((c) => c.assignedTo === "r2");
    expect(alexChores.length).toBe(3);
    expect(samChores.length).toBe(2);
  });

  it("has mixed frequencies", () => {
    const state = getInitialState();
    const frequencies = new Set(state.chores.map((c) => c.frequency));
    expect(frequencies.has("weekly")).toBe(true);
    expect(frequencies.has("biweekly")).toBe(true);
    expect(frequencies.has("daily")).toBe(true);
  });

  it("computes per-roommate chore stats", () => {
    const state = getInitialState();
    const alexChores = state.chores.filter((c) => c.assignedTo === "r1");
    const alexDone = alexChores.filter((c) => c.completed).length;
    const alexPct = Math.round((alexDone / alexChores.length) * 100);
    expect(alexDone).toBe(1);
    expect(alexPct).toBe(33);
  });

  it("has valid chore structure", () => {
    const state = getInitialState();
    for (const chore of state.chores) {
      expect(chore.id).toBeDefined();
      expect(chore.title).toBeDefined();
      expect(chore.assignedTo).toBeDefined();
      expect(chore.frequency).toBeDefined();
      expect(chore.completed).toBeTypeOf("boolean");
      expect(chore.assignedAt).toBeDefined();
    }
  });
});
