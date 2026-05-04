"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Banknote,
  History,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function RoomieDashboard({
  roomie,
  payments,
  depositAccounts,
}: {
  roomie: any;
  payments: any[];
  depositAccounts: any[];
}) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthPayments = payments.filter((p: any) => {
    const d = new Date(p.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalPaid = monthPayments.reduce((acc: number, p: any) => acc + p.amount, 0);
  const remaining = roomie.rentAmount - totalPaid;
  const isPaid = totalPaid >= roomie.rentAmount;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const paymentDate = new Date(currentYear, currentMonth, roomie.rentDay);
  const daysRemaining = Math.max(0, Math.ceil((paymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const activeAccounts = depositAccounts.filter((a: any) => a.isActive);

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f8faf8]/90 backdrop-blur-md border-b border-[#bfc8c6]/50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#003633] font-bold text-lg hover:opacity-80 transition-opacity">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Roomies</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:block">{roomie.name}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#003633] text-white text-xs">
                {roomie.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#003633] tracking-tight">Hola, {roomie.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aquí tienes un resumen de tu estado actual.
          </p>
        </div>

        {/* Rent Card */}
        <Card className="mb-6 border-0 shadow-lg shadow-[#003633]/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="h-4 w-4 text-[#003633]" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Próximo Pago</span>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-[#003633]">
                {formatCurrency(roomie.rentAmount)}
              </span>
              <span className="text-sm text-muted-foreground">
                Vence el {roomie.rentDay} de {monthNames[currentMonth]}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Balance Actual</span>
                <p className={`text-xl font-bold ${isPaid ? "text-[#047857]" : "text-[#ba1a1a]"}`}>
                  {formatCurrency(Math.max(0, remaining))}
                  {isPaid && <span className="text-xs font-normal text-muted-foreground ml-2">(Sin deuda)</span>}
                </p>
              </div>
              <Badge variant={isPaid ? "success" : "warning"} className="text-xs gap-1">
                {isPaid ? (
                  <><CheckCircle2 className="h-3 w-3 mr-1" />Pagado</>
                ) : (
                  <><Clock className="h-3 w-3 mr-1" />Pendiente</>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="mb-6 bg-[#003633]/5 border-[#003633]/10">
          <CardContent className="p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#003633]/10">
              {isPaid ? (
                <CheckCircle2 className="h-6 w-6 text-[#003633]" />
              ) : (
                <Clock className="h-6 w-6 text-[#003633]" />
              )}
            </div>
            <h3 className="text-lg font-bold text-[#003633]">
              {isPaid ? "Inquilino al Día" : "Pago Pendiente"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isPaid
                ? "Has pagado a tiempo este mes."
                : `Debes ${formatCurrency(remaining)}.`
              }
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 border border-[#bfc8c6]/50">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Días restantes</span>
              <span className="text-xl font-bold text-[#003633]">{daysRemaining}</span>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Accounts & Recent Payments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deposit Accounts */}
          <div>
            <h3 className="text-lg font-bold text-[#003633] mb-3 flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Cuentas para Depósito
            </h3>
            <div className="space-y-3">
              {activeAccounts.map((account: any) => (
                <Card key={account.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#003633]/10">
                        <Banknote className="h-5 w-5 text-[#003633]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#003633] truncate">{account.label}</p>
                        <p className="text-xs font-mono text-muted-foreground truncate">{account.clabe}</p>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => {
                              navigator.clipboard.writeText(account.clabe);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Copiar CLABE</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              ))}
              {activeAccounts.length === 0 && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center text-sm text-muted-foreground">
                    No hay cuentas configuradas.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div>
            <h3 className="text-lg font-bold text-[#003633] mb-3 flex items-center gap-2">
              <History className="h-4 w-4" />
              Historial Reciente
            </h3>
            <Card className="border-0 shadow-sm">
              {payments.length === 0 ? (
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No hay pagos registrados aún.
                </CardContent>
              ) : (
                <div className="divide-y divide-[#bfc8c6]/30">
                  {payments.slice(0, 5).map((payment: any) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 hover:bg-[#f3f4f2]/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5]">
                          <CheckCircle2 className="h-4 w-4 text-[#047857]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Pago de Renta</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#003633]">{formatCurrency(payment.amount)}</p>
                        <Badge variant="success" className="text-[10px]">Pagado</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
