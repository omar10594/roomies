import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  CheckCircle2,
  Home,
  Users,
  AlertCircle,
  ArrowRight,
  CalendarCheck2,
  Receipt,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import type { Roommate, Expense, RentPayment, ChoresTask } from "@/lib/data";

interface DashboardData {
  roommates: Roommate[];
  expenses: Expense[];
  rentPayments: RentPayment[];
  chores: ChoresTask[];
  dashboard: {
    totalExpenses: number;
    totalRent: number;
    uniqueRentMonths: number;
    completedChores: number;
    pendingChores: number;
    choresCompletionRate: number;
    balances: Array<{
      id: string;
      name: string;
      paid: number;
      share: number;
      balance: number;
    }>;
    totalOwed: number;
    totalToReceive: number;
  };
}

async function fetchDashboardData(): Promise<DashboardData> {
  const [roommatesRes, expensesRes, rentRes, choresRes, dashboardRes] =
    await Promise.all([
      fetch("/api/roommates", { cache: "no-store" }),
      fetch("/api/expenses", { cache: "no-store" }),
      fetch("/api/rent-payments", { cache: "no-store" }),
      fetch("/api/chores", { cache: "no-store" }),
      fetch("/api/dashboard", { cache: "no-store" }),
    ]);

  const [roommates, expenses, rentPayments, chores, dashboard] =
    await Promise.all([
      roommatesRes.json(),
      expensesRes.json(),
      rentRes.json(),
      choresRes.json(),
      dashboardRes.json(),
    ]);

  return { roommates, expenses, rentPayments, chores, dashboard };
}

export default async function DashboardPage() {
  const { roommates, expenses, rentPayments, chores, dashboard } =
    await fetchDashboardData();

  const {
    totalExpenses,
    totalRent,
    uniqueRentMonths,
    completedChores,
    pendingChores,
    choresCompletionRate,
    balances,
  } = dashboard;

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const currentMonth = rentPayments.length > 0
    ? rentPayments[0].month
    : "2026-07";

  return (
    <AppShell>
      <div className="p-5 md:p-6 lg:p-8 space-y-6 md:pb-6 pb-[calc(4rem+env(safe-area-inset-bottom))]">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your household finances and chores
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {roommates.length} roommates
            </Badge>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Expenses */}
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                ${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Rent Paid */}
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rent Paid</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                ${totalRent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {uniqueRentMonths} month{uniqueRentMonths !== 1 ? "s" : ""} tracked
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Chores */}
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Chores Progress</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                {completedChores}/{chores.length}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {choresCompletionRate}% completion rate
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Outstanding Balance */}
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Outstanding</CardDescription>
              <CardTitle className={`text-3xl flex items-center gap-2 ${
                dashboard.totalOwed > 0 ? "text-amber-600" : "text-green-600"
              }`}>
                {dashboard.totalOwed > 0 ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                ${dashboard.totalOwed.toFixed(2)}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {dashboard.totalOwed > 0
                  ? "Awaiting settlement"
                  : "All settled up!"}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Two-column layout: balances + recent activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Settlement Balances */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Settlement Balances
                  </CardTitle>
                  <CardDescription>
                    Who owes what
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {balances.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-3 text-sm font-medium">No roommates added yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Add roommates to see settlement balances</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {balances.map((b) => (
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
                      <div className={`text-sm font-semibold ${
                        b.balance > 0
                          ? "text-green-600"
                          : b.balance < 0
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}>
                        {b.balance > 0
                          ? `+ $${b.balance.toFixed(2)}`
                          : b.balance < 0
                          ? `- $${Math.abs(b.balance).toFixed(2)}`
                          : "Settled"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    Recent Expenses
                  </CardTitle>
                  <CardDescription>
                    Latest transactions
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentExpenses.map((expense) => {
                  const roommate = roommates.find((r) => r.id === expense.paidBy);
                  const categoryIcons: Record<string, string> = {
                    rent: "🏠",
                    utilities: "⚡",
                    groceries: "🛒",
                    internet: "🌐",
                    phone: "📱",
                    cleaning: "🧹",
                    other: "📦",
                  };
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{categoryIcons[expense.category] || "📦"}</span>
                        <div>
                          <p className="text-sm font-medium">{expense.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            {" · "}by {roommate?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">${expense.amount.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending chores + rent status */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Chores */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
                    Pending Chores
                  </CardTitle>
                  <CardDescription>
                    {pendingChores} chores remaining
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingChores === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600/50" />
                  <p className="mt-2 text-sm font-medium">All chores completed!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chores
                    .filter((c) => !c.completed)
                    .map((chore) => {
                      const roommate = roommates.find(
                        (r) => r.id === chore.assignedTo
                      );
                      return (
                        <div
                          key={chore.id}
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium">
                              {roommate?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("") || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{chore.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {roommate?.name || "Unassigned"} · {chore.frequency}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rent Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    Rent Overview
                  </CardTitle>
                  <CardDescription>
                    Payment history and status
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...rentPayments]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((payment) => {
                    const [year, month] = payment.month.split("-");
                    const monthNames = [
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December",
                    ];
                    const monthName = monthNames[parseInt(month) - 1];
                    const roommate = roommates.find((r) => r.id === payment.paidBy);
                    return (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Home className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {monthName} {year}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              by {roommate?.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </Badge>
                          <span className="text-sm font-semibold">
                            ${payment.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
