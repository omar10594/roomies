import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryTokens: Record<
  string,
  { light: string; dark: string }
> = {
  rent: {
    light: "[--category-bg:var(--chip-match-title-bg)][--category-fg:var(--chip-match-title-fg)][--category-bg-dark:oklch(0.45_0.05_265)][--category-fg-dark:oklch(0.85_0.05_265)]",
    dark: "[--category-bg:oklch(0.45_0.05_265)][--category-fg:oklch(0.85_0.05_265)]",
  },
  utilities: {
    light: "[--category-bg:oklch(0.97_0.02_85)][--category-fg:oklch(0.4_0.08_85)][--category-bg-dark:oklch(0.45_0.10_85)][--category-fg-dark:oklch(0.85_0.12_85)]",
    dark: "[--category-bg:oklch(0.45_0.10_85)][--category-fg:oklch(0.85_0.12_85)]",
  },
  groceries: {
    light: "[--category-bg:oklch(0.94_0.08_145)][--category-fg:oklch(0.35_0.08_145)][--category-bg-dark:oklch(0.38_0.10_145)][--category-fg-dark:oklch(0.80_0.12_145)]",
    dark: "[--category-bg:oklch(0.38_0.10_145)][--category-fg:oklch(0.80_0.12_145)]",
  },
  internet: {
    light: "[--category-bg:oklch(0.95_0.06_290)][--category-fg:oklch(0.35_0.12_290)][--category-bg-dark:oklch(0.40_0.12_290)][--category-fg-dark:oklch(0.88_0.14_290)]",
    dark: "[--category-bg:oklch(0.40_0.12_290)][--category-fg:oklch(0.88_0.14_290)]",
  },
  phone: {
    light: "[--category-bg:oklch(0.96_0.04_200)][--category-fg:oklch(0.35_0.08_200)][--category-bg-dark:oklch(0.38_0.08_200)][--category-fg-dark:oklch(0.82_0.10_200)]",
    dark: "[--category-bg:oklch(0.38_0.08_200)][--category-fg:oklch(0.82_0.10_200)]",
  },
  cleaning: {
    light: "[--category-bg:oklch(0.96_0.04_320)][--category-fg:oklch(0.38_0.08_320)][--category-bg-dark:oklch(0.40_0.08_320)][--category-fg-dark:oklch(0.84_0.10_320)]",
    dark: "[--category-bg:oklch(0.40_0.08_320)][--category-fg:oklch(0.84_0.10_320)]",
  },
  other: {
    light: "[--category-bg:var(--muted)][--category-fg:var(--muted-foreground)][--category-bg-dark:var(--muted)][--category-fg-dark:var(--muted-foreground)]",
    dark: "[--category-bg:var(--muted)][--category-fg:var(--muted-foreground)]",
  },
};

export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const tokens = categoryTokens[category] ?? categoryTokens.other;
  return (
    <Badge
      variant="secondary"
      className={cn(
        "capitalize category-bg",
        tokens.light,
        tokens.dark,
        className
      )}
    >
      {category}
    </Badge>
  );
}
