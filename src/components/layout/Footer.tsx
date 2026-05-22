export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 px-6 py-4 text-xs text-muted-foreground">
      <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between">
        <div>
          DEV -{" "}
          <a
            href="https://rodrigo.run"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            rodrigo.run
          </a>{" "}
          © 2026 TopBus OS - Todos os direitos reservados
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">Protótipo Frontend</div>
      </div>
    </footer>
  );
}
