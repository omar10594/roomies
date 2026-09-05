"use client";

import { RoomieLink } from "@/components/admin/roomie-link";

import { useState, useEffect, useRef } from "react";
import { getPayments, recordPaymentAction, updatePaymentAction, deletePaymentAction, getRoomies } from "@/app/actions/data";
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
import { Plus, DollarSign, CheckCircle2, Receipt, Pencil, Trash2, Check, X, ChevronDown } from "lucide-react";

function useSelectRepaint(open: boolean) {
  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!open || !ref.current) return;

    const select = ref.current;
    select.style.contain = "none";
    const frame = requestAnimationFrame(() => {
      select.style.contain = "paint";
    });

    return () => {
      cancelAnimationFrame(frame);
      select.style.contain = "none";
    };
  }, [open]);

  return ref;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Awaited<ReturnType<typeof getPayments>>>([]);
  const [roomies, setRoomies] = useState<Roomie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Awaited<ReturnType<typeof getPayments>>[number] | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const registerRoomieSelectRef = useSelectRepaint(showForm);
  const editRoomieSelectRef = useSelectRepaint(!!editingPayment);

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

  async function handleUpdate(formData: FormData) {
    const result = await updatePaymentAction(null, formData);
    if (result?.success) {
      setSuccess("Pago actualizado correctamente");
      setEditingPayment(null);
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    }
  }

  async function handleDelete(id: string) {
    await deletePaymentAction(id);
    setDeleteConfirm(null);
    await loadData();
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
                    <TableHead className="hidden font-bold text-muted-foreground lg:table-cell">Nota</TableHead>
                    <TableHead className="text-muted-foreground font-bold w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.payment.id}>
                      <TableCell className="font-bold">
                        {p.roomieSlug && p.roomieName ? (
                          <RoomieLink roomie={{ slug: p.roomieSlug, name: p.roomieName }}>
                            {p.roomieName}
                          </RoomieLink>
                        ) : p.roomieName || "Desconocido"}
                      </TableCell>
                      <TableCell className="font-bold text-[#003633]">{formatCurrency(p.payment.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(p.payment.date).toLocaleDateString("es-MX")}</TableCell>
                      <TableCell className="hidden max-w-[200px] truncate text-muted-foreground lg:table-cell">{p.payment.note || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={`Editar pago de ${p.roomieName || "roomie desconocido"}`}
                            onClick={() => setEditingPayment(p)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {deleteConfirm === p.payment.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#047857]"
                                aria-label={`Confirmar eliminación del pago de ${p.roomieName || "roomie desconocido"}`}
                                onClick={() => handleDelete(p.payment.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Cancelar eliminación del pago de ${p.roomieName || "roomie desconocido"}`}
                                onClick={() => setDeleteConfirm(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-[#ba1a1a]"
                              aria-label={`Eliminar pago de ${p.roomieName || "roomie desconocido"}`}
                              onClick={() => setDeleteConfirm(p.payment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
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
              <div className="relative">
                <select
                  ref={registerRoomieSelectRef}
                  id="roomieId"
                  name="roomieId"
                  className="block h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 pr-9 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ring"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>Seleccionar roomie...</option>
                  {roomies.filter(r => r.isActive).map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              </div>
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
                defaultValue="Pago de renta"
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

      {/* Edit Payment Dialog */}
      <Dialog open={!!editingPayment} onOpenChange={(open) => { if (!open) setEditingPayment(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-[#003633]" />
              Editar Pago
            </DialogTitle>
            <DialogDescription>
              Actualiza los datos del pago.
            </DialogDescription>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-4">
            <input type="hidden" name="id" value={editingPayment?.payment.id} />
            <div className="space-y-2">
              <Label htmlFor="edit-roomieId">Roomie</Label>
              <div className="relative">
                <select
                  ref={editRoomieSelectRef}
                  id="edit-roomieId"
                  name="roomieId"
                  className="block h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 pr-9 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ring"
                  defaultValue={editingPayment?.payment.roomieId}
                  required
                >
                  {roomies.filter(r => r.isActive).map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Monto (MXN)</Label>
              <Input
                id="edit-amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={editingPayment ? editingPayment.payment.amount / 100 : ""}
                placeholder="6500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Fecha</Label>
              <Input
                id="edit-date"
                name="date"
                type="date"
                defaultValue={editingPayment?.payment.date}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-note">Nota (opcional)</Label>
              <Input
                id="edit-note"
                name="note"
                defaultValue={editingPayment?.payment.note || ""}
                placeholder="Ej: Pago de renta - Septiembre"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingPayment(null)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
