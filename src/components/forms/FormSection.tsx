import type { ReactNode } from "react";

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-5 rounded-xl border border-border bg-card p-5 md:grid-cols-3 md:p-6">
      <div className="md:col-span-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="md:col-span-2 space-y-4">{children}</div>
    </section>
  );
}
