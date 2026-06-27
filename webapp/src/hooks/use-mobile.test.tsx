import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

function TestComponent() {
  const isMobile = useIsMobile();
  return <div data-testid="is-mobile">{String(isMobile)}</div>;
}

describe("useIsMobile", () => {
  it("returns a boolean", () => {
    render(<TestComponent />);
    const el = screen.getByTestId("is-mobile");
    expect(el.textContent).toMatch(/^(true|false)$/);
  });

  it("returns false when window is wide", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => {
        // Wide viewport: mobile breakpoint max-width:767px does NOT match
        const mobileQuery = "(max-width: 767px)";
        return {
          matches: query === mobileQuery ? false : true,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      })
    );
    render(<TestComponent />);
    const el = screen.getByTestId("is-mobile");
    expect(el.textContent).toBe("false");
    vi.unstubAllGlobals();
  });
});
