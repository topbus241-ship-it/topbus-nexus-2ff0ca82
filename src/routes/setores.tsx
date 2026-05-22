import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getSectors } from "@/lib/api/mockApi";
import { Layers, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/setores")({
  component: SetoresPage,
});

function SetoresPage() {
  const { data: sectors = [] } = useQuery({ queryKey: ["sectors"], queryFn: getSectors });

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Visão geral"
        title="Setores"
        description="Mapa operacional da empresa por setor, com módulos vinculados e atividade recente."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s) => (
          <div key={s.id} className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Layers className="h-4 w-4 text-primary" strokeWidth={1.75} />
              </div>
              <StatusBadge
                label={s.status === "operacional" ? "Operacional" : s.status === "atencao" ? "Atenção" : "Crítico"}
                tone={s.status === "operacional" ? "success" : s.status === "atencao" ? "warning" : "danger"}
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{s.name}</h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <div>
                <div className="text-foreground text-sm font-semibold tracking-normal normal-case">{s.moduleCount}</div>
                Módulos
              </div>
              <div>
                <div className="text-foreground text-sm font-semibold tracking-normal normal-case">{s.recentRecords}</div>
                Registros recentes
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
