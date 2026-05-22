import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserRole } from "@/lib/types";

export interface SessionUser {
  id?: string;
  name: string;
  email?: string;
  role: UserRole;
}

interface AuthContextValue {
  user: SessionUser | null | undefined;
  login: (user: SessionUser, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "topbus-session";
const TOKEN_KEY = "topbus-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (next, token) => {
        setUser(next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          if (token) localStorage.setItem(TOKEN_KEY, token);
        } catch {
          /* noop */
        }
      },
      logout: () => {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
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
