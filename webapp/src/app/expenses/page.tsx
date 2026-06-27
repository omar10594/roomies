"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Roommate, Expense } from "@/lib/data";

interface Balance {
  id: string;
  name: string;
  paid: number;
  share: number;
  balance: number;
}

interface PageData {
  roommates: Roommate[];
  expenses: Expense[];
  balances: Balance[];
  totalSpent: number;
  avgExpense: number;
}

export default function ExpensesPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const [roommatesRes, expensesRes] = await Promise.all([
          fetch("/api/roommates"),
          fetch("/api/expenses"),
        ]);
        if (!roommatesRes.ok || !expensesRes.ok) return;

        const roommatesData: Roommate[] = await roommatesRes.json();
        const expensesData: Expense[] = await expensesRes.json();

        const totalSpent = expensesData.reduce((sum, e) => sum + e.amount, 0);
        const avgExpense = expensesData.length > 0 ? totalSpent / expensesData.length : 0;

        const balances = roommatesData.map((roommate) => {
          const paid = expensesData
            .filter((e) => e.paidBy === roommate.id)
            .reduce((sum, e) => sum + e.amount, 0);
          const share = expensesData.reduce((sum, e) => {
            if (e.splitEvenly) return sum + e.amount * (roommate.sharePercentage / 100);
            const pct = e.splitPercentages?.[roommate.id] || 0;
            return sum + e.amount * (pct / 100);
          }, 0);
          return {
            id: roommate.id,
            name: roommate.name,
            paid,
            share,
            balance: paid - share,
          };
        });

        setData({ roommates: roommatesData, expenses: expensesData, balances, totalSpent, avgExpense });
      } catch (error) {
        console.error("Failed to fetch expenses data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !data) {
    return (
      <AppShell>
        <div className="p-5 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </AppShell>
    );
  }

  const { roommates, expenses, balances, totalSpent, avgExpense } = data;
  const netOwed = balances.reduce((sum, b) => sum + b.balance, 0);

  const filteredExpenses = expenses
    .filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto p-5 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground mt-1">
              Track shared household expenses and splits.
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-4/20 text-chart-4">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="text-xl font-bold">{expenses.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-2/20 text-chart-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg per Expense</p>
                <p className="text-xl font-bold">${avgExpense.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-5/20 text-chart-5">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-xl font-bold">{roommates.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Settlement Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {balances.map(
                (b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                        {b.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-sm font-medium">{b.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Paid:{" "}
                        <span className="font-medium text-foreground">
                          ${b.paid.toFixed(2)}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Owes:{" "}
                        <span className="font-medium text-foreground">
                          ${b.share.toFixed(2)}
                        </span>
                      </span>
                      <span
                        className={`font-semibold ${
                          b.balance > 0
                            ? "text-chart-2"
                            : b.balance < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }`}
                      >
                        {b.balance > 0
                          ? `+ $${b.balance.toFixed(2)}`
                          : b.balance < 0
                            ? `- $${Math.abs(b.balance).toFixed(2)}`
                            : "Settled"}
                      </span>
                    </div>
                  </div>
                )
              )}
              <div className="rounded-lg bg-muted p-3 text-center text-sm font-medium text-muted-foreground">
                {netOwed.toFixed(2) === "0.00"
                  ? "All balances are even. Perfect!"
                  : `Total outstanding: $${Math.abs(netOwed).toFixed(2)}`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter and search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="internet">Internet</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expense list */}
        <Card>
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
            <CardDescription>
              Recent transactions organized by date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredExpenses.map((expense) => {
                const roommate = roommates.find(
                  (r) => r.id === expense.paidBy
                );
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CategoryBadge category={expense.category} />
                      <div>
                        <p className="text-sm font-medium">
                          {expense.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                          {"\u00b7"}
                          {roommate?.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <p className="text-base font-semibold">
                      ${expense.amount.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
