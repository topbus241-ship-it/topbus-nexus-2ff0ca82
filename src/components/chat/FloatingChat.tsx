import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Bot, RotateCcw, ShieldAlert, Wrench, FileText, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Msg = {
  id: string;
  from: "bot" | "user";
  text: string;
  options?: { label: string; next: string }[];
};

const QUICK = [
  { id: "avaria", icon: ShieldAlert, label: "Registrar avaria" },
  { id: "servico", icon: Wrench, label: "Serviço terceirizado" },
  { id: "doc", icon: FileText, label: "Enviar documento" },
  { id: "relatorio", icon: Send, label: "Enviar relatório" },
];

const INITIAL: Msg[] = [
  {
    id: "m0",
    from: "bot",
    text: "Olá! Sou o assistente do TopBus OS. O que você precisa fazer agora?",
    options: QUICK.map((q) => ({ label: q.label, next: q.id })),
  },
];

const FLOWS: Record<string, Msg[]> = {
  avaria: [
    {
      id: "a1",
      from: "bot",
      text: "Qual o número do veículo?",
      options: [
        { label: "97021", next: "avaria_chapa" },
        { label: "21052", next: "avaria_chapa" },
        { label: "33108", next: "avaria_chapa" },
        { label: "Outro", next: "avaria_chapa" },
      ],
    },
  ],
  avaria_chapa: [
    {
      id: "ac1",
      from: "bot",
      text: "Informe a chapa do motorista.",
      options: [
        { label: "9718482 — Devair", next: "avaria_tipo" },
        { label: "9712001 — Antônio", next: "avaria_tipo" },
        { label: "Não sei", next: "avaria_tipo" },
      ],
    },
  ],
  avaria_tipo: [
    {
      id: "at1",
      from: "bot",
      text: "Qual o tipo da avaria?",
      options: [
        { label: "Vidro", next: "avaria_foto" },
        { label: "Funilaria", next: "avaria_foto" },
        { label: "Elétrica", next: "avaria_foto" },
        { label: "Mecânica", next: "avaria_foto" },
      ],
    },
  ],
  avaria_foto: [
    {
      id: "af1",
      from: "bot",
      text: "Deseja anexar uma foto da ocorrência?",
      options: [
        { label: "Sim, anexar", next: "fim_avaria" },
        { label: "Pular foto", next: "fim_avaria" },
      ],
    },
  ],
  fim_avaria: [
    {
      id: "fa",
      from: "bot",
      text: "Avaria registrada e encaminhada à manutenção. Quer fazer mais alguma coisa?",
      options: [
        { label: "Novo registro", next: "reset" },
        { label: "Encerrar", next: "encerrar" },
      ],
    },
  ],

  servico: [
    {
      id: "s1",
      from: "bot",
      text: "Qual veículo recebeu o serviço?",
      options: [
        { label: "21052", next: "servico_prestador" },
        { label: "74226", next: "servico_prestador" },
        { label: "55672", next: "servico_prestador" },
      ],
    },
  ],
  servico_prestador: [
    {
      id: "sp1",
      from: "bot",
      text: "Qual o prestador responsável?",
      options: [
        { label: "EDER (Mecânica)", next: "fim_servico" },
        { label: "Auto Elétrica Santos", next: "fim_servico" },
        { label: "Funilaria Central", next: "fim_servico" },
      ],
    },
  ],
  fim_servico: [
    {
      id: "fs",
      from: "bot",
      text: "Serviço lançado para conferência do financeiro. Algo mais?",
      options: [
        { label: "Novo registro", next: "reset" },
        { label: "Encerrar", next: "encerrar" },
      ],
    },
  ],

  doc: [
    {
      id: "d1",
      from: "bot",
      text: "Para qual setor o documento será enviado?",
      options: [
        { label: "Manutenção", next: "doc_tipo" },
        { label: "RH", next: "doc_tipo" },
        { label: "Financeiro", next: "doc_tipo" },
        { label: "Operação", next: "doc_tipo" },
      ],
    },
  ],
  doc_tipo: [
    {
      id: "dt1",
      from: "bot",
      text: "Qual o tipo de documento?",
      options: [
        { label: "Orçamento", next: "fim_doc" },
        { label: "Atestado", next: "fim_doc" },
        { label: "Comprovante", next: "fim_doc" },
        { label: "Relatório", next: "fim_doc" },
      ],
    },
  ],
  fim_doc: [
    {
      id: "fd",
      from: "bot",
      text: "Documento recebido e arquivado no setor correspondente. Algo mais?",
      options: [
        { label: "Novo registro", next: "reset" },
        { label: "Encerrar", next: "encerrar" },
      ],
    },
  ],

  relatorio: [
    {
      id: "r1",
      from: "bot",
      text: "Qual relatório deseja enviar?",
      options: [
        { label: "Operacional", next: "fim_relatorio" },
        { label: "Custos", next: "fim_relatorio" },
        { label: "Frota", next: "fim_relatorio" },
      ],
    },
  ],
  fim_relatorio: [
    {
      id: "fr",
      from: "bot",
      text: "Relatório enviado para a gestão. Posso ajudar em mais alguma coisa?",
      options: [
        { label: "Novo registro", next: "reset" },
        { label: "Encerrar", next: "encerrar" },
      ],
    },
  ],

  encerrar: [
    {
      id: "end",
      from: "bot",
      text: "Tudo certo! Estarei aqui sempre que precisar.",
      options: [{ label: "Iniciar nova conversa", next: "reset" }],
    },
  ],
};

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages, open]);

  const reset = () => setMessages(INITIAL);

  const choose = (label: string, next: string) => {
    if (next === "reset") {
      setMessages([
        { id: `u-${Date.now()}`, from: "user", text: label },
        ...INITIAL.map((m) => ({ ...m, id: `${m.id}-${Date.now()}` })),
      ]);
      return;
    }

    const userMsg: Msg = { id: `u-${Date.now()}`, from: "user", text: label };
    const botMsgs = (FLOWS[next] ?? []).map((m) => ({ ...m, id: `${m.id}-${Date.now()}` }));
    setMessages((curr) => [...curr, userMsg, ...botMsgs]);

    if (next.startsWith("fim_")) {
      toast.success("Registro enviado", { description: "Encaminhado para o setor responsável." });
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar chat" : "Abrir chat otimizado"}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all",
          "bg-primary text-primary-foreground hover:scale-105 active:scale-95",
          "ring-4 ring-primary/15",
        )}
      >
        {open ? <X className="h-5 w-5" strokeWidth={2} /> : <MessageSquare className="h-5 w-5" strokeWidth={2} />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-success ring-2 ring-card" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            "fixed z-50 bg-card border border-border shadow-2xl flex flex-col overflow-hidden",
            // Mobile: full-width sheet from bottom
            "bottom-0 right-0 left-0 h-[85vh] rounded-t-2xl",
            // Desktop: floating panel
            "sm:bottom-24 sm:right-5 sm:left-auto sm:h-[560px] sm:w-[400px] sm:rounded-2xl",
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-sidebar text-sidebar-foreground px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Bot className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">Chat Otimizado</div>
              <div className="flex items-center gap-1.5 text-[11px] text-sidebar-foreground/70">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
                Online · respostas guiadas
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground transition-colors"
              aria-label="Reiniciar conversa"
              title="Reiniciar conversa"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-secondary/30">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[90%]", m.from === "bot" && "w-full")}>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm leading-snug",
                      m.from === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border rounded-bl-sm",
                    )}
                  >
                    {m.text}
                  </div>
                  {m.options && m.from === "bot" && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.options.map((o) => (
                        <button
                          key={o.label}
                          onClick={() => choose(o.label, o.next)}
                          className="rounded-full border border-primary/30 bg-primary/[0.04] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
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

          {/* Footer note (no text input — intentionally) */}
          <div className="border-t border-border bg-card px-3 py-2.5">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Check className="h-3 w-3 text-success" strokeWidth={2} />
              Atendimento por botões — sem digitação
            </div>
          </div>
        </div>
      )}
    </>
  );
}
