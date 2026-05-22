import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getServiceRecords, getProviders, getVehicles } from "@/lib/api/mockApi";
import { Plus, Save, Wrench } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/servico-terceirizado")({
  component: ServicoTerceirizadoPage,
});

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ServicoTerceirizadoPage() {
  const { data: records = [] } = useQuery({ queryKey: ["services"], queryFn: getServiceRecords });
  const { data: providers = [] } = useQuery({ queryKey: ["providers"], queryFn: getProviders });
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: getVehicles });
  const [open, setOpen] = useState(false);

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Manutenção"
        title="Serviço Terceirizado"
        description="Registros de serviços executados por prestadores externos."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setOpen((v) => !v)}>
            <Plus className="h-3.5 w-3.5" /> {open ? "Fechar formulário" : "Novo registro"}
          </Button>
        }
      />

      {open && (
        <form
          className="space-y-4 mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Registro de serviço salvo", { description: "O lançamento será conferido pelo financeiro." });
            setOpen(false);
          }}
        >
          <FormSection title="Identificação" description="Veículo, prestador e responsável pelo serviço.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Veículo">
                <Select defaultValue="21052">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.number}>{v.number}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Prestador">
                <Select defaultValue="EDER">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{providers.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Executor"><Input defaultValue="EDER" /></Field>
              <Field label="Tipo de serviço">
                <Select defaultValue="Mecânica">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mecânica">Mecânica</SelectItem>
                    <SelectItem value="Elétrica">Elétrica</SelectItem>
                    <SelectItem value="Funilaria">Funilaria</SelectItem>
                    <SelectItem value="Pneus">Pneus</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Serviço executado" description="Descrição detalhada e valor cobrado.">
            <Field label="Serviço realizado"><Input defaultValue="TROCA DA CAIXA DE MARCHA" /></Field>
            <Field label="Descrição"><Textarea placeholder="Detalhes técnicos, peças envolvidas, observações." rows={3} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Valor (R$)"><Input type="number" defaultValue="4800" /></Field>
              <Field label="Responsável pela autorização"><Input defaultValue="Supervisor Manutenção" /></Field>
            </div>
          </FormSection>

          <FormSection title="Evidências" description="Fotos antes/depois e documentos comprobatórios.">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs mb-1.5 block">Fotos antes</Label>
                <UploadBox label="Adicionar fotos antes" hint="JPG ou PNG" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Fotos depois</Label>
                <UploadBox label="Adicionar fotos depois" hint="JPG ou PNG" />
              </div>
            </div>
          </FormSection>

          <FormSection title="Assinatura e conferência" description="Confirme com a assinatura do responsável.">
            <SignatureBox />
            <div className="flex justify-end">
              <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Salvar registro</Button>
            </div>
          </FormSection>
        </form>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold">Registros recentes</h2>
        </div>
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Veículo</th>
                <th className="px-5 py-3 text-left font-medium">Prestador</th>
                <th className="px-5 py-3 text-left font-medium">Serviço</th>
                <th className="px-5 py-3 text-left font-medium">Valor</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="px-5 py-3 font-medium">{r.vehicleNumber}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.providerName}</td>
                  <td className="px-5 py-3">{r.serviceDone}</td>
                  <td className="px-5 py-3 tabular-nums font-semibold">{brl(r.value)}</td>
                  <td className="px-5 py-3"><StatusBadge label={r.status === "registrado" ? "Registrado" : r.status === "em_andamento" ? "Em andamento" : r.status === "concluido" ? "Concluído" : "Aguardando"} tone={r.status === "registrado" ? "info" : r.status === "em_andamento" ? "warning" : r.status === "concluido" ? "success" : "muted"} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-border">
          {records.map((r) => (
            <div key={r.id} className="px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.vehicleNumber} • {r.serviceType}</div>
                <StatusBadge label={r.status === "registrado" ? "Registrado" : r.status === "em_andamento" ? "Em andamento" : r.status === "concluido" ? "Concluído" : "Aguardando"} tone={r.status === "registrado" ? "info" : r.status === "em_andamento" ? "warning" : r.status === "concluido" ? "success" : "muted"} />
              </div>
              <div className="mt-1 text-sm">{r.serviceDone}</div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{r.providerName}</span>
                <span className="font-semibold text-foreground tabular-nums">{brl(r.value)}</span>
              </div>
            </div>
          ))}
        </div>
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
