import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AppShell from "@/components/AppShell";

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

describe("AppShell", () => {
  it("renders children", () => {
    render(
      <AppShell>
        <div data-testid="child-content">Hello World</div>
      </AppShell>
    );
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders Sidebar component", () => {
    const { container } = render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );
    // Sidebar renders an aside with md:flex classes
    const aside = container.querySelector("aside");
    expect(aside).toBeInTheDocument();
  });

  it("renders Header component", () => {
    const { container } = render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );
    // Header renders a header element
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("renders main element with children", () => {
    const { container } = render(
      <AppShell>
        <div data-testid="main-child">Content</div>
      </AppShell>
    );
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
  });

  it("has correct outer structure", () => {
    const { container } = render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );
    const outerDiv = container.querySelector("div.min-h-screen");
    expect(outerDiv).toBeInTheDocument();
  });
});
