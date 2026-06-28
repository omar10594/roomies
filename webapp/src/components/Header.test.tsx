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

  it("renders only the header element (no MobileBottomNav)", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    // MobileBottomNav is now rendered in AppShell, not Header
    const nav = container.querySelector('[aria-label="Mobile navigation"]');
    expect(nav).not.toBeInTheDocument();
  });
});
