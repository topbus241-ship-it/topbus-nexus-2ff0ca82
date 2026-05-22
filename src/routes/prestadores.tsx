import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getProviders } from "@/lib/api/mockApi";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/prestadores")({
  component: PrestadoresPage,
});

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function PrestadoresPage() {
  const { data: providers = [] } = useQuery({ queryKey: ["providers"], queryFn: getProviders });

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Manutenção"
        title="Prestadores"
        description="Prestadores externos vinculados a serviços terceirizados."
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Novo prestador</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.serviceType}</div>
              </div>
              <StatusBadge label={p.status === "ativo" ? "Ativo" : "Inativo"} tone={p.status === "ativo" ? "success" : "muted"} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Serviços</div>
                <div className="text-base font-semibold tabular-nums">{p.servicesCount}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Acumulado</div>
                <div className="text-base font-semibold tabular-nums">{brl(p.accumulatedValue)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
