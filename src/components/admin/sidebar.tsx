"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, ChevronDown, Building2 } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/roomies", label: "Roomies", icon: Users },
  { href: "/admin/payments", label: "Pagos", icon: CreditCard },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 md:hidden bg-[#f8faf8]/90 backdrop-blur-md border-b border-[#bfc8c6]/50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-[#003633] font-bold text-lg">
            <Building2 className="h-5 w-5" />
            Roomies
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-[#003633] text-white text-xs">A</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-[#bfc8c6]/50">
        <div className="p-5 border-b border-[#bfc8c6]/50">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 text-[#003633]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003633]/10">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">Roomies</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#003633]/10 text-[#003633] shadow-sm"
                    : "text-muted-foreground hover:bg-[#f3f4f2] hover:text-[#191c1c]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#bfc8c6]/50">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-[#ba1a1a]/5 hover:text-[#ba1a1a] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
