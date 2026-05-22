import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  height = 260,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  height?: number;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card shadow-[var(--shadow-xs)]", className)}>
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className="px-3 pt-4 pb-3" style={{ height }}>
        {children}
      </div>
    </section>
  );
}
