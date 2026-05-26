import { cn } from "@/lib/utils";
import type { VehicleStatus } from "@/lib/types";

type Tone = "success" | "warning" | "danger" | "info" | "muted";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning-foreground border-warning/30",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  muted: "bg-muted text-muted-foreground border-border",
};

const VEHICLE_STATUS_MAP: Record<string, { label: string; tone: Tone }> = {
  ativo: { label: "Ativo", tone: "success" },
  manutencao: { label: "Em manutenção", tone: "warning" },
  parado: { label: "Parado", tone: "danger" },
  aguardando_peca: { label: "Aguardando peça", tone: "warning" },
  aguardando_terceiro: { label: "Aguardando terceiro", tone: "info" },
  liberado: { label: "Liberado", tone: "success" },
  inativo: { label: "Inativo", tone: "muted" },

  avaria: { label: "Com avaria", tone: "warning" },
  atencao: { label: "Atenção", tone: "warning" },
  operacional: { label: "Operacional", tone: "success" },
  critico: { label: "Crítico", tone: "danger" },
  aguardando: { label: "Aguardando", tone: "muted" },
  registrado: { label: "Registrado", tone: "info" },
  registrada: { label: "Registrada", tone: "info" },
  orcamento: { label: "Em orçamento", tone: "warning" },
  aprovada: { label: "Aprovada", tone: "success" },
  concluida: { label: "Concluída", tone: "success" },
  concluido: { label: "Concluído", tone: "success" },
  em_andamento: { label: "Em andamento", tone: "warning" },
};

export function StatusBadge({
  label,
  tone = "muted",
  className,
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  const safeTone = toneClasses[tone] ? tone : "muted";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        toneClasses[safeTone],
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-success": safeTone === "success",
          "bg-warning": safeTone === "warning",
          "bg-destructive": safeTone === "danger",
          "bg-info": safeTone === "info",
          "bg-muted-foreground": safeTone === "muted",
        })}
      />
      {label || "Não informado"}
    </span>
  );
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus | string }) {
  const cfg =
    VEHICLE_STATUS_MAP[String(status)] ?? {
      label: String(status || "Não informado"),
      tone: "muted" as Tone,
    };

  return <StatusBadge label={cfg.label} tone={cfg.tone} />;
}
