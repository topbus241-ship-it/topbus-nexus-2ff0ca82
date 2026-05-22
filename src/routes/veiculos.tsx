import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { VehicleStatusBadge } from "@/components/common/StatusBadge";
import { getVehicles } from "@/lib/api/mockApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Bus } from "lucide-react";
import type { VehicleStatus } from "@/lib/types";

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
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: getVehicles });
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesQ = q.trim().length === 0 || v.number.includes(q.trim());
      const matchesF = filter === "all" || v.status === filter;
      return matchesQ && matchesF;
    });
  }, [vehicles, q, filter]);

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Operação"
        title="Veículos"
        description="Frota cadastrada, com status operacional e observações de manutenção."
        actions={<Button size="sm" className="gap-1.5"><Bus className="h-3.5 w-3.5" /> Novo veículo</Button>}
      />

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

      {/* Desktop table */}
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

      {/* Mobile cards */}
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
