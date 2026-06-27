import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import ExpensesPage from "@/app/expenses/page";

// Mock fetch for API routes used by ExpensesPage
const MOCK_ROOMMATES = [
  { id: "r1", name: "Alex Johnson", email: "alex@example.com", sharePercentage: 50 },
  { id: "r2", name: "Sam Rivera", email: "sam@example.com", sharePercentage: 50 },
];

const MOCK_EXPENSES = [
  { id: "e1", title: "Monthly rent - June 2026", amount: 2400, category: "rent", paidBy: "r1", date: "2026-06-01", splitEvenly: true },
  { id: "e2", title: "Electric bill", amount: 85, category: "utilities", paidBy: "r2", date: "2026-06-10", splitEvenly: true },
  { id: "e3", title: "Groceries - weekly shop", amount: 127.5, category: "groceries", paidBy: "r1", date: "2026-06-15", splitEvenly: true },
  { id: "e4", title: "Internet bill", amount: 60, category: "internet", paidBy: "r2", date: "2026-06-05", splitEvenly: true },
  { id: "e5", title: "Cleaning supplies", amount: 32.99, category: "cleaning", paidBy: "r1", date: "2026-06-18", splitEvenly: true },
];

const apiRoutes: Record<string, unknown> = {
  "/api/roommates": MOCK_ROOMMATES,
  "/api/expenses": MOCK_EXPENSES,
};

vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
  const url = typeof input === "string" ? input : String(input);
  const pathname = url.split("?")[0];
  const body = apiRoutes[pathname];
  if (body !== undefined) {
    return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
});

describe("ExpensesPage (client component)", () => {
  it("renders the Expenses heading", async () => {
    render(<ExpensesPage />);
    // "Expenses" appears in both nav and page heading, use getAllByText
    const all = await screen.findAllByText(/Expenses/);
    expect(all.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the page description", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("Track shared household expenses and splits.")).toBeInTheDocument();
    });
  });

  it("renders Add Expense button", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("Add Expense")).toBeInTheDocument();
    });
  });

  it("displays total spent", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(document.documentElement.textContent).toContain("2705.49");
    });
  });

  it("displays transaction count", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  it("displays average per expense", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(document.documentElement.textContent).toContain("541.10");
    });
  });

  it("displays member count", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("renders Settlement Balances section", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("Settlement Balances")).toBeInTheDocument();
    });
  });

  it("displays roommate balance details", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
      expect(screen.getByText("Sam Rivera")).toBeInTheDocument();
    });
  });

  it("renders search input", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search expenses...");
      expect(searchInput).toBeInTheDocument();
    });
  });

  it("renders category filter select", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      const selectTrigger = document.querySelector('[data-slot="select-trigger"]');
      expect(selectTrigger).toBeInTheDocument();
    });
  });

  it("renders All Expenses section", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("All Expenses")).toBeInTheDocument();
    });
  });

  it("displays expense categories as badges", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      const allText = document.documentElement.textContent;
      expect(allText).toContain("rent");
      expect(allText).toContain("utilities");
      expect(allText).toContain("groceries");
    });
  });

  it("shows paid and owes amounts for each roommate", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      const allText = document.documentElement.textContent;
      expect(allText).toContain("Paid:");
      expect(allText).toContain("Owes:");
    });
  });
});
