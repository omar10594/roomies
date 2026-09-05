import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageLoading({ className }: { readonly className?: string }) {
  return (
    <div
      className={cn("flex min-h-[50vh] items-center justify-center", className)}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        <span>Cargando...</span>
      </div>
    </div>
  );
}
