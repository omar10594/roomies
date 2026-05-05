import { getDashboardData } from "@/app/actions/data";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Users,
  CreditCard,
  DollarSign,
  Clock,
  ArrowUpRight,
  Plus,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const currentMonth = new Date().toLocaleString("es-MX", { month: "long" });
  const currentYear = new Date().getFullYear();
  const collectionPercent = data.totalExpected > 0
    ? Math.round((data.totalCollected / data.totalExpected) * 100)
    : 0;

  const avatarColors = [
    "bg-[#003633] text-white",
    "bg-[#4648d4] text-white",
    "bg-[#059669] text-white",
    "bg-[#b45309] text-white",
    "bg-[#7c3aed] text-white",
  ];

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] md:text-[36px] font-bold tracking-tight text-[#003633]">Panel Administrativo</h1>
          <p className="text-[15px] text-muted-foreground mt-1.5">
            Estado de tu departamento hoy.
          </p>
        </div>

        {/* Financial Summary - Hero Card with Teal Background */}
        <div className="mb-8">
          <div className="bg-[#003633] rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgb(0,54,51,0.2)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <rect width="3" height="12" x="2" y="12" rx="1"/>
                    <rect width="3" height="8" x="7" y="8" rx="1"/>
                    <rect width="3" height="14" x="12" y="6" rx="1"/>
                    <rect width="3" height="6" x="17" y="14" rx="1"/>
                  </svg>
                </div>
                <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/60">Resumen Financiero</h3>
              </div>
              <span className="text-[13px] text-white/50 font-medium">
                {currentMonth} {currentYear}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-[11px] font-bold text-emerald-300 mb-2 uppercase tracking-wider">Total Cobrado</p>
                <p className="text-[32px] font-bold text-white leading-none">{formatCurrency(data.totalCollected)}</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3">
                  <div
                    className="bg-emerald-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${collectionPercent}%` }}
                  />
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-[11px] font-bold text-amber-300 mb-2 uppercase tracking-wider">Por Cobrar</p>
                <p className="text-[32px] font-bold text-white leading-none">{formatCurrency(data.totalPending)}</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${100 - collectionPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-white/60">
                  Progreso de cobro:
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[15px] font-bold text-white">{collectionPercent}%</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-white/50">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {data.activeRoomies} inquilinos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">Roomies Activos</p>
                <p className="text-[40px] font-bold text-[#003633] leading-none">{data.activeRoomies}</p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-[#003633]/10">
                <Users className="h-6 w-6 text-[#003633]" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">Pagos Pendientes</p>
                <p className="text-[40px] font-bold text-[#ba1a1a] leading-none">
                  {data.roomieStatuses.filter(r => !r.isPaid).length}
                </p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-[#ba1a1a]/10">
                <Clock className="h-6 w-6 text-[#ba1a1a]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roomies & Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Roomies */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003633]/10">
                    <Users className="h-4 w-4 text-[#003633]" />
                  </div>
                  <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Roomies Activos</h3>
                </div>
                <Link href="/admin/roomies" className="text-[13px] text-[#003633] hover:underline flex items-center gap-1 font-semibold">
                  Ver todos
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {data.roomieStatuses.slice(0, 5).map((roomie: any, idx: number) => (
                  <div key={roomie.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className={`${avatarColors[idx % avatarColors.length]} text-sm font-bold`}>
                          {roomie.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[15px] font-bold">{roomie.name}</p>
                        <p className="text-[13px] text-muted-foreground">
                          {roomie.hasAtrasado
                            ? `Atrasado: ${formatCurrency(roomie.atrasado)}`
                            : roomie.pendiente > 0
                              ? `Pendiente: ${formatCurrency(roomie.pendiente)}`
                              : `/${roomie.slug}`}
                        </p>
                      </div>
                    </div>
                    <Badge variant={roomie.isPaid ? "success" : "destructive"} className="text-xs gap-1">
                      {roomie.isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {roomie.isPaid ? "Pagado" : "Atrasado"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003633]/10">
                  <CreditCard className="h-4 w-4 text-[#003633]" />
                </div>
                <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Pagos Recientes</h3>
              </div>
              {data.recentPayments.length === 0 ? (
                <div className="text-center py-10 text-[14px] text-muted-foreground">
                  No hay pagos registrados aún.
                </div>
              ) : (
                <div className="space-y-4">
                  {data.recentPayments.slice(0, 5).map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#003633]/10">
                          <DollarSign className="h-5 w-5 text-[#003633]" />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold">{formatCurrency(payment.amount)}</p>
                          <p className="text-[13px] text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString("es-MX")}
                          </p>
                        </div>
                      </div>
                      {payment.note && (
                        <p className="text-[13px] text-muted-foreground max-w-[120px] truncate">{payment.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAB */}
      <Link href="/admin/payments" className="fixed right-5 bottom-5 md:right-6 md:bottom-6 z-50">
        <Button className="h-14 w-14 rounded-full shadow-lg shadow-[#003633]/20 bg-[#003633] hover:bg-[#003633]/90" size="icon">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
