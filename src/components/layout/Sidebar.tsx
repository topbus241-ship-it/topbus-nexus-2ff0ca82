import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Search } from "lucide-react";
import { useAuth, ROLE_LABEL } from "@/lib/auth/AuthContext";
import { navForRole, type NavItem } from "@/lib/nav";
import logo from "@/assets/topbus-logo.png";
import { cn } from "@/lib/utils";

const GROUP_ORDER = ["Visão geral", "Operação", "Manutenção", "Gestão", "Plataforma"] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const filtered = navForRole(user.role).filter((i) =>
    query.trim() === "" ? true : i.label.toLowerCase().includes(query.toLowerCase()),
  );

  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: filtered.filter((i) => i.group === g),
  })).filter((g) => g.items.length > 0);

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 overflow-hidden shrink-0">
          <img src={logo} alt="TopBus" className="h-9 w-9 object-contain" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide">TopBus OS</div>
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-sidebar-foreground/55">
            Operational Platform
          </div>
        </div>
      </div>

      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-md bg-white/[0.04] border border-white/[0.06] px-2.5 py-1.5 focus-within:border-sidebar-primary/40 transition-colors">
          <Search className="h-3.5 w-3.5 text-sidebar-foreground/55" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar módulo…"
            className="flex-1 bg-transparent text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/40 outline-none"
          />
          <kbd className="hidden sm:inline-flex text-[10px] text-sidebar-foreground/40 px-1 py-0.5 rounded border border-white/[0.06]">⌘K</kbd>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {grouped.map(({ group, items: groupItems }) => {
          const isCollapsed = collapsed[group];
          return (
            <div key={group}>
              <button
                onClick={() => setCollapsed((p) => ({ ...p, [group]: !p[group] }))}
                className="flex w-full items-center justify-between px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45 hover:text-sidebar-foreground/70 transition-colors"
              >
                <span>{group}</span>
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform", isCollapsed && "-rotate-90")}
                  strokeWidth={1.75}
                />
              </button>
              {!isCollapsed && (
                <ul className="space-y-0.5">
                  {groupItems.map((it) => (
                    <SidebarItem
                      key={it.to}
                      item={it}
                      active={location.pathname === it.to}
                      onClick={onNavigate}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {grouped.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-sidebar-foreground/45">
            Nenhum módulo encontrado.
          </div>
        )}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3.5">
        <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/45">
          Perfil ativo
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-7 w-7 shrink-0 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-[11px] font-semibold text-sidebar-primary">
            {user.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium truncate">{user.name}</div>
            <div className="text-[10.5px] text-sidebar-foreground/55 truncate">
              {ROLE_LABEL[user.role]}
            </div>
          </div>
        </div>
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
          "group relative flex items-center gap-3 rounded-md pl-3 pr-2.5 py-2 text-[13px] transition-all",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/72 hover:bg-sidebar-accent/55 hover:text-sidebar-accent-foreground",
        )}
      >
        <span
          className={cn(
            "absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-r-full transition-all",
            active ? "bg-sidebar-primary" : "bg-transparent group-hover:bg-sidebar-primary/30",
          )}
        />
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            active ? "text-sidebar-primary" : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground",
          )}
          strokeWidth={1.75}
        />
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}
