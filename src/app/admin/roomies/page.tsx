"use client";

import { useState, useEffect } from "react";
import { getRoomies, createRoomieAction, updateRoomieAction, deleteRoomieAction } from "@/app/actions/data";
import { formatCurrency } from "@/lib/utils";
import type { Roomie } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  UserPlus,
  Key,
  Lock,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

export default function RoomiesPage() {
  const [roomies, setRoomies] = useState<Roomie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoomie, setEditingRoomie] = useState<Roomie | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadRoomies();
  }, []);

  async function loadRoomies() {
    const data = await getRoomies();
    setRoomies(data);
    setLoading(false);
  }

  async function handleCreate(formData: FormData) {
    const result = await createRoomieAction(null, formData);
    if (!result) {
      setShowModal(false);
      await loadRoomies();
    }
  }

  async function handleUpdate(formData: FormData) {
    const result = await updateRoomieAction(null, formData);
    if (!result) {
      setShowModal(false);
      setEditingRoomie(null);
      await loadRoomies();
    }
  }

  async function handleDelete(id: string) {
    await deleteRoomieAction(id);
    setDeleteConfirm(null);
    await loadRoomies();
  }

  const totalRoomies = roomies.length;
  const activeRoomies = roomies.filter(r => r.isActive).length;
  const withCode = roomies.filter(r => r.accessCode).length;

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight text-[#003633]">Gestión de Roomies</h1>
            <p className="text-[15px] text-muted-foreground mt-1.5">
              Administra los residentes y accesos de tu propiedad.
            </p>
          </div>
          <Button onClick={() => { setEditingRoomie(null); setShowModal(true); }} className="gap-2 bg-[#003633] hover:bg-[#003633]/90 rounded-xl h-[44px]">
            <UserPlus className="h-4 w-4" />
            Agregar Roomie
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 border-2 border-[#003633] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary */}
            <div className="space-y-4">
              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-[#003633]" />
                    <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Resumen</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-sm font-bold text-[#003633]">{totalRoomies}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Activos</span>
                      <span className="text-sm font-bold text-[#003633]">{activeRoomies}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Con código</span>
                      <span className="text-sm font-bold text-[#003633]">{withCode}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#003633]/5 border-[#003633]/10">
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-[#003633] mb-2">Información</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Los roomies sin código de acceso pueden ver su página pública sin restricciones.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Roomies List */}
            <div className="lg:col-span-2 space-y-3">
              {roomies.length === 0 ? (
                <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <CardContent className="p-12 text-center">
                    <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-bold">No hay roomies registrados</p>
                    <p className="text-xs text-muted-foreground mt-1">Agrega el primero con el botón de arriba.</p>
                  </CardContent>
                </Card>
              ) : (
                roomies.map((roomie) => (
                  <Card key={roomie.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,54,51,0.08)] transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-11 w-11">
                            <AvatarFallback className="bg-[#003633] text-white text-sm font-bold">
                              {roomie.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{roomie.name}</p>
                            <p className="text-xs text-muted-foreground">/{roomie.slug}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[#003633]">{formatCurrency(roomie.rentAmount)}</p>
                            <p className="text-xs text-muted-foreground">/mes</p>
                          </div>
                          <Badge variant="outline" className="text-xs font-semibold">
                            Día {roomie.rentDay}
                          </Badge>
                          <Badge variant={roomie.accessCode ? "success" : "warning"} className="text-xs gap-1">
                            {roomie.accessCode ? <Key className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                            {roomie.accessCode ? "Configurado" : "Pendiente"}
                          </Badge>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => { setEditingRoomie(roomie); setShowModal(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {deleteConfirm === roomie.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#047857]"
                                  onClick={() => handleDelete(roomie.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
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
                                onClick={() => setDeleteConfirm(roomie.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={(open) => { setShowModal(open); if (!open) setEditingRoomie(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoomie ? "Editar Roomie" : "Agregar Roomie"}
            </DialogTitle>
            <DialogDescription>
              {editingRoomie ? "Actualiza la información del roomie." : "Agrega un nuevo roomie al sistema."}
            </DialogDescription>
          </DialogHeader>
          <form
            action={editingRoomie ? handleUpdate : handleCreate}
            className="space-y-4"
          >
            {editingRoomie && (
              <input type="hidden" name="id" value={editingRoomie.id} />
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre / Apodo</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingRoomie?.name}
                placeholder="Ej: Nubia"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL pública)</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={editingRoomie?.slug}
                placeholder="Ej: nubia"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentAmount">Monto de Renta (MXN)</Label>
                <Input
                  id="rentAmount"
                  name="rentAmount"
                  type="number"
                  step="0.01"
                  defaultValue={editingRoomie ? editingRoomie.rentAmount / 100 : ""}
                  placeholder="6500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentDay">Día de Pago</Label>
                <Input
                  id="rentDay"
                  name="rentDay"
                  type="number"
                  min="1"
                  max="28"
                  defaultValue={editingRoomie?.rentDay}
                  placeholder="5"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessCode">Código de Acceso Personal</Label>
              <Input
                id="accessCode"
                name="accessCode"
                defaultValue={editingRoomie?.accessCode || ""}
                placeholder="Dejar vacío para sin código"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={editingRoomie?.isActive ?? true}
                className="h-4 w-4 rounded border-muted-foreground text-[#003633] focus:ring-[#003633]"
              />
              <Label className="text-sm font-normal">Activo</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingRoomie(null); }}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingRoomie ? "Guardar Cambios" : "Agregar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
