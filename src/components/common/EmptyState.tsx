import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description && <div className="mt-1 text-xs text-muted-foreground max-w-sm">{description}</div>}
      </div>
      {action}
    </div>
  );
}
