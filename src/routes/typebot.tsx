import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";
import { MessageSquare, ShieldAlert, Wrench, FileText, Send, ArrowRight, Bot, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/typebot")({
  component: ChatOtimizadoPage,
});

type Msg = { id: string; from: "bot" | "user"; text: string; options?: { label: string; next?: string }[] };

const FLOW = [
  { label: "Chat Otimizado", hint: "Botões e formulário sem atrito" },
  { label: "Webhook", hint: "Encaminhamento autenticado" },
  { label: "Backend", hint: "Regras de negócio + validações" },
  { label: "Banco / Planilha / Drive", hint: "Persistência e arquivos" },
  { label: "Dashboard da Gestão", hint: "Visão consolidada" },
];

const QUICK = [
  { id: "avaria", icon: ShieldAlert, label: "Registrar avaria", color: "text-destructive" },
  { id: "servico", icon: Wrench, label: "Serviço terceirizado", color: "text-warning-foreground" },
  { id: "doc", icon: FileText, label: "Enviar documento", color: "text-info" },
  { id: "relatorio", icon: Send, label: "Enviar relatório", color: "text-success" },
];

const initialMessages: Msg[] = [
  { id: "m0", from: "bot", text: "Olá! Sou o assistente do TopBus OS. Para começar, informe seu ID (chapa ou email) ou faça login.", options: [] },
];

const FLOWS: Record<string, Msg[]> = {
  avaria: [
    { id: "a1", from: "bot", text: "Certo. Qual o número do veículo?", options: [{ label: "97021", next: "chapa" }, { label: "21052", next: "chapa" }, { label: "33108", next: "chapa" }] },
  ],
  chapa: [
    { id: "c1", from: "bot", text: "Informe a chapa do motorista.", options: [{ label: "9718482 — Devair", next: "tipo" }, { label: "9712001 — Antônio", next: "tipo" }] },
  ],
  tipo: [
    { id: "t1", from: "bot", text: "Qual o tipo de avaria?", options: [{ label: "Vidro", next: "foto" }, { label: "Funilaria", next: "foto" }, { label: "Elétrica", next: "foto" }] },
  ],
  foto: [
    { id: "f1", from: "bot", text: "Anexe uma foto da ocorrência (opcional).", options: [{ label: "Pular", next: "fim" }, { label: "Anexar agora", next: "fim" }] },
  ],
  servico: [
    { id: "s1", from: "bot", text: "Qual veículo recebeu o serviço?", options: [{ label: "21052", next: "fim" }, { label: "74226", next: "fim" }] },
  ],
  doc: [
    { id: "d1", from: "bot", text: "Para qual setor o documento será enviado?", options: [{ label: "Manutenção", next: "fim" }, { label: "RH", next: "fim" }, { label: "Financeiro", next: "fim" }] },
  ],
  relatorio: [
    { id: "r1", from: "bot", text: "Qual relatório deseja enviar?", options: [{ label: "Operacional", next: "fim" }, { label: "Custos", next: "fim" }] },
  ],
  fim: [
    { id: "end", from: "bot", text: "Pronto! Registro recebido e encaminhado para conferência. Posso ajudar em mais alguma coisa?", options: QUICK.map((q) => ({ label: q.label, next: q.id })) },
  ],
};

function ChatOtimizadoPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [buttons, setButtons] = useState<{ label: string; next?: string }[]>([]);
  const [collaboratorId, setCollaboratorId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user) {
      const id = user.email ?? user.id ?? user.name;
      fetch('/api/typebot/init-public', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collaboratorId: id }) })
        .then((r) => r.json())
        .then((data) => {
          setConversationId(data.conversationId);
          setButtons(data.buttons || []);
          setMessages([{ id: 'm0', from: 'bot', text: `Olá ${user.name}. Em que posso ajudar?`, options: (data.buttons || []).map((b: any) => ({ label: b.label, next: b.next || 'fim' })) }]);
        })
        .catch(() => {
          setMessages([{ id: 'm0', from: 'bot', text: 'Olá! Sou o assistente do TopBus OS. O que você precisa registrar agora?', options: QUICK.map((q) => ({ label: q.label, next: q.id })) }]);
        });
    }
  }, [user]);

  const choose = (label: string, next: string) => {
    const userMsg: Msg = { id: `u-${Date.now()}`, from: "user", text: label };
    setMessages((curr) => [...curr, userMsg]);

    if (conversationId) {
      fetch('/api/typebot/public-message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ conversationId, content: label, option: next }) })
        .then((r) => r.json())
        .then((data) => {
          if (data.bot) {
            const botMsg: Msg = { id: `b-${Date.now()}`, from: 'bot', text: data.bot.content ?? 'Registro recebido.' };
            setMessages((curr) => [...curr, botMsg]);
          }
        })
        .catch(() => {
          const botMsgs = (FLOWS[next] ?? []).map((m) => ({ ...m, id: `${m.id}-${Date.now()}` }));
          setMessages((curr) => [...curr, ...botMsgs]);
        });
    } else {
      const botMsgs = (FLOWS[next] ?? []).map((m) => ({ ...m, id: `${m.id}-${Date.now()}` }));
      setMessages((curr) => [...curr, ...botMsgs]);
    }

    if (next === "fim") toast.success("Registro enviado", { description: "Encaminhado para o setor responsável." });
  };

  const handleInitPublic = () => {
    if (!collaboratorId) return toast.error('Informe o ID do colaborador');
    fetch('/api/typebot/init-public', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collaboratorId }) })
      .then((r) => r.json())
      .then((data) => {
        setConversationId(data.conversationId);
        setButtons(data.buttons || []);
        setMessages([{ id: 'm0', from: 'bot', text: `Olá. Em que posso ajudar?`, options: (data.buttons || []).map((b: any) => ({ label: b.label, next: b.next || 'fim' })) }]);
      })
      .catch(() => toast.error('Falha ao iniciar chat'));
  };

  const handleFileUpload = async (file?: File) => {
    if (!file || !conversationId) return toast.error('Nenhum arquivo ou conversa ativa');
    const form = new FormData();
    form.append('file', file);
    form.append('conversationId', conversationId);
    form.append('uploadedBy', user?.name ?? 'public');
    const res = await fetch('/api/typebot/upload', { method: 'POST', body: form });
    if (!res.ok) return toast.error('Upload falhou');
    const json = await res.json();
    toast.success('Arquivo enviado');
    const botMsg: Msg = { id: `b-${Date.now()}`, from: 'bot', text: 'Arquivo recebido e anexado ao registro.' };
    setMessages((curr) => [...curr, botMsg]);
  };

  const reset = () => setMessages(initialMessages);

  return (
    <AppLayout allowUnauthenticated>
      <PageHeader
        breadcrumb="Plataforma"
        title="Chat Otimizado"
        description="Canal sem atrito para colaboradores: registros guiados por botões em vez de formulários longos."
        actions={
          <Button size="sm" variant="outline" className="gap-1.5" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" /> Reiniciar conversa
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Chat */}
        <section className="rounded-xl border border-border bg-card flex flex-col h-[560px]">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Bot className="h-4 w-4 text-primary" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold">Assistente TopBus</h2>
              <div className="text-[11px] text-muted-foreground">Online · responde em segundos</div>
            </div>
            <StatusBadge label="Simulação" tone="info" className="ml-auto" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-secondary/30">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${m.from === "user" ? "" : "w-full"}`}>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      m.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.options && m.from === "bot" && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.options.map((o) => (
                        <button
                          key={o.label}
                          onClick={() => choose(o.label, o.next ?? 'fim')}
                          className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!conversationId && !user && (
            <div className="border-t border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <input value={collaboratorId} onChange={(e) => setCollaboratorId(e.target.value)} placeholder="ID do colaborador (chapa ou email)" className="flex-1 rounded-md border p-2" />
                <Button onClick={handleInitPublic}>Iniciar</Button>
              </div>
            </div>
          )}

          <div className="border-t border-border px-4 py-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {/* show configured buttons when available */}
              {(buttons.length > 0 ? buttons : QUICK).map((a: any) => (
                <button
                  key={a.id ?? a.label}
                  onClick={() => choose(a.label, a.next ?? a.id ?? 'fim')}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-2 py-2 text-[11px] font-medium transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
                >
                  {/* icon optional */}
                  <span className="truncate">{a.label}</span>
                </button>
              ))}
            </div>
            {conversationId && (
              <div className="mt-3 flex items-center gap-2">
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0])} />
                <Button onClick={() => fileInputRef.current?.click()} size="sm">Enviar arquivo</Button>
              </div>
            )}
          </div>
        </section>

        {/* Architecture */}
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold">Arquitetura conceitual</h2>
          </div>
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

          <div className="mt-5 rounded-md border border-primary/20 bg-primary/[0.04] p-3 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Por que assim?</strong> Colaboradores de campo (motoristas, portaria, abastecimento)
            registram dados em segundos com botões, sem digitar formulários longos. O backend padroniza, valida e encaminha.
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
