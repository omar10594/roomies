import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Home,
  Plus,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import type { Roommate, RentPayment } from "@/lib/data";

async function fetchRentData(): Promise<{ roommates: Roommate[]; rentPayments: RentPayment[] }> {
  const [roommatesRes, rentRes] = await Promise.all([
    fetch("/api/roommates", { cache: "no-store" }),
    fetch("/api/rent-payments", { cache: "no-store" }),
  ]);

  const [roommates, rentPayments] = await Promise.all([
    roommatesRes.json(),
    rentRes.json(),
  ]);

  return { roommates, rentPayments };
}

export default async function RentPage() {
  const { roommates, rentPayments } = await fetchRentData();

  const totalRent = rentPayments.reduce((sum, p) => sum + p.amount, 0);
  const uniqueMonths = new Set(rentPayments.map((p) => p.month));
  const monthlyRent = rentPayments[0]?.amount || 0;
  const perPerson = roommates.length > 0 ? monthlyRent / roommates.length : 0;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto p-5 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Rent</h1>
            <p className="text-muted-foreground mt-1">
              Track rent payments and history
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Monthly Rent</CardDescription>
              <CardTitle className="text-3xl">
                ${monthlyRent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Paid</CardDescription>
              <CardTitle className="text-3xl">
                ${totalRent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Payment History</CardDescription>
              <CardTitle className="text-3xl">
                {uniqueMonths.size} mo
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Per Person</CardDescription>
              <CardTitle className="text-3xl">
                ${perPerson.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Rent history table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Rent Payment History</CardTitle>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          </CardHeader>
          <CardContent>
            {rentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Home className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-3 text-sm font-medium">No rent payments recorded</p>
                <p className="mt-1 text-xs text-muted-foreground">Record your first payment to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...rentPayments]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((payment) => {
                  const [year, month] = payment.month.split("-");
                  const monthName = monthNames[parseInt(month) - 1];

                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Home className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {monthName} {year}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Paid {new Date(payment.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                            {"\u00b7"}
                            {roommates.find((r) => r.id === payment.paidBy)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          ${payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
