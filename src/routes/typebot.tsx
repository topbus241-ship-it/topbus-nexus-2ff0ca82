import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MessageSquare, ShieldAlert, Wrench, FileText, Send, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/typebot")({
  component: TypebotPage,
});

const ACTIONS = [
  { icon: ShieldAlert, label: "Registrar avaria", color: "text-destructive" },
  { icon: Wrench, label: "Serviço terceirizado", color: "text-warning-foreground" },
  { icon: FileText, label: "Enviar documento", color: "text-info" },
  { icon: Send, label: "Enviar relatório", color: "text-success" },
];

const FLOW = [
  { label: "Typebot", hint: "Botões e formulário sem atrito" },
  { label: "Webhook", hint: "Encaminhamento autenticado" },
  { label: "Backend", hint: "Regras de negócio + validações" },
  { label: "Banco / Planilha / Drive", hint: "Persistência e arquivos" },
  { label: "Dashboard da Gestão", hint: "Visão consolidada" },
];

function TypebotPage() {
  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Plataforma"
        title="Entrada sem atrito — Typebot"
        description="Para colaboradores com dificuldade de preencher formulários longos, registros são feitos por botões simples."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold">Simulação do Typebot</h2>
            <StatusBadge label="Conceitual" tone="info" className="ml-auto" />
          </div>
          <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-4">
            <div className="text-xs text-muted-foreground">Atendente</div>
            <div className="mt-1 rounded-md bg-card border border-border px-3 py-2 text-sm">
              Olá! O que você precisa registrar agora?
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {ACTIONS.map((a) => (
                <button key={a.label} className="group flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/[0.03]">
                  <a.icon className={`h-3.5 w-3.5 ${a.color}`} strokeWidth={1.75} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Cada botão dispara um fluxo guiado por perguntas curtas, com upload de foto e validação automática.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Arquitetura conceitual</h2>
          <p className="mt-1 text-xs text-muted-foreground">Camadas envolvidas no recebimento dos dados.</p>
          <ol className="mt-5 space-y-2.5">
            {FLOW.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-[11px] font-semibold tabular-nums">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1 rounded-md border border-border bg-secondary/40 px-3 py-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {s.label}
                    {i < FLOW.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{s.hint}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AppLayout>
  );
}
