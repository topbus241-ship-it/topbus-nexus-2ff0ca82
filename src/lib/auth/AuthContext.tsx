import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserRole } from "@/lib/types";

export interface SessionUser {
  name: string;
  role: UserRole;
}

interface AuthContextValue {
  user: SessionUser | null;
  login: (user: SessionUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "topbus-session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (next) => {
        setUser(next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
      },
      logout: () => {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* noop */
        }
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  master: "Master",
  manutencao: "Gestor Manutenção",
  portaria: "Portaria",
  operacao: "Operação",
  financeiro: "Financeiro",
  rh: "RH",
  abastecimento: "Abastecimento",
  frota: "Frota",
};
