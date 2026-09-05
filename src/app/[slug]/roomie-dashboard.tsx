"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Receipt,
  CircleDollarSign,
  AlertTriangle,
} from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { getRentSummary } from "@/lib/rent";
import type { Roomie, Payment, DepositAccount } from "@/lib/db/schema";

export default function RoomieDashboard({
  roomie,
  payments,
  depositAccounts,
}: {
  roomie: Roomie;
  payments: Payment[];
  depositAccounts: DepositAccount[];
}) {
  const today = new Date();
  const now = today.getTime();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const monthNamesShort = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];

  const rentAmount = roomie.rentAmount;
  const {
    periods,
    pendingPeriods,
    overduePeriods: atrasadoPeriods,
    pendiente,
    atrasado,
    nextPaymentDate,
  } = getRentSummary(roomie, payments, today);
  const hasAtrasado = atrasado > 0;
  const periodLabel = (period: (typeof periods)[number]) =>
    `${monthNames[period.month]} ${period.dueDate.getFullYear()}`;

  const daysUntilNext = nextPaymentDate
    ? Math.max(0, Math.ceil((nextPaymentDate.getTime() - now) / (1000 * 60 * 60 * 24)))
    : 0;

  // Full date string for next payment
  const nextPaymentFullDate = nextPaymentDate
    ? `${nextPaymentDate.getDate()} de ${monthNamesShort[nextPaymentDate.getMonth()]} ${nextPaymentDate.getFullYear()}`
    : "";

  const activeAccounts = depositAccounts.filter((a) => a.isActive);

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f8faf8]/90 backdrop-blur-md border-b border-[#bfc8c6]/50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-primary font-bold text-lg">Roomies</span>
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
              {pendingPeriods.map((p) => periodLabel(p)).join(", ")}
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
                {atrasadoPeriods.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{periodLabel(p)}</span>
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
              Estado por periodo
            </h3>
            {periods.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No hay periodos de pago registrados aún.
              </p>
            ) : (
              <div className="space-y-0">
                {periods.map((period, idx) => {
                  let statusBadge: "success" | "warning" | "destructive" | "outline" = "outline";
                  let statusLabel = "Próximo";
                  let statusDot = "bg-muted-foreground";
                  let statusIcon = <CalendarDays className="h-4 w-4" />;

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
                          <span className="text-sm font-semibold">{periodLabel(period)}</span>
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Historial de pagos
            </CardTitle>
            <CardDescription>Pagos recibidos, del más reciente al más antiguo.</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Aún no hay pagos registrados.
              </p>
            ) : (
              <Table aria-label="Historial de pagos">
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Fecha de pago</TableHead>
                    <TableHead scope="col" className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <time dateTime={payment.date}>
                          {new Date(`${payment.date}T00:00:00Z`).toLocaleDateString("es-MX", {
                            day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
                          })}
                        </time>
                      </TableCell>
                      <TableCell className="text-right font-semibold whitespace-nowrap">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              {activeAccounts.map((account) => (
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
                            aria-label={`Copiar CLABE de ${account.label}`}
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
