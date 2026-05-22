import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

export const Route = createFileRoute('/typebot-config')({ component: TypebotConfigPage });

function TypebotConfigPage() {
  const { user } = useAuth();
  const [sectorId, setSectorId] = useState('manutencao');
  const [label, setLabel] = useState('Fluxo padrão');
  const [buttonsJson, setButtonsJson] = useState('[{"label":"Registrar avaria","next":"avaria"},{"label":"Enviar documento","next":"doc"}]');

  const handleSave = async () => {
    if (!user) return toast.error('Você precisa estar logado como master');
    const token = localStorage.getItem('topbus-token');
    try {
      const buttons = JSON.parse(buttonsJson);
      const res = await fetch('/api/typebot/config', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ sectorId, label, buttons }) });
      if (!res.ok) throw new Error('fail');
      const json = await res.json();
      toast.success('Configuração salva');
    } catch (err) {
      toast.error('Falha ao salvar configuração (verifique JSON)');
    }
  };

  return (
    <AppLayout>
      <PageHeader breadcrumb="Config" title="Configurar Chat" description="Defina botões e fluxos por setor (master)." />

      <div className="p-6">
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm">Sector ID</label>
            <input value={sectorId} onChange={(e) => setSectorId(e.target.value)} className="w-full rounded-md border p-2" />
          </div>
          <div>
            <label className="block text-sm">Label</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-md border p-2" />
          </div>
          <div>
            <label className="block text-sm">Buttons JSON</label>
            <textarea value={buttonsJson} onChange={(e) => setButtonsJson(e.target.value)} className="w-full rounded-md border p-2 h-40" />
            <div className="text-xs text-muted-foreground mt-1">JSON array: [{`{"label":"Registrar avaria","next":"avaria"}`}]</div>
          </div>

          <div>
            <Button onClick={handleSave}>Salvar configuração</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
