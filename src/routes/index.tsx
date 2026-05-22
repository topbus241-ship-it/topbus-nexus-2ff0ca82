import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { VehicleStatusBadge, StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getAnalytics,
  getDamageRecords,
  getDashboardMetrics,
  getFleetStatus,
  getInsights,
  getSectors,
  getServiceRecords,
} from "@/lib/api/mockApi";
import type { FleetStatus, Sector, DamageRecord, ServiceRecord } from "@/lib/types";
import {
  Activity,
  AlertTriangle,
  Bus,
  ChevronDown,
  DollarSign,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
  Wrench,
} from "lucide-react";

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

const TONE_MAP: Record<string, "neutral" | "positive" | "warning" | "danger"> = {
  active: "positive",
  stopped: "danger",
  damages: "danger",
  services: "neutral",
  cost: "warning",
  docs: "neutral",
};

const PIE_COLORS = [
  "var(--success)",
  "var(--warning)",
  "var(--chart-4)",
  "var(--info)",
  "var(--muted-foreground)",
];

const TOOLTIP_STYLE = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  boxShadow: "var(--shadow-md)",
} as const;

function DashboardPage() {
  const { data: metrics = [] } = useQuery({ queryKey: ["metrics"], queryFn: getDashboardMetrics });
  const { data: fleet = [] } = useQuery({ queryKey: ["fleet"], queryFn: getFleetStatus });
  const { data: damages = [] } = useQuery({ queryKey: ["damages"], queryFn: getDamageRecords });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: getServiceRecords });
  const { data: insights = [] } = useQuery({ queryKey: ["insights"], queryFn: getInsights });
  const { data: sectors = [] } = useQuery({ queryKey: ["sectors"], queryFn: getSectors });
  const { data: analytics } = useQuery({ queryKey: ["analytics"], queryFn: getAnalytics });

  return (
    <AppLayout>
      <PageHeader
        breadcrumbs={[{ label: "Visão geral" }, { label: "Dashboard executivo" }]}
        title="Dashboard executivo"
        description="Painel BI consolidado: frota, manutenção, terceirizados, custos e copiloto IA."
        meta={
          <>
            <StatusBadge label="Operação estável" tone="success" />
            <span className="text-[11px] text-muted-foreground">Última sincronização há 2 min</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} /> Atualizar
            </Button>
            <Button size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} /> Exportar
            </Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <StatCard
            key={m.key}
            label={m.label}
            value={m.value}
            delta={m.delta}
            icon={ICON_MAP[m.key as keyof typeof ICON_MAP]}
            tone={TONE_MAP[m.key] ?? "neutral"}
            sparkline={analytics?.sparklines[m.key]}
          />
        ))}
      </div>

      {/* BI tabs */}
      <div className="mt-7">
        <Tabs defaultValue="overview">
          <TabsList className="bg-secondary/60">
            <TabsTrigger value="overview">Visão geral</TabsTrigger>
            <TabsTrigger value="operation">Operação</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
            <TabsTrigger value="insights">Insights IA</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-5 space-y-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <ChartCard
                title="Evolução da frota"
                description="Ativos, parados e avarias por mês"
                className="lg:col-span-2"
                action={<StatusBadge label="6 meses" tone="info" />}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.fleetMonthly ?? []} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
                    <defs>
                      <linearGradient id="g-ativos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.32} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g-parados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                    <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={32} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="ativos" stroke="var(--chart-1)" fill="url(#g-ativos)" strokeWidth={2} />
                    <Area type="monotone" dataKey="parados" stroke="var(--destructive)" fill="url(#g-parados)" strokeWidth={2} />
                    <Area type="monotone" dataKey="avarias" stroke="var(--warning)" fill="transparent" strokeWidth={2} strokeDasharray="4 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Distribuição de status" description="Composição atual da frota">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.fleetDistribution ?? []}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      stroke="var(--card)"
                    >
                      {(analytics?.fleetDistribution ?? []).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="mt-1 grid grid-cols-2 gap-y-1.5 px-3 text-[11px]">
                  {(analytics?.fleetDistribution ?? []).map((d, i) => (
                    <li key={d.name} className="flex items-center gap-1.5 text-muted-foreground">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="truncate">{d.name}</span>
                      <span className="ml-auto font-medium tabular-nums text-foreground">{d.value}</span>
                    </li>
                  ))}
                </ul>
              </ChartCard>
            </div>

            <FleetHighlights fleet={fleet} />
          </TabsContent>

          <TabsContent value="operation" className="mt-5 space-y-5">
            <ChartCard
              title="Timeline operacional do dia"
              description="Saídas e retornos por janela de horário"
              height={280}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.operationalTimeline ?? []} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={28} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="saidas" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={26} />
                  <Bar dataKey="retornos" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <SectorsGrid sectors={sectors} />
          </TabsContent>

          <TabsContent value="finance" className="mt-5 space-y-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <ChartCard
                title="Custo por categoria"
                description="Distribuição de gastos terceirizados"
                className="lg:col-span-2"
                height={300}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics?.costBreakdown ?? []}
                    layout="vertical"
                    margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                  >
                    <CartesianGrid stroke="var(--border)" horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" width={90} />
                    <Tooltip
                      formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`}
                      contentStyle={TOOLTIP_STYLE}
                    />
                    <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 6, 6, 0]} maxBarSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-xs)]">
                <h3 className="text-sm font-semibold tracking-tight">Resumo financeiro</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Visão consolidada do período</p>
                <dl className="mt-4 space-y-3.5 text-sm">
                  <Row label="Custo total terceiros" value="R$ 18.420,00" tone="warning" />
                  <Row label="Avarias quitadas" value="R$ 11.640,00" tone="success" />
                  <Row label="Pendente aprovação" value="R$ 3.250,00" tone="muted" />
                  <Row label="Economia vs. orçado" value="-4,2%" tone="success" />
                </dl>
              </div>
            </div>

            <DamagesAndServices damages={damages} services={services} />
          </TabsContent>

          <TabsContent value="insights" className="mt-5">
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((i) => (
                <article
                  key={i.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-xs)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 ring-4 ring-primary/5">
                      <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold">{i.title}</h4>
                        <StatusBadge
                          label={i.severity === "critico" ? "Crítico" : i.severity === "alerta" ? "Alerta" : "Info"}
                          tone={i.severity === "critico" ? "danger" : i.severity === "alerta" ? "warning" : "info"}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{i.description}</p>
                      <div className="mt-2.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
                        {i.category}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "muted" }) {
  const dotClass = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-muted-foreground/40";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
        {label}
      </div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function FleetHighlights({ fleet }: { fleet: FleetStatus[] }) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)]">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold">Veículos críticos</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Expansão progressiva — clique para detalhes completos.
          </p>
        </div>
        <Link to="/status-frota" className="text-xs text-primary hover:underline">
          Ver tudo
        </Link>
      </header>
      <ul className="divide-y divide-border">
        {fleet.slice(0, 5).map((f) => (
          <ExpandableFleetRow key={f.vehicleNumber} fleet={f} />
        ))}
      </ul>
    </section>
  );
}

function ExpandableFleetRow({ fleet: f }: { fleet: FleetStatus }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex w-full items-center gap-4 px-5 py-3.5 text-left hover:bg-muted/40 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xs font-semibold tabular-nums">
            {f.vehicleNumber}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{f.reason}</div>
            <div className="text-xs text-muted-foreground">
              {f.responsibleSector} • desde {f.stoppedAt}
            </div>
          </div>
          <VehicleStatusBadge status={f.status} />
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            strokeWidth={1.75}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-5 pb-4 pt-1 bg-muted/30">
          <dl className="grid gap-3 text-xs sm:grid-cols-3">
            <Field label="Previsão de liberação" value={f.expectedRelease} />
            <Field label="Setor responsável" value={f.responsibleSector} />
            <Field
              label="Prioridade"
              value={
                <StatusBadge
                  label={f.priority === "alta" ? "Alta" : f.priority === "media" ? "Média" : "Baixa"}
                  tone={f.priority === "alta" ? "danger" : f.priority === "media" ? "warning" : "muted"}
                />
              }
            />
          </dl>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function SectorsGrid({ sectors }: { sectors: Sector[] }) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)]">
      <header className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">Status por setor</h3>
      </header>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {sectors.slice(0, 6).map((s) => (
          <div key={s.id} className="bg-card px-5 py-4 hover:bg-muted/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{s.name}</div>
              <StatusBadge
                label={s.status === "operacional" ? "Operacional" : s.status === "atencao" ? "Atenção" : "Crítico"}
                tone={s.status === "operacional" ? "success" : s.status === "atencao" ? "warning" : "danger"}
              />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {s.moduleCount} módulos • {s.recentRecords} registros recentes
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DamagesAndServices({ damages, services }: { damages: DamageRecord[]; services: ServiceRecord[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)]">
        <header className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold">Avarias pendentes de orçamento</h3>
        </header>
        <ul className="divide-y divide-border">
          {damages.map((d) => (
            <li key={d.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {d.vehicleNumber} • {d.description}
                </div>
                <div className="text-xs text-muted-foreground">
                  {d.driverName} • {d.createdAt}
                </div>
              </div>
              <div className="text-sm font-semibold tabular-nums">
                R$ {d.totalValue.toFixed(2).replace(".", ",")}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)]">
        <header className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold">Serviços aguardando conferência</h3>
        </header>
        <ul className="divide-y divide-border">
          {services.map((s) => (
            <li key={s.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {s.vehicleNumber} • {s.serviceDone}
                </div>
                <div className="text-xs text-muted-foreground">
                  {s.providerName} • {s.createdAt}
                </div>
              </div>
              <StatusBadge
                label={s.status === "registrado" ? "Registrado" : s.status === "em_andamento" ? "Em andamento" : "Aguardando"}
                tone={s.status === "registrado" ? "info" : s.status === "em_andamento" ? "warning" : "muted"}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
