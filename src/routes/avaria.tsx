import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormSection } from "@/components/forms/FormSection";
import { UploadBox } from "@/components/forms/UploadBox";
import { SignatureBox } from "@/components/forms/SignatureBox";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getDamageRecords } from "@/lib/api/mockApi";
import { Plus, Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/avaria")({
  component: AvariaPage,
});

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function AvariaPage() {
  const { data: records = [] } = useQuery({ queryKey: ["damages"], queryFn: getDamageRecords });
  const [open, setOpen] = useState(false);

  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState(230);
  const [labor, setLabor] = useState(85);
  const [other, setOther] = useState(0);

  const total = useMemo(() => qty * unit + labor + other, [qty, unit, labor, other]);

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Manutenção"
        title="Avaria / Portaria"
        description="Registro de avarias identificadas pela portaria, com cálculo automático de custo."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setOpen((v) => !v)}>
            <Plus className="h-3.5 w-3.5" /> {open ? "Fechar formulário" : "Nova avaria"}
          </Button>
        }
      />

      {open && (
        <form
          className="space-y-4 mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Avaria registrada", { description: `Total calculado: ${brl(total)}` });
            setOpen(false);
          }}
        >
          <FormSection title="Identificação" description="Veículo, motorista e responsável pelo registro.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Veículo"><Input defaultValue="97021" /></Field>
              <Field label="Motorista"><Input defaultValue="DEVAIR MENDES DE SOUSA" /></Field>
              <Field label="Chapa"><Input defaultValue="9718482" /></Field>
              <Field label="Apontador / Portaria"><Input defaultValue="Portaria - Turno 1" /></Field>
            </div>
          </FormSection>

          <FormSection title="Dano" description="Detalhe da avaria e versões coletadas.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tipo de dano"><Input defaultValue="Vidro" /></Field>
              <Field label="Parte afetada"><Input defaultValue="Letreiro frontal" /></Field>
            </div>
            <Field label="Descrição da avaria"><Textarea defaultValue="VIDRO DO LETREIRO QUEBRADO" rows={2} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Versão do motorista"><Textarea rows={2} placeholder="Como o motorista descreve o ocorrido" /></Field>
              <Field label="Versão da portaria"><Textarea rows={2} placeholder="Observações da portaria/manutenção" /></Field>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Fotos</Label>
              <UploadBox />
            </div>
          </FormSection>

          <FormSection title="Custo" description="Cálculo automático com base nos itens informados.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Item / Peça"><Input defaultValue="Vidro do letreiro" /></Field>
              <Field label="Quantidade"><Input type="number" value={qty} onChange={(e) => setQty(+e.target.value || 0)} /></Field>
              <Field label="Valor unitário (R$)"><Input type="number" value={unit} onChange={(e) => setUnit(+e.target.value || 0)} /></Field>
              <Field label="Mão de obra (R$)"><Input type="number" value={labor} onChange={(e) => setLabor(+e.target.value || 0)} /></Field>
              <Field label="Outros valores (R$)"><Input type="number" value={other} onChange={(e) => setOther(+e.target.value || 0)} /></Field>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex flex-col justify-center">
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Valor total</div>
                <div className="text-xl font-semibold tabular-nums text-primary">{brl(total)}</div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Assinatura" description="Confirme com a assinatura do responsável.">
            <SignatureBox />
            <div className="flex justify-end">
              <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Salvar avaria</Button>
            </div>
          </FormSection>
        </form>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold">Avarias registradas</h2>
        </div>
        <ul className="divide-y divide-border">
          {records.map((r) => (
            <li key={r.id} className="px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{r.vehicleNumber}</span>
                    <span className="text-xs text-muted-foreground">• {r.driverName} (chapa {r.chapa})</span>
                  </div>
                  <div className="mt-1 text-sm">{r.description}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{r.createdAt} • {r.reporter}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Total</div>
                    <div className="text-base font-semibold tabular-nums">{brl(r.totalValue)}</div>
                  </div>
                  <StatusBadge
                    label={r.status === "registrada" ? "Registrada" : r.status === "orcamento" ? "Em orçamento" : r.status === "aprovada" ? "Aprovada" : "Concluída"}
                    tone={r.status === "registrada" ? "info" : r.status === "orcamento" ? "warning" : r.status === "aprovada" ? "success" : "muted"}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
