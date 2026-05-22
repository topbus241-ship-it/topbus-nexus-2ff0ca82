import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/AuthContext";
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
  const { user } = useAuth();
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
        description={`Bem-vindo de volta, ${user?.name ?? "gestor"}. Painel executivo com indicadores-chave, decisões rápidas e navegação discreta.`}
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
        <section className="rounded-[2rem] border border-border bg-card px-6 py-6 shadow-sm shadow-black/5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex rounded-full border border-border bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/90">
                Operação em tempo real
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Resumo de performance</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Visão estratégica da plataforma</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Informações objetivas para o gestor: indicadores principais, ocorrências críticas e prioridade por setor. Interface leve, foco no essencial.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Acesso rápido</p>
                <p className="mt-3 text-sm font-semibold text-foreground">Chat Otimizado</p>
              </div>
              <div className="rounded-3xl border border-border bg-background px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Estratégia</p>
                <p className="mt-3 text-sm font-semibold text-foreground">Insights acionáveis</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Avarias críticas</p>
                  <p className="mt-1 text-xs text-muted-foreground">Registros que precisam ação imediata.</p>
                </div>
                <StatusBadge label="Foco" tone="danger" />
              </div>
              <div className="mt-5 space-y-3">
                {damages.slice(0, 3).map((d) => (
                  <div key={d.id} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-sm font-semibold text-foreground">{d.vehicleNumber} — {d.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{d.driverName} · {d.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Serviços em acompanhamento</p>
                  <p className="mt-1 text-xs text-muted-foreground">Verificação e conferência em andamento.</p>
                </div>
                <StatusBadge label="Monitoramento" tone="warning" />
              </div>
              <div className="mt-5 space-y-3">
                {services.slice(0, 3).map((s) => (
                  <div key={s.id} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-sm font-semibold text-foreground">{s.vehicleNumber} — {s.serviceDone}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.providerName} · {s.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-5">
              <div>
                <p className="text-sm font-semibold text-foreground">Setores em observação</p>
                <p className="mt-1 text-xs text-muted-foreground">Tendência de desempenho por área.</p>
              </div>
              <div className="mt-5 space-y-3">
                {sectors.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{s.moduleCount} módulos</p>
                    </div>
                    <StatusBadge
                      label={s.status === "operacional" ? "Operacional" : s.status === "atencao" ? "Atenção" : "Crítico"}
                      tone={s.status === "operacional" ? "success" : s.status === "atencao" ? "warning" : "danger"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm shadow-black/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Insights</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Tópicos em destaque</h3>
              </div>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">
                IA local pronta
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {insights.slice(0, 4).map((i) => (
                <div key={i.id} className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">{i.title}</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">{i.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm shadow-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Status por setor</p>
                <p className="mt-1 text-xs text-muted-foreground">Visão resumida dos principais setores.</p>
              </div>
              <Link to="/setores" className="text-xs font-semibold text-primary hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="mt-5 grid gap-3">
              {sectors.slice(0, 6).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-3xl border border-border bg-background px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.moduleCount} módulos</p>
                  </div>
                  <StatusBadge
                    label={s.status === "operacional" ? "Operacional" : s.status === "atencao" ? "Atenção" : "Crítico"}
                    tone={s.status === "operacional" ? "success" : s.status === "atencao" ? "warning" : "danger"}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm shadow-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Avarias em destaque</p>
              <p className="mt-1 text-xs text-muted-foreground">Resumo rápido para decisão operacional.</p>
            </div>
            <Link to="/status-frota" className="text-xs font-semibold text-primary hover:underline">
              Ver tudo
            </Link>
          </div>
          <ul className="mt-5 space-y-3">
            {fleet.slice(0, 5).map((f) => (
              <li key={f.vehicleNumber} className="flex flex-col gap-2 rounded-3xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.vehicleNumber}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.reason} · {f.responsibleSector}</p>
                </div>
                <VehicleStatusBadge status={f.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm shadow-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Serviços recentes</p>
              <p className="mt-1 text-xs text-muted-foreground">Controle de ocorrências e conferência.</p>
            </div>
            <Link to="/servico-terceirizado" className="text-xs font-semibold text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="mt-5 space-y-3">
            {services.slice(0, 5).map((s) => (
              <li key={s.id} className="flex flex-col gap-2 rounded-3xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.vehicleNumber}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.serviceDone} · {s.providerName}</p>
                </div>
                <StatusBadge label={s.status === "registrado" ? "Registrado" : s.status === "em_andamento" ? "Em andamento" : "Aguardando"} tone={s.status === "registrado" ? "info" : s.status === "em_andamento" ? "warning" : "muted"} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
