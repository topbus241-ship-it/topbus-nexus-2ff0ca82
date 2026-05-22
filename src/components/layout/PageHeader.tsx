import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {breadcrumb && (
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {breadcrumb}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
