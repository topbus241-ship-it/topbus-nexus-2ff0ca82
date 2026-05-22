import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormSection } from "@/components/forms/FormSection";
import { UploadBox } from "@/components/forms/UploadBox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUploadedDocuments } from "@/lib/api/mockApi";
import { Send, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/relatorios")({
  component: RelatoriosPage,
});

const TYPES = ["PDF", "Planilha", "Foto", "Relatório operacional", "Documento RH", "Orçamento", "Comprovante"];
const SECTORS = ["Manutenção", "Operação", "Frota", "RH", "Financeiro", "Portaria", "Abastecimento", "Terceirizados"];

function RelatoriosPage() {
  const { data: docs = [] } = useQuery({ queryKey: ["docs"], queryFn: getUploadedDocuments });

  return (
    <AppLayout>
      <PageHeader
        breadcrumb="Gestão"
        title="Upload de Relatórios"
        description="Envie documentos por setor e tipo. A integração com o backend está preparada."
      />

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Envio simulado", { description: "Documento enviado para conferência." });
        }}
      >
        <FormSection title="Destino do documento" description="Setor e tipo definem como o documento é roteado.">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Setor">
              <Select defaultValue="Manutenção">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Tipo de documento">
              <Select defaultValue="PDF">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Arquivos" description="Arraste e solte ou clique para selecionar.">
          <UploadBox />
          <Field label="Observação"><Textarea rows={3} placeholder="Contexto, vinculação a registro, prazo." /></Field>
          <div className="flex justify-end">
            <Button type="submit" className="gap-2"><Send className="h-4 w-4" /> Enviar</Button>
          </div>
        </FormSection>
      </form>

      <section className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold">Documentos enviados</h2>
        </div>
        <ul className="divide-y divide-border">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between px-5 py-3.5 gap-4">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{d.fileName}</div>
                <div className="text-xs text-muted-foreground">{d.sector} • {d.documentType} • {d.uploadedAt}</div>
              </div>
              <div className="text-xs text-muted-foreground">por {d.uploadedBy}</div>
            </li>
          ))}
        </ul>
      </section>
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
