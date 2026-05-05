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
  Copy,
  Banknote,
  ChevronLeft,
  CircleDollarSign,
  AlertTriangle,
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
  const today = new Date();
  const now = today.getTime();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const monthNamesShort = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];

  const graceDays = roomie.graceDays ?? 5;
  const rentAmount = roomie.rentAmount;

  function getGraceEnd(rentDay: number): Date {
    return new Date(today.getFullYear(), today.getMonth(), rentDay + graceDays);
  }

  // Build periods from startDate up to current month (inclusive)
  // Only show periods that have history or are the current month
  function getPaymentPeriods() {
    if (!roomie.startDate) return [];

    const periods: any[] = [];
    let d = new Date(roomie.startDate);

    while (true) {
      const dueDate = new Date(d.getFullYear(), d.getMonth(), roomie.rentDay);
      const graceEnd = new Date(d.getFullYear(), d.getMonth(), roomie.rentDay + graceDays);

      // Stop when we're 2 months in the future
      const futureMonth = currentYear * 12 + currentMonth;
      const periodMonth = d.getFullYear() * 12 + d.getMonth();
      if (periodMonth > futureMonth + 1) break;

      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

      // Get all payments (not filtered by month) for FIFO calculation
      periods.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label,
        dueDate,
        graceEnd,
        isPast: graceEnd < today, // grace period has expired
        isCurrent: d.getMonth() === currentMonth && d.getFullYear() === currentYear,
        isUpcoming: dueDate > today,
      });

      d.setMonth(d.getMonth() + 1);
    }

    // FIFO: payments cover oldest periods first
    // Total paid so far
    const allPaid = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    const totalExpected = periods.length * rentAmount;

    // How many full periods are covered
    const fullPeriodsCovered = Math.floor(allPaid / rentAmount);
    const remainder = allPaid % rentAmount;

    for (let i = 0; i < periods.length; i++) {
      if (i < fullPeriodsCovered) {
        periods[i].fifoPaid = rentAmount;
        periods[i].remaining = 0;
        periods[i].isFullyPaid = true;
        periods[i].isPartial = false;
      } else if (i === fullPeriodsCovered && remainder > 0) {
        periods[i].fifoPaid = remainder;
        periods[i].remaining = rentAmount - remainder;
        periods[i].isFullyPaid = false;
        periods[i].isPartial = true;
      } else {
        periods[i].fifoPaid = 0;
        periods[i].remaining = rentAmount;
        periods[i].isFullyPaid = false;
        periods[i].isPartial = false;
      }
    }

    return periods;
  }

  const periods = getPaymentPeriods();

  // Calculate pendiente: what's due now (past rentDay, including current month)
  // This is the sum of remaining for all periods where rentDay has passed
  let pendiente = 0;
  let pendingPeriods: any[] = [];

  for (const period of periods) {
    if (period.dueDate <= today && !period.isFullyPaid) {
      pendiente += period.remaining;
      pendingPeriods.push(period);
    }
  }

  // Calculate atrasado: periods where grace period has expired AND not fully paid
  let atrasado = 0;
  let hasAtrasado = false;
  const atrasadoPeriods: any[] = [];

  for (const period of periods) {
    if (period.isPast && !period.isFullyPaid) {
      atrasado += period.remaining;
      hasAtrasado = true;
      atrasadoPeriods.push(period);
    }
  }

  // Next payment: first upcoming period
  const nextPeriod = periods.find((p: any) => p.isUpcoming && !p.isFullyPaid);
  const nextPaymentDate = nextPeriod ? nextPeriod.dueDate : null;
  const daysUntilNext = nextPaymentDate
    ? Math.max(0, Math.ceil((nextPaymentDate.getTime() - now) / (1000 * 60 * 60 * 24)))
    : 0;

  // Full date string for next payment
  const nextPaymentFullDate = nextPaymentDate
    ? `${nextPaymentDate.getDate()} de ${monthNamesShort[nextPaymentDate.getMonth()]} ${nextPaymentDate.getFullYear()}`
    : "";

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
            Aquí tienes tu estado de cuenta.
          </p>
        </div>

        {/* MAIN PENDIENTE - Big, prominent card using dashboard style */}
        <div className="mb-6 bg-[#003633] rounded-2xl p-6 shadow-[0_8px_32px_rgb(0,54,51,0.2)]">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-white/60" />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/60">Pendiente de pago</span>
          </div>
          <p className={`text-[36px] font-bold leading-none mb-2 ${pendiente > 0 ? "text-white" : "text-white/90"}`}>
            {formatCurrency(pendiente)}
          </p>
          {pendiente > 0 ? (
            <p className="text-sm text-white/60">
              {pendingPeriods.map((p: any) => p.label).join(", ")}
              {pendingPeriods.length > 0 && (
                <span className="block mt-1">
                  {hasAtrasado
                    ? `${atrasadoPeriods.length} periodo(s) con pago vencido`
                    : "Fecha de pago ya pasó"}
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-white/60">
              Todo al día. {nextPaymentFullDate ? `Próximo pago: ${nextPaymentFullDate}.` : "No hay pagos próximos."}
            </p>
          )}
        </div>

        {/* Atrasado section - only shown if has atraso */}
        {hasAtrasado && (
          <Card className="mb-6 border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border-[#ba1a1a]/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[#ba1a1a]" />
                <span className="text-xs font-bold text-[#ba1a1a] uppercase tracking-wider">Monto atrasado</span>
              </div>
              <p className="text-2xl font-bold text-[#ba1a1a] mb-3">
                {formatCurrency(atrasado)}
              </p>
              <div className="space-y-1">
                {atrasadoPeriods.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{p.label}</span>
                    <span className="font-semibold text-[#ba1a1a]">
                      {formatCurrency(p.remaining)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info section: monthly rent and rent day */}
        <Card className="mb-6 border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-[#003633] mb-3">Información de pago</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Renta mensual</p>
                <p className="text-lg font-bold text-[#003633]">{formatCurrency(rentAmount)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Día de pago</p>
                <p className="text-lg font-bold text-[#003633]">{roomie.rentDay} de cada mes</p>
              </div>
            </div>
            {nextPaymentFullDate && daysUntilNext > 0 && (
              <div className="mt-3 pt-3 border-t border-[#bfc8c6]/30">
                <p className="text-xs text-muted-foreground">
                  Próximo pago: {nextPaymentFullDate} — Faltan {daysUntilNext} días
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Timeline */}
        <Card className="mb-6 border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-[#003633] mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Historial de Pagos
            </h3>
            {periods.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No hay periodos de pago registrados aún.
              </p>
            ) : (
              <div className="space-y-0">
                {periods.map((period: any, idx: number) => {
                  let statusBadge: "success" | "warning" | "destructive" | "outline" = "outline";
                  let statusLabel = "Próximo";
                  let statusDot = "bg-muted-foreground";
                  let statusIcon: any = null;

                  if (period.isFullyPaid) {
                    statusBadge = "success";
                    statusLabel = "Pagado";
                    statusDot = "bg-emerald-500";
                    statusIcon = <CheckCircle2 className="h-4 w-4" />;
                  } else if (period.isPartial) {
                    statusBadge = "warning";
                    statusLabel = "Parcial";
                    statusDot = "bg-amber-500";
                    statusIcon = <CircleDollarSign className="h-4 w-4" />;
                  } else if (period.isPast) {
                    statusBadge = "destructive";
                    statusLabel = "Atrasado";
                    statusDot = "bg-[#ba1a1a]";
                    statusIcon = <AlertTriangle className="h-4 w-4" />;
                  } else if (period.isCurrent) {
                    // Current month, rentDay hasn't passed yet
                    statusBadge = "outline";
                    statusLabel = "Pendiente";
                    statusDot = "bg-muted-foreground";
                    statusIcon = <CalendarDays className="h-4 w-4" />;
                  } else {
                    // Future
                    statusBadge = "outline";
                    statusLabel = "Próximo";
                    statusDot = "bg-muted-foreground";
                    statusIcon = <CalendarDays className="h-4 w-4" />;
                  }

                  return (
                    <div key={idx} className="flex items-center gap-3">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center w-4 shrink-0">
                        <div className={`h-3 w-3 rounded-full ${statusDot} border-2 border-white`} />
                        {idx < periods.length - 1 && (
                          <div className="w-px h-full bg-muted-foreground/20" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{period.label}</span>
                          <span className="text-xs text-muted-foreground">
                            Vence {period.dueDate.getDate()} de {monthNamesShort[period.month]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {period.fifoPaid > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {formatCurrency(period.fifoPaid)}
                              {!period.isFullyPaid && (
                                <span className="text-[#ba1a1a] ml-1">
                                  / {formatCurrency(rentAmount)}
                                </span>
                              )}
                            </span>
                          )}
                          <Badge variant={statusBadge} className="text-[10px] gap-1">
                            {statusIcon}
                            {statusLabel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deposit Accounts - Full Width */}
        <Card className="mb-6 border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-[#003633] mb-4 flex items-center gap-2">
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
