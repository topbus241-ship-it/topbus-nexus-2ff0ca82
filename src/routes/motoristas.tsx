import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getDrivers } from "@/lib/api/mockApi";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/motoristas")({
  component: MotoristasPage,
});

function MotoristasPage() {
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: getDrivers });

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Operação"
        title="Motoristas"
        description="Cadastro de colaboradores motoristas com status, chapa e última escala."
        actions={<Button size="sm" className="gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Novo motorista</Button>}
      />

      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Nome</th>
              <th className="px-5 py-3 text-left font-medium">Chapa</th>
              <th className="px-5 py-3 text-left font-medium">Cargo</th>
              <th className="px-5 py-3 text-left font-medium">Última escala</th>
              <th className="px-5 py-3 text-left font-medium">Veículo</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {drivers.map((d) => (
              <tr key={d.id} className="hover:bg-secondary/40">
                <td className="px-5 py-3 font-medium">{d.name}</td>
                <td className="px-5 py-3 tabular-nums text-muted-foreground">{d.chapa}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.role}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.lastSchedule ?? "—"}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.vehicleNumber ?? "—"}</td>
                <td className="px-5 py-3">
                  <StatusBadge
                    label={d.status === "ativo" ? "Ativo" : d.status === "afastado" ? "Afastado" : "Férias"}
                    tone={d.status === "ativo" ? "success" : d.status === "afastado" ? "danger" : "info"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid gap-3">
        {drivers.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{d.name}</div>
                <div className="text-xs text-muted-foreground">Chapa {d.chapa} • {d.role}</div>
              </div>
              <StatusBadge
                label={d.status === "ativo" ? "Ativo" : d.status === "afastado" ? "Afastado" : "Férias"}
                tone={d.status === "ativo" ? "success" : d.status === "afastado" ? "danger" : "info"}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Última escala</div>
                <div className="font-medium">{d.lastSchedule ?? "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Veículo</div>
                <div className="font-medium">{d.vehicleNumber ?? "—"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
