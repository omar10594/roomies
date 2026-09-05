import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RoomieLink({
  roomie,
  children,
  className,
}: {
  roomie: { slug: string; name: string };
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={`/${encodeURIComponent(roomie.slug)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver página de ${roomie.name} (abre en una nueva pestaña)`}
      title="Abrir vista individual en una nueva pestaña"
      className={cn("rounded-lg hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2", className)}
    >
      {children}
    </Link>
  );
}
