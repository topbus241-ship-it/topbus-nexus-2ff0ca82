import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { findScheduleByChapaDateTime } from "@/lib/api/mockApi";
import type { Schedule } from "@/lib/types";
import { CalendarClock, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/escala")({
  component: EscalaPage,
});

function EscalaPage() {
  const [chapa, setChapa] = useState("9718482");
  const [date, setDate] = useState("30/04/2026");
  const [time, setTime] = useState("07:20");
  const [result, setResult] = useState<Schedule | null | "empty">("empty");
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    setLoading(true);
    const res = await findScheduleByChapaDateTime(chapa, date, time);
    setResult(res);
    setLoading(false);
  };

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Operação"
        title="Escala Operacional"
        description="Consulte a escala pela chapa, data e hora — sem preenchimento manual."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold">Buscar escala</h2>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="chapa" className="text-xs">Chapa</Label>
              <Input id="chapa" value={chapa} onChange={(e) => setChapa(e.target.value)} placeholder="Ex.: 9718482" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date" className="text-xs">Data</Label>
                <Input id="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <Label htmlFor="time" className="text-xs">Hora</Label>
                <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="hh:mm" />
              </div>
            </div>
            <Button onClick={onSearch} className="w-full gap-2" disabled={loading}>
              <Search className="h-4 w-4" /> {loading ? "Buscando…" : "Buscar escala"}
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Dica: a busca por chapa elimina retrabalho operacional e padroniza o preenchimento de avarias e serviços.
          </p>
        </section>

        <section>
          {result === "empty" ? (
            <EmptyState
              icon={CalendarClock}
              title="Pronto para buscar"
              description="Informe chapa, data e hora para visualizar o motorista, veículo, linha e rota correspondentes."
            />
          ) : result === null ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <div className="text-sm font-semibold">Nenhuma escala encontrada</div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Verifique chapa, data e hora. A demonstração usa: 9718482 • 30/04/2026 • 07:20.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-success/30 bg-success/5 p-5">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" />
                <div className="text-sm font-semibold">Escala localizada</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Field label="Motorista" value={result.driverName} />
                <Field label="Chapa" value={result.chapa} />
                <Field label="Veículo" value={result.vehicleNumber} />
                <Field label="Linha" value={result.line} />
                <Field label="Rota" value={result.routeName} />
                <Field label="Quando" value={`${result.date} ${result.time}`} />
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}
