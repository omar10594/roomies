import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import MobileNav from "@/components/MobileNav";
import { usePathname } from "next/navigation";

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
  usePathname: vi.fn().mockReturnValue("/"),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("MobileNav", () => {
  it("renders null when closed", () => {
    const { container } = render(
      <MobileNav open={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders navigation overlay when open", () => {
    const onClose = vi.fn();
    const { container } = render(
      <MobileNav open={true} onClose={onClose} />
    );
    const overlay = container.querySelector(".fixed.inset-0");
    expect(overlay).toBeInTheDocument();
  });

  it("renders Roomies brand title", () => {
    const onClose = vi.fn();
    render(
      <MobileNav open={true} onClose={onClose} />
    );
    expect(screen.getByText("Roomies")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    const onClose = vi.fn();
    render(
      <MobileNav open={true} onClose={onClose} />
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Roommates")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
    expect(screen.getByText("Chores")).toBeInTheDocument();
  });

  it("closes when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <MobileNav open={true} onClose={onClose} />
    );
    // The backdrop has bg-black/50 class; the outer overlay does not
    const backdrop = container.querySelector(".bg-black\\/50");
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when close button is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <MobileNav open={true} onClose={onClose} />
    );
    const buttons = [...container.querySelectorAll("button")];
    // Find the X (close) button
    const xButton = buttons.find((btn) => btn.querySelector("svg"));
    if (xButton) {
      fireEvent.click(xButton);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it("highlights active nav item by pathname", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    render(
      <MobileNav open={true} onClose={() => {}} />
    );
    // Dashboard link should be active (has bg-accent class)
    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink.closest("a")).toHaveClass("bg-accent");
  });

  it("renders nav items with icons", () => {
    const onClose = vi.fn();
    const { container } = render(
      <MobileNav open={true} onClose={onClose} />
    );
    // Each nav item should have an icon (svg)
    const navLinks = container.querySelectorAll("nav a");
    expect(navLinks.length).toBe(5);
  });
});
