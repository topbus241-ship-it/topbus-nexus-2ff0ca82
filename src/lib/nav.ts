import type { UserRole } from "@/lib/types";
import {
  LayoutDashboard,
  Layers,
  Bus,
  Users,
  Wrench,
  Map,
  CalendarClock,
  ClipboardList,
  ShieldAlert,
  Gauge,
  UploadCloud,
  Boxes,
  Sparkles,
  Settings,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[] | "all";
  group: "Visão geral" | "Operação" | "Manutenção" | "Gestão" | "Plataforma";
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: "all", group: "Visão geral" },
  { to: "/setores", label: "Setores", icon: Layers, roles: ["master"], group: "Visão geral" },

  { to: "/veiculos", label: "Veículos", icon: Bus, roles: ["master", "portaria", "frota", "manutencao", "operacao"], group: "Operação" },
  { to: "/motoristas", label: "Motoristas", icon: Users, roles: ["master", "operacao", "rh"], group: "Operação" },
  { to: "/linhas-rotas", label: "Linhas e Rotas", icon: Map, roles: ["master", "operacao"], group: "Operação" },
  { to: "/escala", label: "Escala Operacional", icon: CalendarClock, roles: ["master", "operacao", "portaria"], group: "Operação" },

  { to: "/avaria", label: "Avaria / Portaria", icon: ShieldAlert, roles: ["master", "portaria", "manutencao"], group: "Manutenção" },
  { to: "/servico-terceirizado", label: "Serviço Terceirizado", icon: Wrench, roles: ["master", "manutencao", "financeiro"], group: "Manutenção" },
  { to: "/prestadores", label: "Prestadores", icon: ClipboardList, roles: ["master", "manutencao", "financeiro"], group: "Manutenção" },
  { to: "/status-frota", label: "Status de Frota", icon: Gauge, roles: ["master", "portaria", "manutencao", "frota"], group: "Manutenção" },

  { to: "/relatorios", label: "Upload de Relatórios", icon: UploadCloud, roles: "all", group: "Gestão" },
  { to: "/insights", label: "Insights / IA", icon: Sparkles, roles: ["master", "manutencao", "financeiro", "operacao"], group: "Gestão" },

  { to: "/criador-modulos", label: "Criador de Módulos", icon: Boxes, roles: ["master"], group: "Plataforma" },
  { to: "/typebot", label: "Chat Otimizado", icon: MessageSquare, roles: "all", group: "Plataforma" },
  { to: "/configuracoes", label: "Configurações", icon: Settings, roles: "all", group: "Plataforma" },
];

export function navForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((it) => it.roles === "all" || it.roles.includes(role));
}
