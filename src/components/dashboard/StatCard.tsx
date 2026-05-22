import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "neutral",
  sparkline,
  hint,
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  icon?: LucideIcon;
  tone?: "neutral" | "positive" | "warning" | "danger";
  sparkline?: number[];
  hint?: string;
}) {
  const ring =
    tone === "positive"
      ? "ring-success/15 text-success"
      : tone === "warning"
        ? "ring-warning/20 text-warning-foreground"
        : tone === "danger"
          ? "ring-destructive/15 text-destructive"
          : "ring-primary/10 text-primary";

  const stroke =
    tone === "danger"
      ? "var(--destructive)"
      : tone === "warning"
        ? "var(--warning)"
        : tone === "positive"
          ? "var(--success)"
          : "var(--primary)";

  const data = (sparkline ?? []).map((v, i) => ({ i, v }));
  const positive = (delta ?? 0) >= 0;
  const gradId = `sp-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 hover:border-primary/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-[26px] font-semibold leading-none tracking-tight tabular-nums">
            {value}
          </div>
          {hint && <div className="mt-1.5 text-[11px] text-muted-foreground">{hint}</div>}
        </div>
        {Icon && (
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary ring-4", ring)}>
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
              positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" strokeWidth={2} /> : <ArrowDownRight className="h-3 w-3" strokeWidth={2} />}
            {positive ? "+" : ""}
            {delta}%
          </span>
        ) : (
          <span />
        )}
        {data.length > 0 && (
          <div className="h-9 w-24 opacity-90">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={stroke}
                  strokeWidth={1.75}
                  fill={`url(#${gradId})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
