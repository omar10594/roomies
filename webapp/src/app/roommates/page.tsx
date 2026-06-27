import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import type { Roommate, Expense } from "@/lib/data";

async function fetchRoommatesPageData(): Promise<{ roommates: Roommate[]; expenses: Expense[] }> {
  const [roommatesRes, expensesRes] = await Promise.all([
    fetch("/api/roommates", { cache: "no-store" }),
    fetch("/api/expenses", { cache: "no-store" }),
  ]);

  const [roommates, expenses] = await Promise.all([
    roommatesRes.json(),
    expensesRes.json(),
  ]);

  return { roommates, expenses };
}

export default async function RoommatesPage() {
  const { roommates, expenses } = await fetchRoommatesPageData();

  const totalBalance = expenses.reduce((acc, expense) => {
    const owed = expense.splitEvenly
      ? expense.amount / roommates.length
      : (expense.splitPercentages?.[expense.paidBy] || 0) - expense.amount;
    if (expense.paidBy === "r1") return acc + owed;
    return acc - owed;
  }, 0);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto p-5 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Roommates</h1>
            <p className="text-muted-foreground mt-1">
              Manage household members and cost sharing
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Roommate
          </Button>
        </div>

        {/* Balance overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total roommates</CardDescription>
              <CardTitle className="text-3xl">
                {roommates.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Household balance</CardDescription>
              <CardTitle
                className={`text-3xl ${
                  totalBalance > 0 ? "text-chart-2" : "text-destructive"
                }`}
              >
                ${Math.abs(totalBalance).toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total expenses</CardDescription>
              <CardTitle className="text-3xl">
                $
                {expenses
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Roommate list */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Your Roommates
                </CardTitle>
                <CardDescription>
                  Manage household members and cost sharing
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roommates.map((roommate) => {
                const roommateExpenses = expenses.filter(
                  (e) => e.paidBy === roommate.id
                );
                const totalPaid = roommateExpenses.reduce(
                  (s, e) => s + e.amount,
                  0
                );
                const share = roommateExpenses.reduce((s, e) => {
                  if (e.splitEvenly) return s + e.amount / 2;
                  return s;
                }, 0);
                const balance = totalPaid - share;

                return (
                  <div
                    key={roommate.id}
                    className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent/30 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
                        {roommate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-medium truncate">
                          {roommate.name}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {roommate.sharePercentage}%
                        </Badge>
                      </div>
                      {roommate.email && (
                        <p className="text-sm text-muted-foreground">
                          {roommate.email}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Paid $
                        {totalPaid.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                        · Owes ${share.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`flex items-center gap-1 text-sm font-semibold ${
                          balance > 0
                            ? "text-chart-2"
                            : balance < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }`}
                      >
                        {balance > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        ${Math.abs(balance).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {balance > 0 ? "is owed" : "owes"}
                      </p>
                    </div>
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
