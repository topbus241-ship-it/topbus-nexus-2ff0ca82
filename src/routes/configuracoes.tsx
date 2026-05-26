import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth, ROLE_LABEL } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Lock, Database, Cpu } from "lucide-react";
import { isMockModeEnabled, setMockMode } from "@/lib/api/mockMode";

export const Route = createFileRoute("/configuracoes")({
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { user } = useAuth();
  const [mockMode, setMockModeState] = useState(false);

  useEffect(() => {
    setMockModeState(isMockModeEnabled());
  }, []);

  const handleMockModeChange = (checked: boolean) => {
    setMockMode(checked);
    setMockModeState(checked);
    window.location.reload();
  };

  return (
    <AppLayout>
      <PageHeader breadcrumb="Plataforma" title="Configurações" description="Preferências da plataforma, integrações e segurança." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card icon={Settings} title="Perfil">
          <Row label="Nome"><Input defaultValue={user?.name} /></Row>
          <Row label="Perfil de acesso"><Input value={user ? ROLE_LABEL[user.role] : ""} readOnly /></Row>
          <Row label="E-mail"><Input value={user?.email ?? ""} readOnly placeholder="Email não informado" /></Row>
        </Card>

        <Card icon={Bell} title="Notificações">
          <Toggle label="Avarias críticas" hint="Receber alerta imediato" defaultChecked />
          <Toggle label="Serviços aguardando conferência" defaultChecked />
          <Toggle label="Documentos pendentes" />
          <Toggle label="Insights da IA" defaultChecked />
        </Card>

        <Card icon={Lock} title="Segurança">
          <Toggle label="Autenticação em dois fatores" hint="Recomendado para perfis Master" />
          <Toggle label="Sessão expira em 8h" defaultChecked />
          <Button variant="outline" size="sm" className="w-fit">Encerrar todas as sessões</Button>
        </Card>


        {user?.role === "master" && (
          <Card icon={Database} title="Modo de dados">
            <Toggle
              label="Mocks demonstrativos"
              hint={mockMode ? "Ativo: o painel usa dados simulados para apresentação." : "Inativo: o painel usa os dados reais do backend."}
              checked={mockMode}
              onCheckedChange={handleMockModeChange}
            />
          </Card>
        )}

        <Card icon={Database} title="Integrações">
          <Toggle label="Backend + banco de dados" hint="Pronto para conexão" />
          <Toggle label="BI externo" hint="Endpoint de leitura preparado" />
          <Toggle label="Drive corporativo" hint="Para uploads centralizados" />
        </Card>

        <Card icon={Cpu} title="IA local">
          <Toggle label="Habilitar Ollama / Mistral" hint="Roteamento da IA local" />
          <Row label="Endpoint"><Input placeholder="http://10.0.0.10:11434" /></Row>
        </Card>
      </div>
    </AppLayout>
  );
}

function Card({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="p-5 space-y-3 flex flex-col">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  hint,
  defaultChecked,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-card px-3 py-2">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <Switch defaultChecked={defaultChecked} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
