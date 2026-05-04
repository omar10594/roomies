"use client";

import { useState, useEffect } from "react";
import { getPayments, recordPaymentAction, getRoomies } from "@/app/actions/data";
import { formatCurrency } from "@/lib/utils";
import type { Roomie } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, CreditCard, DollarSign, Calendar, CheckCircle2, XCircle, Receipt } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [roomies, setRoomies] = useState<Roomie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [paymentsData, roomiesData] = await Promise.all([
      getPayments(),
      getRoomies(),
    ]);
    setPayments(paymentsData);
    setRoomies(roomiesData);
    setLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    const result = await recordPaymentAction(null, formData);
    if (result?.success) {
      setSuccess("Pago registrado correctamente");
      setShowForm(false);
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight text-[#003633]">Registro de Pagos</h1>
            <p className="text-[15px] text-muted-foreground mt-1.5">
              Registra y administra los pagos de renta.
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-[#003633] hover:bg-[#003633]/90 rounded-xl h-[44px]">
            <Plus className="h-4 w-4" />
            Registrar Pago
          </Button>
        </div>

        {/* Success message */}
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] text-sm mb-6">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        {/* Payments Table */}
        <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 border-2 border-[#003633] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-bold">No hay pagos registrados</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Usa el botón de arriba para registrar el primer pago.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f3f4f2]/50">
                    <TableHead className="text-muted-foreground font-bold">Roomie</TableHead>
                    <TableHead className="text-muted-foreground font-bold">Monto</TableHead>
                    <TableHead className="text-muted-foreground font-bold">Fecha</TableHead>
                    <TableHead className="text-muted-foreground font-bold hidden md:table-cell">Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.payment.id}>
                      <TableCell className="font-bold">{p.roomieName || "Desconocido"}</TableCell>
                      <TableCell className="font-bold text-[#003633]">{formatCurrency(p.payment.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(p.payment.date).toLocaleDateString("es-MX")}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{p.payment.note || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Register Payment Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#003633]" />
              Registrar Pago
            </DialogTitle>
            <DialogDescription>
              Ingresa los datos del pago realizado.
            </DialogDescription>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomieId">Roomie</Label>
              <Select name="roomieId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar roomie..." />
                </SelectTrigger>
                <SelectContent>
                  {roomies.filter(r => r.isActive).map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto (MXN)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="6500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Nota (opcional)</Label>
              <Input
                id="note"
                name="note"
                placeholder="Ej: Pago de renta - Septiembre"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit">Registrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
