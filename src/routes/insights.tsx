import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getInsights } from "@/lib/api/mockApi";
import { Sparkles, Cpu, Bot } from "lucide-react";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
});

function InsightsPage() {
  const { data: insights = [] } = useQuery({ queryKey: ["insights"], queryFn: getInsights });

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Gestão"
        title="Insights Operacionais"
        description="Copiloto analítico com leitura inteligente dos registros operacionais."
      />

      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Cpu className="h-4 w-4 text-primary" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">IA local preparada</h2>
              <StatusBadge label="Roadmap" tone="info" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Integração futura com <strong className="text-foreground">Ollama / Mistral</strong> rodando em rede local.
              Os insights abaixo são gerados a partir dos registros operacionais consolidados (mock nesta versão).
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((i) => (
          <article key={i.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{i.category}</span>
              </div>
              <StatusBadge
                label={i.severity === "critico" ? "Crítico" : i.severity === "alerta" ? "Alerta" : "Informativo"}
                tone={i.severity === "critico" ? "danger" : i.severity === "alerta" ? "warning" : "info"}
              />
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-snug">{i.title}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{i.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <Bot className="h-4 w-4 text-primary" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">Copiloto analítico</div>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Em breve, perguntas em linguagem natural sobre frota, custos e operação. Estrutura pronta para
            conectar ao endpoint da IA local quando o backend estiver disponível.
          </p>
        </div>
        <div className="hidden sm:flex gap-1.5">
          <span className="rounded-md border border-border bg-secondary/60 px-2 py-1 text-[11px]">Ollama</span>
          <span className="rounded-md border border-border bg-secondary/60 px-2 py-1 text-[11px]">Mistral</span>
        </div>
      </div>
    </AppLayout>
  );
}
