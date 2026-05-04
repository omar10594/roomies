"use client";

import { useState, useEffect } from "react";
import { changeAdminCodeAction } from "@/app/actions/auth";
import { getDepositAccounts, createDepositAccountAction, updateDepositAccountAction, deleteDepositAccountAction } from "@/app/actions/data";
import type { DepositAccount } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Settings,
  KeyRound,
  Banknote,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<DepositAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<DepositAccount | null>(null);
  const [codeStatus, setCodeStatus] = useState<"idle" | "success" | "error">("idle");
  const [codeMessage, setCodeMessage] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    const data = await getDepositAccounts();
    setAccounts(data);
    setLoading(false);
  }

  async function handleAdminCode(formData: FormData) {
    const result = await changeAdminCodeAction(null, formData);
    if (result?.success) {
      setCodeStatus("success");
      setCodeMessage("Código actualizado correctamente");
    } else {
      setCodeStatus("error");
      setCodeMessage(result?.error || "Error al actualizar");
    }
    setTimeout(() => setCodeStatus("idle"), 3000);
  }

  async function handleCreateAccount(formData: FormData) {
    const result = await createDepositAccountAction(null, formData);
    if (!result) {
      setShowAccountModal(false);
      await loadAccounts();
    }
  }

  async function handleUpdateAccount(formData: FormData) {
    const result = await updateDepositAccountAction(null, formData);
    if (!result) {
      setShowAccountModal(false);
      setEditingAccount(null);
      await loadAccounts();
    }
  }

  async function handleDeleteAccount(id: string) {
    await deleteDepositAccountAction(id);
    await loadAccounts();
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-[#003633]">Configuración</h1>
          <p className="text-[15px] text-muted-foreground mt-1.5">
            Administra tu código de acceso y cuentas de depósito.
          </p>
        </div>

        {/* Admin Code */}
        <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="h-4 w-4 text-[#003633]" />
              <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Código de Acceso del Admin</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-5">
              Este código es necesario para acceder al panel administrativo. Debe tener entre 4 y 6 dígitos.
            </p>
            <form action={handleAdminCode} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="newCode">Nuevo Código</Label>
                <Input
                  id="newCode"
                  name="newCode"
                  type="password"
                  placeholder="Ingresa un código de 4-6 dígitos"
                  pattern="[0-9]{4,6}"
                  className="font-mono"
                  required
                />
              </div>
              <Button type="submit" className="h-[42px] bg-[#003633] hover:bg-[#003633]/90">
                Actualizar
              </Button>
            </form>
            {codeStatus === "success" && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#047857] bg-[#ecfdf5] p-3 rounded-xl">
                <CheckCircle2 className="h-4 w-4" />
                {codeMessage}
              </div>
            )}
            {codeStatus === "error" && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#ba1a1a] bg-[#ffdad6]/50 p-3 rounded-xl">
                <XCircle className="h-4 w-4" />
                {codeMessage}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deposit Accounts */}
        <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-[#003633]" />
                <div>
                  <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Cuentas de Depósito</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Estas cuentas se muestran en las páginas públicas de los roomies.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setEditingAccount(null);
                  setShowAccountModal(true);
                }}
                className="gap-1 bg-[#003633] hover:bg-[#003633]/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 border-2 border-[#003633] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No hay cuentas de depósito configuradas.
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#f3f4f2]/50 border border-[#bfc8c6]/30 hover:bg-[#f3f4f2]/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#003633]/10 text-[#003633] text-sm font-bold">
                          {account.label.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{account.label}</p>
                        <p className="text-xs font-mono text-muted-foreground truncate">{account.clabe}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                navigator.clipboard.writeText(account.clabe.replace(/\s/g, ""));
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingAccount(account);
                          setShowAccountModal(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-[#ba1a1a]"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Modal */}
        <Dialog open={showAccountModal} onOpenChange={(open) => { setShowAccountModal(open); if (!open) setEditingAccount(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-[#003633]" />
                {editingAccount ? "Editar Cuenta" : "Agregar Cuenta"}
              </DialogTitle>
              <DialogDescription>
                {editingAccount ? "Actualiza los datos de la cuenta." : "Agrega una nueva cuenta CLABE para depósitos."}
              </DialogDescription>
            </DialogHeader>
            <form
              action={editingAccount ? handleUpdateAccount : handleCreateAccount}
              className="space-y-4"
            >
              {editingAccount && (
                <input type="hidden" name="id" value={editingAccount.id} />
              )}
              <div className="space-y-2">
                <Label htmlFor="label">Nombre visible</Label>
                <Input
                  id="label"
                  name="label"
                  defaultValue={editingAccount?.label}
                  placeholder="Ej: BBVA - Renta Casa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clabe">CLABE</Label>
                <Input
                  id="clabe"
                  name="clabe"
                  defaultValue={editingAccount?.clabe}
                  placeholder="0121 8000 1234 5678 90"
                  className="font-mono"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setShowAccountModal(false); setEditingAccount(null); }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingAccount ? "Guardar" : "Agregar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
