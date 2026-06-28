"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:pl-56" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <h1 className="text-lg font-semibold flex-1">Roomies</h1>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="User profile">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
