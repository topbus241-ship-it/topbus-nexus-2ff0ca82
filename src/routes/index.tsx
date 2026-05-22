import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { VehicleStatusBadge, StatusBadge } from "@/components/common/StatusBadge";
import {
  getDashboardMetrics,
  getFleetStatus,
  getDamageRecords,
  getServiceRecords,
  getInsights,
  getSectors,
} from "@/lib/api/mockApi";
import { Bus, AlertTriangle, Wrench, FileText, DollarSign, Activity, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const ICON_MAP = {
  active: Bus,
  stopped: Activity,
  damages: AlertTriangle,
  services: Wrench,
  cost: DollarSign,
  docs: FileText,
} as const;

function DashboardPage() {
  const { data: metrics = [] } = useQuery({ queryKey: ["metrics"], queryFn: getDashboardMetrics });
  const { data: fleet = [] } = useQuery({ queryKey: ["fleet"], queryFn: getFleetStatus });
  const { data: damages = [] } = useQuery({ queryKey: ["damages"], queryFn: getDamageRecords });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: getServiceRecords });
  const { data: insights = [] } = useQuery({ queryKey: ["insights"], queryFn: getInsights });
  const { data: sectors = [] } = useQuery({ queryKey: ["sectors"], queryFn: getSectors });

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Visão geral"
        title="Dashboard operacional"
        description="Visão consolidada de frota, manutenção, terceirizados e indicadores do mês."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <StatCard
            key={m.key}
            label={m.label}
            value={m.value}
            delta={m.delta}
            icon={ICON_MAP[m.key as keyof typeof ICON_MAP]}
            tone={m.key === "stopped" || m.key === "damages" ? "danger" : m.key === "cost" ? "warning" : "neutral"}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Veículos parados em destaque</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Prioridade definida pelo setor responsável.</p>
            </div>
            <Link to="/status-frota" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Ver tudo <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {fleet.slice(0, 5).map((f) => (
              <li key={f.vehicleNumber} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xs font-semibold">
                  {f.vehicleNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{f.reason}</div>
                  <div className="text-xs text-muted-foreground">{f.responsibleSector} • desde {f.stoppedAt}</div>
                </div>
                <VehicleStatusBadge status={f.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Insights operacionais</h2>
            <p className="text-xs text-muted-foreground mt-0.5">IA local (Ollama / Mistral) preparada.</p>
          </div>
          <ul className="divide-y divide-border">
            {insights.slice(0, 4).map((i) => (
              <li key={i.id} className="px-5 py-3.5">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-snug">{i.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{i.description}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Avarias pendentes de orçamento</h2>
          </div>
          <ul className="divide-y divide-border">
            {damages.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{d.vehicleNumber} • {d.description}</div>
                  <div className="text-xs text-muted-foreground">{d.driverName} • {d.createdAt}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">R$ {d.totalValue.toFixed(2).replace(".", ",")}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Serviços aguardando conferência</h2>
          </div>
          <ul className="divide-y divide-border">
            {services.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{s.vehicleNumber} • {s.serviceDone}</div>
                  <div className="text-xs text-muted-foreground">{s.providerName} • {s.createdAt}</div>
                </div>
                <StatusBadge label={s.status === "registrado" ? "Registrado" : s.status === "em_andamento" ? "Em andamento" : "Aguardando"} tone={s.status === "registrado" ? "info" : s.status === "em_andamento" ? "warning" : "muted"} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Status geral por setor</h2>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {sectors.slice(0, 6).map((s) => (
            <div key={s.id} className="bg-card px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{s.name}</div>
                <StatusBadge
                  label={s.status === "operacional" ? "Operacional" : s.status === "atencao" ? "Atenção" : "Crítico"}
                  tone={s.status === "operacional" ? "success" : s.status === "atencao" ? "warning" : "danger"}
                />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.moduleCount} módulos • {s.recentRecords} registros recentes</div>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
