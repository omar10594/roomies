import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Sidebar from "@/components/Sidebar";

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

describe("Sidebar", () => {
  it("renders a sidebar aside element", () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector("aside");
    expect(aside).toBeInTheDocument();
  });

  it("renders Roomies brand name", () => {
    render(<Sidebar />);
    expect(screen.getByText("Roomies")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    render(<Sidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Roommates")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
    expect(screen.getByText("Chores")).toBeInTheDocument();
  });

  it("renders a logo icon", () => {
    const { container } = render(<Sidebar />);
    const logo = container.querySelector(".bg-primary");
    expect(logo).toBeInTheDocument();
  });

  it("highlights active nav item by pathname", () => {
    render(<Sidebar />);
    // usePathname is mocked to return "/dashboard"
    // Dashboard link should be active
    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink.closest("a")).toHaveClass("bg-accent");
  });

  it("renders nav items in a nav element", () => {
    const { container } = render(<Sidebar />);
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });

  it("renders 5 nav links", () => {
    const { container } = render(<Sidebar />);
    const navLinks = container.querySelectorAll("nav a");
    expect(navLinks.length).toBe(5);
  });

  it("marks non-active nav items without bg-accent", () => {
    render(<Sidebar />);
    const roommatesLink = screen.getByText("Roommates");
    expect(roommatesLink.closest("a")).not.toHaveClass("bg-accent");
  });
});
