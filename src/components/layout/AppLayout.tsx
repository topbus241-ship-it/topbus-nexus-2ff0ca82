import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, LogOut, Search, Bell } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth, ROLE_LABEL } from "@/lib/auth/AuthContext";

export function AppLayout({
  children,
  allowUnauthenticated = false,
}: {
  children: ReactNode;
  allowUnauthenticated?: boolean;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (user === null && !allowUnauthenticated) {
      navigate({ to: "/login" });
    }
  }, [user, allowUnauthenticated, navigate]);

  if (user === undefined && !allowUnauthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const showGuestView = !user && allowUnauthenticated;
  const showSidebar = !showGuestView;
  const showUserPanel = !!user;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      {showSidebar && (
        <div className="hidden lg:flex w-72 shrink-0 border-r border-sidebar-border">
          <Sidebar />
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 backdrop-blur px-4 sm:px-6">
          {showSidebar && (
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" strokeWidth={1.75} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-0">
                <Sidebar onNavigate={() => setDrawerOpen(false)} />
              </SheetContent>
            </Sheet>
          )}

          {showSidebar ? (
            <div className="hidden md:flex items-center gap-2 max-w-md flex-1">
              <div className="flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground">
                <Search className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs">Buscar veículo, motorista, registro…</span>
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-2">
            {showUserPanel ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" strokeWidth={1.75} />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
                </Button>
                <div className="hidden sm:flex flex-col items-end leading-tight pr-1">
                  <span className="text-xs font-medium">{user.name}</span>
                  {user.role !== "master" ? (
                    <span className="text-[11px] text-muted-foreground">{ROLE_LABEL[user.role]}</span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">Acesso executivo</span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                  <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">Acesso público</span>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-5 lg:px-6 lg:py-6 max-w-[1360px] w-full mx-auto">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
