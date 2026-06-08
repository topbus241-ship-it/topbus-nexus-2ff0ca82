import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center px-3 py-6 sm:px-4 sm:py-12">
      <div className="w-full max-w-5xl">
        <header className="rounded-lg border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Módulos de preenchimento</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Operacional</h1>
        </header>

        <section className="mt-6 grid gap-3 grid-cols-1 md:grid-cols-2">
          <ModuleCard
            icon={Wrench}
            title="Serviço Terceirizado"
            href="/servico-terceirizado"
          />
          <ModuleCard
            icon={ShieldAlert}
            title="Avaria / Portaria"
            href="/avaria"
          />
        </section>

        <footer className="mt-8 text-center text-xs sm:text-sm text-slate-500">
          <p>Uso restrito a colaboradores autorizados.</p>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mt-4 text-slate-600 hover:text-slate-900"
          >
            <Link to="/login">Acesso administrativo</Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  href,
}: {
  icon: typeof Wrench;
  title: string;
  href: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 flex-shrink-0">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-1 text-xs text-slate-600">Realizar preenchimento para a demanda</p>
        </div>
      </div>

      <div className="mt-4">
        <Button asChild size="sm" variant="secondary" className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 text-xs">
          <Link to={href}>Iniciar</Link>
        </Button>
      </div>
    </article>
  );
}
