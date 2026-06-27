"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  DollarSign,
  Sparkles,
  Home,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roommates", label: "Roommates", icon: Users },
  { href: "/rent", label: "Rent", icon: Home },
  { href: "/expenses", label: "Expenses", icon: DollarSign },
  { href: "/chores", label: "Chores", icon: Sparkles },
];

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 z-50 w-56 border-r bg-card p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Roomies</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
}
