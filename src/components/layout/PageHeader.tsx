import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  breadcrumbs,
  actions,
  meta,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  const crumbs: BreadcrumbItem[] = breadcrumbs ?? (breadcrumb ? [{ label: breadcrumb }] : []);

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {crumbs.length > 0 && (
          <nav className="mb-2 flex flex-wrap items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">TopBus</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 opacity-60" strokeWidth={1.75} />
                {c.to ? (
                  <Link to={c.to} className="hover:text-foreground transition-colors">{c.label}</Link>
                ) : (
                  <span className="text-foreground/80">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>}
        {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
