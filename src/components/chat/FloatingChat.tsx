import { useState } from "react";
import { MessageSquare, X, ExternalLink, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAT_URL = import.meta.env.VITE_APPBUS_CHAT_URL || "https://chat.appbus.online";

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Fechar Chat AppBus" : "Abrir Chat AppBus"}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all",
          "bg-primary text-primary-foreground hover:scale-105 active:scale-95",
          "ring-4 ring-primary/15",
        )}
      >
        {open ? <X className="h-5 w-5" strokeWidth={2} /> : <MessageSquare className="h-5 w-5" strokeWidth={2} />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-success ring-2 ring-card" />
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "fixed z-50 overflow-hidden border border-border bg-card shadow-2xl",
            "bottom-0 right-0 left-0 h-[85vh] rounded-t-2xl",
            "sm:top-20 sm:bottom-20 sm:right-5 sm:left-auto sm:h-auto sm:w-[420px] sm:max-w-[calc(100vw-2.5rem)] sm:rounded-2xl",
          )}
        >
          <div className="flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <MessageSquare className="h-4 w-4" strokeWidth={1.75} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">Chat AppBus</div>
              <div className="flex items-center gap-1.5 text-[11px] text-sidebar-foreground/70">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
                Atendimento operacional por fluxo guiado
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIframeKey((value) => value + 1)}
              className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
              aria-label="Recarregar chat"
              title="Recarregar chat"
            >
              <RefreshCcw className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <a
              href={CHAT_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
              aria-label="Abrir chat em nova aba"
              title="Abrir chat em nova aba"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            </a>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <iframe
            key={iframeKey}
            src={CHAT_URL}
            title="Chat AppBus"
            className="h-[calc(100%-58px)] w-full border-0 bg-background"
            allow="camera; microphone; geolocation; clipboard-read; clipboard-write"
          />
        </div>
      )}
    </>
  );
}
