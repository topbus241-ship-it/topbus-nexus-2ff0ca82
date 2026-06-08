import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormSection } from "@/components/forms/FormSection";
import { UploadBox } from "@/components/forms/UploadBox";
import { SignatureBox } from "@/components/forms/SignatureBox";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProtocolSuccess } from "@/components/common/ProtocolSuccess";
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
const generateProtocolNumber = () => `ST-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

function ServicoTerceirizadoPage() {
  const { data: records = [] } = useQuery({ queryKey: ["services"], queryFn: getServiceRecords });
  const { data: providers = [] } = useQuery({ queryKey: ["providers"], queryFn: getProviders });
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: getVehicles });
  
  // Fluxo de criação vs conclusão
  const [mode, setMode] = useState<"menu" | "create" | "complete">("menu");
  const [protocol, setProtocol] = useState("");
  const [successProtocol, setSuccessProtocol] = useState<{
    protocol: string;
    collaboratorName: string;
    collaboratorId: string;
  } | null>(null);
  const [collaboratorName, setCollaboratorName] = useState("");
  const [collaboratorId, setCollaboratorId] = useState("");

  return (
    <AppLayout allowUnauthenticated>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <PageHeader
          breadcrumb="Manutenção"
          title="Serviço Terceirizado"
          description="Criar demanda ou completar preenchimento com protocolo"
          actions={null}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (mode !== "menu") setMode("menu");
            else window.history.back();
          }}
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          {mode !== "menu" ? "← Voltar ao menu" : "← Voltar"}
        </Button>
      </div>

      {/* Success screen */}
      {successProtocol && (
        <ProtocolSuccess
          protocol={successProtocol.protocol}
          moduleType="servico-terceirizado"
          collaboratorName={successProtocol.collaboratorName}
          collaboratorId={successProtocol.collaboratorId}
          onReset={() => {
            setSuccessProtocol(null);
            setMode("menu");
            setCollaboratorName("");
            setCollaboratorId("");
            setProtocol("");
          }}
        />
      )}

      {/* Menu inicial */}
      {!successProtocol && mode === "menu" && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-8">
          <button
            onClick={() => {
              setMode("create");
              setCollaboratorName("");
              setCollaboratorId("");
            }}
            className="rounded-lg border-2 border-slate-200 bg-white p-6 hover:border-primary hover:bg-primary/5 transition-all text-left"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Criar nova demanda</h3>
            </div>
            <p className="text-sm text-slate-600">
              Registre um novo serviço. Você receberá um protocolo para acompanhamento.
            </p>
          </button>

          <button
            onClick={() => {
              setMode("complete");
              setProtocol("");
            }}
            className="rounded-lg border-2 border-slate-200 bg-white p-6 hover:border-primary hover:bg-primary/5 transition-all text-left"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <Save className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Completar demanda</h3>
            </div>
            <p className="text-sm text-slate-600">
              Use seu protocolo para buscar e finalizar uma demanda em andamento.
            </p>
          </button>
        </div>
      )}

      {/* Modo CREATE - Apenas dados básicos de registro */}
      {!successProtocol && mode === "create" && (
        <form
          className="space-y-4 mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            const newProtocol = generateProtocolNumber();
            setSuccessProtocol({
              protocol: newProtocol,
              collaboratorName,
              collaboratorId: collaboratorId || "N/A",
            });
          }}
        >
          <FormSection title="Identificação" description="Veículo, prestador e responsável. Esta demanda aguardará conclusão.">
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
              <Field label="Seu nome">
                <Input
                  value={collaboratorName}
                  onChange={(e) => setCollaboratorName(e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </Field>
              <Field label="ID / Matrícula">
                <Input
                  value={collaboratorId}
                  onChange={(e) => setCollaboratorId(e.target.value)}
                  placeholder="Deixe em branco se não aplicável"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Tipo de serviço" description="Qual tipo de serviço será executado.">
            <div className="grid gap-3 sm:grid-cols-2">
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
              <Field label="Valor estimado (R$)">
                <Input type="number" placeholder="Ex: 4800" required />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Descrição">
            <Field label="Descrição do serviço">
              <Textarea placeholder="Descreva o serviço a ser executado..." rows={2} required />
            </Field>
          </FormSection>

          <FormSection title="Foto de referência" description="Foto ANTES da execução do serviço para comparativo com a conclusão.">
            <div className="grid gap-3 sm:grid-cols-1">
              <div>
                <Label className="text-xs mb-1.5 block">Foto ANTES (situação atual)</Label>
                <UploadBox label="Adicionar foto antes" hint="JPG ou PNG" multiple={false} />
              </div>
            </div>
          </FormSection>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" /> Criar demanda e gerar protocolo
            </Button>
          </div>
        </form>
      )}

      {/* Modo COMPLETE - Buscar por protocolo e completar */}
      {!successProtocol && mode === "complete" && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-7">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Buscar demanda por protocolo</h3>
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <Field label="Protocolo">
                <Input
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value.toUpperCase())}
                  placeholder="Ex: ST-1717884935-ABC123"
                  required
                />
              </Field>
              <Field label="Seu nome">
                <Input
                  value={collaboratorName}
                  onChange={(e) => setCollaboratorName(e.target.value)}
                  placeholder="Para verificação"
                  required
                />
              </Field>
            </div>
            <Button 
              onClick={() => {
                if (protocol && collaboratorName) {
                  // Simula busca da demanda
                  toast.success("Demanda encontrada!");
                  // Aqui iria o fluxo de completar com evidências/assinaturas
                }
              }}
              className="w-full"
            >
              Buscar e carregar demanda
            </Button>
          </div>

          <div className="mt-6 text-sm text-slate-600 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="font-semibold mb-2 text-slate-900">ℹ️ Próximos passos:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Após buscar, você poderá adicionar fotos antes/depois</li>
              <li>Incluir comprovante do serviço</li>
              <li>Obter assinaturas do prestador e revisor</li>
              <li>Finalizar a demanda</li>
            </ul>
          </div>
        </div>
      )}

      {/* Lista de registros - sempre visível quando não em formulário */}
      {!successProtocol && mode === "menu" && (
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold text-slate-900">Registros recentes</h2>
        </div>
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.12em] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Veículo</th>
                <th className="px-5 py-3 text-left font-medium">Prestador</th>
                <th className="px-5 py-3 text-left font-medium">Serviço</th>
                <th className="px-5 py-3 text-left font-medium">Valor</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900">{r.vehicleNumber}</td>
                  <td className="px-5 py-3 text-slate-600">{r.providerName}</td>
                  <td className="px-5 py-3 text-slate-600">{r.serviceDone}</td>
                  <td className="px-5 py-3 tabular-nums font-semibold text-slate-900">{brl(r.value)}</td>
                  <td className="px-5 py-3"><StatusBadge label={r.status === "registrado" ? "Registrado" : r.status === "em_andamento" ? "Em andamento" : r.status === "concluido" ? "Concluído" : "Aguardando"} tone={r.status === "registrado" ? "info" : r.status === "em_andamento" ? "warning" : r.status === "concluido" ? "success" : "muted"} /></td>
                  <td className="px-5 py-3 text-slate-600">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-slate-200">
          {records.map((r) => (
            <div key={r.id} className="px-4 py-3.5 hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-900">{r.vehicleNumber}</div>
                <StatusBadge label={r.status === "registrado" ? "Registrado" : r.status === "em_andamento" ? "Em andamento" : r.status === "concluido" ? "Concluído" : "Aguardando"} tone={r.status === "registrado" ? "info" : r.status === "em_andamento" ? "warning" : r.status === "concluido" ? "success" : "muted"} />
              </div>
              <div className="mt-1 text-sm text-slate-600">{r.serviceDone}</div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                <span>{r.providerName}</span>
                <span className="font-semibold text-slate-900">{brl(r.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
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
