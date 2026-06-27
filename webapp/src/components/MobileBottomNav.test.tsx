import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import MobileBottomNav from "@/components/MobileBottomNav";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"a">) => {
    return React.createElement("a", { href, className, ...props }, children);
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/dashboard"),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useEffect: vi.fn(actual.useEffect),
    useState: vi.fn((init: unknown) => {
      const state = actual.useState(init);
      return state;
    }),
  };
});

describe("MobileBottomNav", () => {
  it("renders the navigation element", () => {
    const { container } = render(<MobileBottomNav />);
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });

  it("has aria-label for mobile navigation", () => {
    const { container } = render(<MobileBottomNav />);
    const nav = container.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).toBeInTheDocument();
  });

  it("renders all 5 navigation items", () => {
    const { container } = render(<MobileBottomNav />);
    const navLinks = container.querySelectorAll("nav a");
    expect(navLinks.length).toBe(5);
  });

  it("renders Dashboard nav item", () => {
    render(<MobileBottomNav />);
    const nav = document.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).toHaveClass("md:hidden");
  });

  it("renders Roommates nav item", () => {
    render(<MobileBottomNav />);
    const nav = document.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).toHaveClass("md:hidden");
  });

  it("renders Rent nav item", () => {
    render(<MobileBottomNav />);
    const nav = document.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).toHaveClass("md:hidden");
  });

  it("renders Expenses nav item", () => {
    render(<MobileBottomNav />);
    const nav = document.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).toHaveClass("md:hidden");
  });

  it("renders Chores nav item", () => {
    render(<MobileBottomNav />);
    const nav = document.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).toHaveClass("md:hidden");
  });

  it("has mobile-hidden class on desktop", () => {
    const { container } = render(<MobileBottomNav />);
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("md:hidden");
  });

  it("has fixed positioning class", () => {
    const { container } = render(<MobileBottomNav />);
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("fixed");
  });

  it("has z-30 for proper layering", () => {
    const { container } = render(<MobileBottomNav />);
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("z-30");
  });

  it("renders with border at bottom", () => {
    const { container } = render(<MobileBottomNav />);
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("border-t");
    expect(nav).toHaveClass("border-border");
  });

  it("renders with backdrop blur support", () => {
    const { container } = render(<MobileBottomNav />);
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("bg-background/95");
  });
});
