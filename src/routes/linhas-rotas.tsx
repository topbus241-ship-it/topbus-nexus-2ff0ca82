import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getRoutes } from "@/lib/api/mockApi";
import { Button } from "@/components/ui/button";
import { Plus, Map } from "lucide-react";

export const Route = createFileRoute("/linhas-rotas")({
  component: LinhasRotasPage,
});

function LinhasRotasPage() {
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: getRoutes });

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Operação"
        title="Linhas e Rotas"
        description="Linhas urbanas, rotas atendidas e veículos vinculados."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Nova linha
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {routes.map((r: any) => {
          const vehicles = Array.isArray(r.vehicles) ? r.vehicles : [];
          const line = r.line || r.name || r.id || "Linha não informada";
          const routeName =
            r.name && r.origin && r.destination
              ? `${r.name} • ${r.origin} → ${r.destination}`
              : r.origin && r.destination
                ? `${r.origin} → ${r.destination}`
                : r.name || "Rota operacional em demonstração";

          return (
            <div key={r.id || line} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Map className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Linha
                    </div>
                    <div className="text-base font-semibold tabular-nums">{line}</div>
                  </div>
                </div>

                <StatusBadge
                  label={r.status === "ativa" ? "Ativa" : r.status === "suspensa" ? "Suspensa" : "Em operação"}
                  tone={r.status === "suspensa" ? "danger" : "success"}
                />
              </div>

              <div className="mt-4 text-sm font-medium">{routeName}</div>

              {r.description && (
                <div className="mt-1 text-xs text-muted-foreground">{r.description}</div>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {vehicles.length === 0 && (
                  <div className="text-xs text-muted-foreground">Sem veículos vinculados</div>
                )}

                {vehicles.map((v: string) => (
                  <span
                    key={v}
                    className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-[11px] font-medium tabular-nums"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
