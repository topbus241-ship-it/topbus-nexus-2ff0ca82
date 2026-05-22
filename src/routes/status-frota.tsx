import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { VehicleStatusBadge, StatusBadge } from "@/components/common/StatusBadge";
import { getFleetStatus, getVehicles } from "@/lib/api/mockApi";
import { Bus, Wrench, Clock, AlertTriangle, Activity } from "lucide-react";

export const Route = createFileRoute("/status-frota")({
  component: StatusFrotaPage,
});

function StatusFrotaPage() {
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: getVehicles });
  const { data: fleet = [] } = useQuery({ queryKey: ["fleet"], queryFn: getFleetStatus });

  const active = vehicles.filter((v) => v.status === "ativo").length;
  const stopped = vehicles.filter((v) => v.status === "parado" || v.status === "manutencao" || v.status === "aguardando_peca" || v.status === "aguardando_terceiro").length;
  const inMaint = vehicles.filter((v) => v.status === "manutencao").length;
  const waitingPart = vehicles.filter((v) => v.status === "aguardando_peca").length;

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Manutenção"
        title="Status de Frota"
        description="Acompanhamento de veículos parados, motivos e previsão de liberação."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Ativos" value={active} icon={Bus} tone="positive" />
        <StatCard label="Parados" value={stopped} icon={Activity} tone="danger" />
        <StatCard label="Em manutenção" value={inMaint} icon={Wrench} tone="warning" />
        <StatCard label="Aguardando peça" value={waitingPart} icon={AlertTriangle} tone="warning" />
        <StatCard label="Tempo médio parado" value="4,2 dias" icon={Clock} />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Veículo</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Motivo</th>
                <th className="px-5 py-3 text-left font-medium">Setor</th>
                <th className="px-5 py-3 text-left font-medium">Parada</th>
                <th className="px-5 py-3 text-left font-medium">Previsão</th>
                <th className="px-5 py-3 text-left font-medium">Prioridade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fleet.map((f) => (
                <tr key={f.vehicleNumber} className="hover:bg-secondary/40">
                  <td className="px-5 py-3 font-medium tabular-nums">{f.vehicleNumber}</td>
                  <td className="px-5 py-3"><VehicleStatusBadge status={f.status} /></td>
                  <td className="px-5 py-3">{f.reason}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.responsibleSector}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.stoppedAt}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.expectedRelease}</td>
                  <td className="px-5 py-3">
                    <StatusBadge
                      label={f.priority === "alta" ? "Alta" : f.priority === "media" ? "Média" : "Baixa"}
                      tone={f.priority === "alta" ? "danger" : f.priority === "media" ? "warning" : "muted"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-border">
          {fleet.map((f) => (
            <div key={f.vehicleNumber} className="px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div className="font-semibold tabular-nums">{f.vehicleNumber}</div>
                <VehicleStatusBadge status={f.status} />
              </div>
              <div className="mt-1 text-sm">{f.reason}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Setor: <span className="text-foreground">{f.responsibleSector}</span></div>
                <div>Prioridade: <span className="text-foreground">{f.priority}</span></div>
                <div>Parada: <span className="text-foreground">{f.stoppedAt}</span></div>
                <div>Previsão: <span className="text-foreground">{f.expectedRelease}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
