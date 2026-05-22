import { Link, useLocation } from "@tanstack/react-router";
import { useAuth, ROLE_LABEL } from "@/lib/auth/AuthContext";
import { navForRole, type NavItem } from "@/lib/nav";
import logo from "@/assets/topbus-logo.png";
import { cn } from "@/lib/utils";

const GROUP_ORDER = ["Visão geral", "Operação", "Manutenção", "Gestão", "Plataforma"] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;

  const items = navForRole(user.role);
  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: items.filter((i) => i.group === g),
  })).filter((g) => g.items.length > 0);

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 overflow-hidden shrink-0">
          <img src={logo} alt="TopBus" className="h-9 w-9 object-contain" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide">TopBus OS</div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/60">Operational Platform</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {grouped.map(({ group, items: groupItems }) => (
          <div key={group}>
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
              {group}
            </div>
            <ul className="space-y-0.5">
              {groupItems.map((it) => (
                <SidebarItem key={it.to} item={it} active={location.pathname === it.to} onClick={onNavigate} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/50">Perfil ativo</div>
        <div className="mt-1 text-sm font-medium">{ROLE_LABEL[user.role]}</div>
        <div className="text-xs text-sidebar-foreground/60 truncate">{user.name}</div>
      </div>
    </aside>
  );
}

function SidebarItem({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        to={item.to}
        onClick={onClick}
        className={cn(
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", active ? "text-sidebar-primary" : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground")} strokeWidth={1.75} />
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}
