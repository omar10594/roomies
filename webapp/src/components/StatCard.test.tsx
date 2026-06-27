import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "@/components/StatCard";
import { Users } from "lucide-react";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(
      <StatCard label="Roommates" value="2" />
    );
    expect(screen.getByText("Roommates")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <StatCard label="Total Expenses" value="$2400" subtitle="$1200 per person" />
    );
    expect(screen.getByText("$1200 per person")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    const { container } = render(
      <StatCard label="Total Expenses" value="$2400" />
    );
    const subtitle = container.querySelector("p.text-xs");
    expect(subtitle).not.toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <StatCard label="Roommates" value="2" icon={<Users className="h-5 w-5" />} />
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders positive trend", () => {
    render(
      <StatCard
        label="Chores Done"
        value="3/5"
        trend={{ value: "20%", positive: true }}
      />
    );
    expect(screen.getByText("↑ 20%")).toBeInTheDocument();
  });

  it("renders negative trend", () => {
    render(
      <StatCard
        label="Pending Chores"
        value="2"
        trend={{ value: "10%", positive: false }}
      />
    );
    expect(screen.getByText("↓ 10%")).toBeInTheDocument();
  });

  it("does not render trend when omitted", () => {
    const { container } = render(
      <StatCard label="Roommates" value="2" />
    );
    const trendText = container.querySelector("p.text-xs.font-medium");
    expect(trendText).not.toBeInTheDocument();
  });

  it("renders all props together", () => {
    render(
      <StatCard
        label="Total Expenses"
        value="$2400"
        subtitle="$1200 per person"
        icon={<Users className="h-5 w-5" />}
        trend={{ value: "5%", positive: true }}
      />
    );
    expect(screen.getByText("Total Expenses")).toBeInTheDocument();
    expect(screen.getByText("$2400")).toBeInTheDocument();
    expect(screen.getByText("$1200 per person")).toBeInTheDocument();
    expect(screen.getByText("↑ 5%")).toBeInTheDocument();
  });
});
