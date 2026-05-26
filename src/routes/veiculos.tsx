import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { VehicleStatusBadge } from "@/components/common/StatusBadge";
import { getVehicles, createRecord } from "@/lib/api/mockApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Bus, Save, X } from "lucide-react";
import type { VehicleStatus } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/veiculos")({
  component: VeiculosPage,
});

const FILTERS: { value: VehicleStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "ativo", label: "Ativos" },
  { value: "manutencao", label: "Em manutenção" },
  { value: "parado", label: "Parados" },
  { value: "aguardando_peca", label: "Aguardando peça" },
];

function VeiculosPage() {
  const queryClient = useQueryClient();
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: getVehicles });

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");

  const [number, setNumber] = useState("");
  const [type, setType] = useState("Ônibus urbano");
  const [status, setStatus] = useState<VehicleStatus>("ativo");
  const [note, setNote] = useState("");

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesQ = q.trim().length === 0 || v.number.includes(q.trim());
      const matchesF = filter === "all" || v.status === filter;
      return matchesQ && matchesF;
    });
  }, [vehicles, q, filter]);

  const resetForm = () => {
    setNumber("");
    setType("Ônibus urbano");
    setStatus("ativo");
    setNote("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!number.trim()) {
      toast.error("Informe o número do veículo.");
      return;
    }

    try {
      await createRecord("vehicles", {
        number: number.trim(),
        type: type.trim() || "Ônibus urbano",
        status,
        note: note.trim() || undefined,
      });

      await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
      await queryClient.invalidateQueries({ queryKey: ["analytics"] });

      toast.success("Veículo cadastrado com sucesso.");
      resetForm();
      setOpen(false);
    } catch (err) {
      toast.error("Não foi possível salvar o veículo.", {
        description: err instanceof Error ? err.message : "Erro desconhecido.",
      });
    }
  };

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Operação"
        title="Veículos"
        description="Frota cadastrada, com status operacional e observações de manutenção."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-3.5 w-3.5" /> : <Bus className="h-3.5 w-3.5" />}
            {open ? "Fechar formulário" : "Novo veículo"}
          </Button>
        }
      />

      {open && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Cadastro de veículo</h2>
            <p className="text-xs text-muted-foreground">Preencha os dados mínimos para liberar registros operacionais.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Número do veículo">
              <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Ex.: 97021" />
            </Field>

            <Field label="Tipo / modelo">
              <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Ônibus urbano" />
            </Field>

            <Field label="Status">
              <Select value={status} onValueChange={(value) => setStatus(value as VehicleStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="manutencao">Em manutenção</SelectItem>
                  <SelectItem value="parado">Parado</SelectItem>
                  <SelectItem value="aguardando_peca">Aguardando peça</SelectItem>
                  <SelectItem value="aguardando_terceiro">Aguardando terceiro</SelectItem>
                  <SelectItem value="liberado">Liberado</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Observação">
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Observação opcional" />
            </Field>
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" /> Salvar veículo
            </Button>
          </div>
        </form>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por número do veículo…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Número</th>
              <th className="px-5 py-3 text-left font-medium">Tipo</th>
              <th className="px-5 py-3 text-left font-medium">Observação</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-5 py-3 font-medium">{v.number}</td>
                <td className="px-5 py-3 text-muted-foreground">{v.type}</td>
                <td className="px-5 py-3 text-muted-foreground">{v.note ?? "—"}</td>
                <td className="px-5 py-3"><VehicleStatusBadge status={v.status} /></td>
                <td className="px-5 py-3 text-right">
                  <Button variant="ghost" size="sm" className="gap-1.5"><Eye className="h-3.5 w-3.5" /> Detalhes</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid gap-3">
        {filtered.map((v) => (
          <div key={v.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">{v.number}</div>
              <VehicleStatusBadge status={v.status} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{v.type}</div>
            {v.note && <div className="mt-2 text-sm">{v.note}</div>}
            <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5"><Eye className="h-3.5 w-3.5" /> Ver detalhes</Button>
          </div>
        ))}
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
