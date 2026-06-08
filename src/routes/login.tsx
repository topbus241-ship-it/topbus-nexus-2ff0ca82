import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth, ROLE_LABEL } from "@/lib/auth/AuthContext";
import type { UserRole } from "@/lib/types";
import logo from "@/assets/topbus-logo.png";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const ROLE_OPTIONS: { role: UserRole; defaultName: string }[] = [
  { role: "master", defaultName: "Administrador Master" },
  { role: "manutencao", defaultName: "Gestor Manutenção" },
  { role: "portaria", defaultName: "Operador Portaria" },
  { role: "operacao", defaultName: "Supervisor Operação" },
  { role: "financeiro", defaultName: "Analista Financeiro" },
  { role: "rh", defaultName: "Gestor RH" },
  { role: "abastecimento", defaultName: "Operador Abastecimento" },
  { role: "frota", defaultName: "Gestor Frota" },
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
      .then(async (response) => {
        if (!response.ok) {
          const message = await response.text().catch(() => "");
          throw new Error(message || "login_failed");
        }
        return response.json();
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
        setLoginError(
          executiveMode
            ? "Acesso executivo não autorizado. Verifique email e senha master."
            : "Não foi possível autenticar este perfil. Verifique os dados e tente novamente.",
        );
      });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-6 sm:py-10">
      <Button
        onClick={() => window.history.back()}
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
      >
        ← Voltar
      </Button>

      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 sm:p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl bg-muted-foreground/10">
            <img src={logo} alt="AppBus Online" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.20em] text-muted-foreground">AppBus Online</p>
            <p className="text-xs font-medium text-foreground">Plataforma operacional</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.20em] text-muted-foreground">Acesso restrito</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Entrar</h1>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Selecione seu departamento e continue.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-foreground">Nome</label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="Nome completo ou matrícula"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground">Email</label>
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="email@empresa.com"
            />
          </div>

          {!executiveMode && (
            <div className="grid gap-1.5">
              <label htmlFor="role" className="text-xs font-semibold text-foreground">Departamento</label>
              <Select
                value={selected}
                onValueChange={(value) => {
                  setSelected(value as UserRole);
                  const selectedOption = ROLE_OPTIONS.find((o) => o.role === value);
                  if (selectedOption) setName(selectedOption.defaultName);
                }}
              >
                <SelectTrigger id="role" className="rounded-lg">
                  <SelectValue placeholder="Escolher departamento" />
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

          {executiveMode && (
            <div className="grid gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-foreground">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder="Senha autorizada"
              />
            </div>
          )}
        </div>

        {loginError && (
          <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {loginError}
          </div>
        )}

        <div className="mt-4 grid gap-2">
          <Button onClick={handleEnter} className="w-full gap-2" size="sm">
            {executiveMode ? "Entrar como executivo" : `Entrar como ${ROLE_LABEL[selected]}`}
            <ArrowRight className="h-3.5 w-3.5" />
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
            className="text-center text-xs text-muted-foreground transition hover:text-foreground"
          >
            {executiveMode ? "Voltar ao acesso comum" : "Usar acesso executivo"}
          </button>
        </div>

        <div className="mt-4 border-t border-border/60 pt-3 text-center text-[10px] text-muted-foreground">
          <a
            href="https://rodrigo.run"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition uppercase tracking-[0.12em]"
          >
            DEV: rodrigo.run
          </a>
        </div>
      </div>
    </div>
  );
}
