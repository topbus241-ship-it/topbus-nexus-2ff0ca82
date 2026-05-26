import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth, ROLE_LABEL } from "@/lib/auth/AuthContext";
import type { UserRole } from "@/lib/types";
import logo from "@/assets/topbus-logo.png";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const VISIBLE_ROLE_OPTIONS = ROLE_OPTIONS.filter((opt) => opt.role !== "master");

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<UserRole>(VISIBLE_ROLE_OPTIONS[0].role);
  const [name, setName] = useState(VISIBLE_ROLE_OPTIONS[0].defaultName);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [executiveMode, setExecutiveMode] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const selectedOption = ROLE_OPTIONS.find((o) => o.role === selected);
    if (selectedOption) {
      setName(selectedOption.defaultName);
    }
  }, [selected]);

  const handleEnter = () => {
    setLoginError("");
    const loginRole = executiveMode ? "master" : selected;
    const payload = {
      name: executiveMode ? name.trim() || "Administrador Master" : name,
      email: email.trim() || undefined,
      role: loginRole,
      password: executiveMode ? password : undefined,
    };
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        if (!r.ok) {
          const message = await r.text().catch(() => "");
          throw new Error(message || "login_failed");
        }

        return r.json();
      })
      .then((data) => {
        if (executiveMode && data?.user?.role !== "master") {
          throw new Error("invalid_master_role");
        }

        login(
          {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          },
          data.token,
        );

        navigate({ to: '/' });
      })
      .catch(() => {
        if (executiveMode) {
          setLoginError("Acesso executivo não autorizado. Verifique email e senha master.");
          return;
        }

        setLoginError("Não foi possível autenticar este perfil. Verifique os dados e tente novamente.");
      });
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
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-2">Acesso seguro</div>
            <h1 className="text-[26px] sm:text-3xl font-semibold tracking-tight">Entrar na plataforma</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
              Informe o nome do colaborador e escolha rapidamente o perfil. Menos foco nas opções visíveis, mais clareza no acesso.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground">Nome do colaborador</label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder="Nome completo ou matrícula"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">Email (opcional)</label>
              <input
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder="email@empresa.com"
              />
            </div>

            {executiveMode && (
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-semibold text-foreground">Senha executiva</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="Senha autorizada"
                />
              </div>
            )}

            {!executiveMode && (
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-semibold text-foreground">Perfil de acesso</label>
                <Select value={selected} onValueChange={(value) => {
                  setSelected(value as UserRole);
                  const selectedOption = ROLE_OPTIONS.find((o) => o.role === value);
                  if (selectedOption) setName(selectedOption.defaultName);
                }}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Escolher perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIBLE_ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.role} value={opt.role}>
                        {ROLE_LABEL[opt.role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {loginError && (
            <div className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {loginError}
            </div>
          )}

          <Button onClick={handleEnter} className="w-full gap-2" size="lg">
            Acessar como {executiveMode ? "Acesso executivo" : ROLE_LABEL[selected]}
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Button>

          <button
            type="button"
            onClick={() => {
              setExecutiveMode((current) => {
                const next = !current;
                if (next) {
                  setName("Administrador Master");
                  setEmail("");
                  setPassword("");
                }
                return next;
              });
            }}
            className="mt-4 w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition"
          >
            {executiveMode ? "Voltar aos perfis operacionais" : "Acesso executivo"}
          </button>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Seleção rápida com os perfis mais comuns. Perfis adicionais ficam disponíveis apenas via login autorizado.
          </p>

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
