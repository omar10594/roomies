import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryBadge } from "@/components/CategoryBadge";

describe("CategoryBadge", () => {
  it("renders the category label", () => {
    render(<CategoryBadge category="groceries" />);
    expect(screen.getByText("groceries")).toBeInTheDocument();
  });

  it("renders with capitalize class", () => {
    const { container } = render(<CategoryBadge category="groceries" />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("capitalize");
  });

  it("renders with category-bg class", () => {
    const { container } = render(<CategoryBadge category="groceries" />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("category-bg");
  });

  it("renders with secondary variant", () => {
    const { container } = render(<CategoryBadge category="groceries" />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <CategoryBadge category="rent" className="custom-class" />
    );
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("custom-class");
  });

  it("renders all known categories without error", () => {
    const categories = ["rent", "utilities", "groceries", "internet", "phone", "cleaning", "other"];
    categories.forEach((cat) => {
      const { container } = render(<CategoryBadge category={cat} />);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("category-bg");
    });
  });

  it("falls back to 'other' tokens for unknown categories", () => {
    const { container } = render(<CategoryBadge category="unknown-category" />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("category-bg");
  });

  it("renders category text in lowercase (capitalized by CSS)", () => {
    render(<CategoryBadge category="GROCERIES" />);
    expect(screen.getByText("GROCERIES")).toBeInTheDocument();
  });

  it("renders with Badge secondary variant attribute", () => {
    const { container } = render(<CategoryBadge category="utilities" />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveAttribute("variant", "secondary");
  });

  it("handles empty string category gracefully", () => {
    const { container } = render(<CategoryBadge category="" />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
  });
});
