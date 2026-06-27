import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
}

export default function StatCard({
  label,
  value,
  subtitle,
  icon,
  trend,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <p
            className={`mt-2 text-xs font-medium ${
              trend.positive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
