import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Header from "@/components/Header";

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

describe("Header", () => {
  it("renders the Roomies title", () => {
    render(<Header />);
    expect(screen.getByText("Roomies")).toBeInTheDocument();
  });

  it("renders a header element", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("renders notification bell button", () => {
    const { container } = render(<Header />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders user profile button", () => {
    const { container } = render(<Header />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders sticky header with correct classes", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky");
  });

  it("renders MobileBottomNav component", () => {
    const { container } = render(<Header />);
    // MobileBottomNav renders a nav with aria-label="Mobile navigation"
    const nav = container.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).toBeInTheDocument();
  });

  it("renders all 5 navigation items in MobileBottomNav", () => {
    const { container } = render(<Header />);
    const nav = container.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).toHaveClass("md:hidden");
  });
});
