import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Boxes, Check, ShieldAlert, Send } from "lucide-react";
import type { ModuleFieldType } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/criador-modulos")({
  component: CriadorModulosPage,
});

const AVAILABLE_FIELDS: { type: ModuleFieldType; label: string }[] = [
  { type: "text", label: "Texto curto" },
  { type: "longtext", label: "Texto longo" },
  { type: "number", label: "Número" },
  { type: "currency", label: "Valor" },
  { type: "date", label: "Data" },
  { type: "datetime", label: "Data/hora" },
  { type: "vehicle", label: "Veículo" },
  { type: "driver", label: "Motorista" },
  { type: "provider", label: "Prestador" },
  { type: "line", label: "Linha" },
  { type: "route", label: "Rota" },
  { type: "photo", label: "Foto" },
  { type: "signature", label: "Assinatura" },
  { type: "file", label: "Upload de arquivo" },
  { type: "status", label: "Status" },
  { type: "observation", label: "Observação" },
];

function CriadorModulosPage() {
  const { user } = useAuth();

  const [name, setName] = useState("Registro de Abastecimento");
  const [sector, setSector] = useState("abastecimento");
  const [description, setDescription] = useState("Registro de litros, valor, posto e cupom por veículo, com assinatura.");
  const [selected, setSelected] = useState<ModuleFieldType[]>(["vehicle", "driver", "number", "currency", "text", "photo", "signature"]);
  const [required, setRequired] = useState<ModuleFieldType[]>(["vehicle", "driver", "number", "currency"]);

  if (user?.role !== "master") {
    return (
      <AppLayout>
        <PageHeader breadcrumb="Plataforma" title="Criador de Módulos" />
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-destructive shrink-0" strokeWidth={1.75} />
          <div>
            <div className="text-sm font-semibold">Acesso restrito</div>
            <p className="mt-1 text-xs text-muted-foreground">Apenas o perfil Master pode criar e publicar novos módulos.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const toggle = (t: ModuleFieldType) =>
    setSelected((curr) => (curr.includes(t) ? curr.filter((c) => c !== t) : [...curr, t]));
  const toggleReq = (t: ModuleFieldType) =>
    setRequired((curr) => (curr.includes(t) ? curr.filter((c) => c !== t) : [...curr, t]));

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Plataforma"
        title="Criador de Módulos"
        description="Monte módulos personalizados por setor com campos, obrigatoriedades e permissões."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast.success("Módulo publicado", { description: `${name} disponível para o setor.` })}>
            <Send className="h-3.5 w-3.5" /> Publicar módulo
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div>
              <Label className="text-xs mb-1.5 block">Nome do módulo</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs mb-1.5 block">Setor responsável</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abastecimento">Abastecimento</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="operacao">Operação</SelectItem>
                    <SelectItem value="portaria">Portaria</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Permissões</Label>
                <Select defaultValue="master+setor">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">Apenas Master</SelectItem>
                    <SelectItem value="master+setor">Master + Setor</SelectItem>
                    <SelectItem value="todos">Todos os perfis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Descrição</Label>
              <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Campos do módulo</h3>
              <span className="text-xs text-muted-foreground">{selected.length} selecionados</span>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {AVAILABLE_FIELDS.map((f) => {
                const on = selected.includes(f.type);
                const req = required.includes(f.type);
                return (
                  <div key={f.type} className={`flex items-center justify-between rounded-md border px-3 py-2 ${on ? "border-primary/30 bg-primary/[0.03]" : "border-border bg-card"}`}>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={on} onCheckedChange={() => toggle(f.type)} />
                      {f.label}
                    </label>
                    {on && (
                      <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                        <Checkbox checked={req} onCheckedChange={() => toggleReq(f.type)} />
                        obrigatório
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" strokeWidth={1.75} />
              <h3 className="text-sm font-semibold">Pré-visualização</h3>
            </div>
            <StatusBadge label="Rascunho" tone="info" />
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Módulo</div>
              <div className="text-base font-semibold">{name}</div>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="space-y-3">
              {selected.map((t) => {
                const meta = AVAILABLE_FIELDS.find((f) => f.type === t)!;
                const req = required.includes(t);
                return (
                  <div key={t}>
                    <Label className="text-xs mb-1.5 flex items-center gap-1.5">
                      {meta.label}
                      {req && <span className="text-destructive">*</span>}
                    </Label>
                    <PreviewField type={t} />
                  </div>
                );
              })}
              {selected.length === 0 && (
                <div className="text-xs text-muted-foreground">Selecione campos à esquerda para visualizar o módulo.</div>
              )}
            </div>
            <div className="rounded-md border border-success/30 bg-success/5 p-3 flex items-start gap-2">
              <Check className="h-4 w-4 text-success mt-0.5" strokeWidth={1.75} />
              <div className="text-xs">
                Pronto para publicação. Após publicar, o módulo aparece no setor selecionado e respeita as permissões definidas.
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function PreviewField({ type }: { type: ModuleFieldType }) {
  switch (type) {
    case "longtext":
    case "observation":
      return <Textarea rows={2} placeholder="…" />;
    case "number":
    case "currency":
      return <Input type="number" placeholder="0" />;
    case "date":
      return <Input placeholder="dd/mm/aaaa" />;
    case "datetime":
      return <Input placeholder="dd/mm/aaaa hh:mm" />;
    case "photo":
    case "file":
    case "signature":
      return <div className="rounded-md border border-dashed border-border bg-secondary/30 px-3 py-4 text-center text-xs text-muted-foreground">{type === "signature" ? "Assinatura simulada" : type === "photo" ? "Anexar foto" : "Anexar arquivo"}</div>;
    case "status":
      return (
        <Select defaultValue="registrado">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="registrado">Registrado</SelectItem>
            <SelectItem value="andamento">Em andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
      );
    default:
      return <Input placeholder="…" />;
  }
}
