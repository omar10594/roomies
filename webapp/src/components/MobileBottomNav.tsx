"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  Users,
  Home,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roommates", label: "Roommates", icon: Users },
  { href: "/rent", label: "Rent", icon: Home },
  { href: "/expenses", label: "Expenses", icon: DollarSign },
  { href: "/chores", label: "Chores", icon: Sparkles },
];

function isActive(link: string, pathname: string): boolean {
  if (link === "/") return pathname === "/" || pathname === "";
  return pathname.startsWith(link);
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const currentTop = window.scrollY || document.documentElement.scrollTop || 0;
      if (currentTop <= 16) {
        setVisible(true);
      } else if (currentTop > 16) {
        setVisible(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 transition-transform duration-200 ease-out md:hidden",
        "pb-[env(safe-area-inset-bottom)]",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      aria-label="Mobile navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActiveTab = isActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
              "min-h-[48px] min-w-0",
              isActiveTab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={item.label}
            aria-current={isActiveTab ? "page" : undefined}
          >
            {isActiveTab && (
              <span
                className="absolute inset-x-2 top-0 h-[2px] bg-foreground"
                aria-hidden="true"
              />
            )}
            <Icon
              className={cn(
                "h-[22px] w-[22px] shrink-0 transition-[stroke]",
                isActiveTab && "stroke-[2.3]"
              )}
            />
            <span className="truncate text-[10px] font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
