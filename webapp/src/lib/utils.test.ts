import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges simple class names", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });

  it("handles clsx-style inputs", () => {
    expect(cn("foo", false, "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    expect(cn(isActive ? "bg-blue" : "bg-gray", "text-white")).toBe(
      "bg-blue text-white"
    );
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn(undefined, null, false)).toBe("");
  });

  it("overrides duplicate classes via twMerge", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("preserves Tailwind classes with different modifiers", () => {
    expect(cn("hover:bg-blue", "hover:bg-red")).toBe("hover:bg-red");
  });
});
