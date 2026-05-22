import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, ROLE_LABEL } from "@/lib/auth/AuthContext";
import type { UserRole } from "@/lib/types";
import logo from "@/assets/topbus-logo.png";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const ROLE_OPTIONS: { role: UserRole; description: string; defaultName: string }[] = [
  { role: "master", description: "Acesso total a todos os módulos, criação de novos módulos e governança.", defaultName: "Administrador Master" },
  { role: "manutencao", description: "Avarias, serviços terceirizados, status de frota e prestadores.", defaultName: "Gestor Manutenção" },
  { role: "portaria", description: "Registro de avarias e controle de entrada/saída de veículos.", defaultName: "Operador Portaria" },
  { role: "operacao", description: "Escala operacional, linhas, rotas e motoristas.", defaultName: "Supervisor Operação" },
  { role: "financeiro", description: "Serviços terceirizados, relatórios e custos consolidados.", defaultName: "Analista Financeiro" },
  { role: "rh", description: "Cadastros, documentos e escalas de colaboradores.", defaultName: "Gestor RH" },
  { role: "abastecimento", description: "Controle de litragem, cupons e custos por veículo.", defaultName: "Operador Abastecimento" },
  { role: "frota", description: "Status da frota, veículos parados e disponibilidade.", defaultName: "Gestor Frota" },
];

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<UserRole>("master");

  const handleEnter = () => {
    const opt = ROLE_OPTIONS.find((o) => o.role === selected)!;
    login({ name: opt.defaultName, role: selected });
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left: brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 overflow-hidden">
            <img src={logo} alt="TopBus" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-wide">TopBus OS</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-sidebar-foreground/60">Plataforma operacional</div>
          </div>
        </div>

        <div className="relative max-w-md space-y-5">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Visão executiva e controle operacional em uma única plataforma.
          </h2>
          <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
            Frota, manutenção, escala, terceirizados, insights e governança de módulos —
            preparado para integração com BI, IA local e Chat Otimizado.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { k: "Setores", v: "9" },
              { k: "Módulos", v: "44" },
              { k: "Acessos", v: "8 perfis" },
            ].map((s) => (
              <div key={s.k} className="rounded-lg bg-white/5 px-3 py-2 border border-white/5">
                <div className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/55">{s.k}</div>
                <div className="mt-0.5 text-base font-semibold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-sidebar-foreground/55">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
          Protótipo frontend — autenticação JWT preparada para o backend real.
        </div>
      </div>

      {/* Right: role picker */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-xl">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sidebar overflow-hidden">
              <img src={logo} alt="TopBus" className="h-9 w-9 object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold">TopBus OS</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Plataforma operacional</div>
            </div>
          </div>

          <div className="mb-7">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-2">Acesso</div>
            <h1 className="text-[26px] sm:text-3xl font-semibold tracking-tight">Entrar na plataforma</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Selecione o perfil de acesso para visualizar a navegação correspondente.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5 mb-6 max-h-[420px] sm:max-h-none overflow-auto pr-1">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.role}
                type="button"
                onClick={() => setSelected(opt.role)}
                className={cn(
                  "text-left rounded-lg border p-3.5 transition-all",
                  selected === opt.role
                    ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{ROLE_LABEL[opt.role]}</div>
                  <span className={cn("h-2 w-2 rounded-full", selected === opt.role ? "bg-primary" : "bg-border")} />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
              </button>
            ))}
          </div>

          <Button onClick={handleEnter} className="w-full gap-2" size="lg">
            Entrar como {ROLE_LABEL[selected]}
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Button>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            DEV -{" "}
            <a href="https://rodrigo.run" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary underline-offset-4 hover:underline">
              rodrigo.run
            </a>{" "}
            © 2026 TopBus OS
          </p>
        </div>
      </div>
    </div>
  );
}
