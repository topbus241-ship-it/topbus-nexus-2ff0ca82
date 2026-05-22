import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  icon?: LucideIcon;
  tone?: "neutral" | "positive" | "warning" | "danger";
}) {
  const ring =
    tone === "positive"
      ? "ring-success/15"
      : tone === "warning"
        ? "ring-warning/20"
        : tone === "danger"
          ? "ring-destructive/15"
          : "ring-primary/10";

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
        {Icon && (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-secondary ring-4", ring)}>
            <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
          </div>
        )}
      </div>
      <div className="mt-3 text-[26px] font-semibold tracking-tight text-foreground">{value}</div>
      {typeof delta === "number" && (
        <div className="mt-1 text-xs text-muted-foreground">
          <span className={cn("font-medium", delta >= 0 ? "text-success" : "text-destructive")}>
            {delta >= 0 ? "+" : ""}
            {delta}
          </span>{" "}
          vs. mês anterior
        </div>
      )}
    </div>
  );
}
