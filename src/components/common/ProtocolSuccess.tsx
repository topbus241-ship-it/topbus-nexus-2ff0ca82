import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Download, Home } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

interface ProtocolSuccessProps {
  protocol: string;
  moduleType: "servico-terceirizado" | "avaria";
  collaboratorName?: string;
  collaboratorId?: string;
  onReset?: () => void;
}

export function ProtocolSuccess({
  protocol,
  moduleType,
  collaboratorName = "Colaborador",
  collaboratorId = "N/A",
  onReset,
}: ProtocolSuccessProps) {
  const moduleName =
    moduleType === "servico-terceirizado"
      ? "Serviço Terceirizado"
      : "Avaria / Portaria";

  const moduleDescription =
    moduleType === "servico-terceirizado"
      ? "O serviço foi registrado com sucesso. Use este protocolo para acompanhar o andamento da execução."
      : "A avaria foi registrada com sucesso. Use este protocolo como comprovante de registro.";

  const handleCopy = () => {
    navigator.clipboard.writeText(protocol);
    toast.success("Protocolo copiado!", {
      description: "Compartilhe com seu supervisor ou para referência futura.",
    });
  };

  const handleDownload = () => {
    const content = `PROTOCOLO DE REGISTRO ${moduleType === "servico-terceirizado" ? "DE SERVIÇO" : "DE AVARIA"}

Módulo: ${moduleName}
Protocolo: ${protocol}

Informações do Colaborador:
- Nome: ${collaboratorName}
- ID/Matrícula: ${collaboratorId}

Data/Hora: ${new Date().toLocaleString("pt-BR")}

Este protocolo deve ser mantido para referência e acompanhamento.
${moduleType === "servico-terceirizado" 
  ? "Use-o para acompanhar o progresso do serviço solicitado." 
  : "Use-o como comprovante de registro da avaria."}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `protocolo-${protocol}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success("Protocolo baixado!", {
      description: "Arquivo salvo com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-green-200 bg-white p-8 sm:p-10 shadow-sm">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-10 w-10 text-green-600" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title & Module Type */}
          <h1 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-2">
            Registro realizado com sucesso!
          </h1>
          <p className="text-center text-sm text-slate-600 mb-8">
            {moduleDescription}
          </p>

          {/* Protocol Section */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 sm:p-8 mb-8 border border-slate-200">
            <div className="text-center mb-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                {moduleName}
              </p>
              <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900 break-all">
                {protocol}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 mt-6">
              <div className="rounded-lg bg-white px-4 py-3 text-center border border-slate-200">
                <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">
                  Colaborador
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {collaboratorName}
                </p>
              </div>
              <div className="rounded-lg bg-white px-4 py-3 text-center border border-slate-200">
                <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">
                  ID / Matrícula
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {collaboratorId}
                </p>
              </div>
              <div className="rounded-lg bg-white px-4 py-3 text-center border border-slate-200">
                <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">
                  Data/Hora
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date().toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <Copy className="h-4 w-4" />
              Copiar protocolo
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <Download className="h-4 w-4" />
              Baixar arquivo
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              asChild
              size="lg"
              className="gap-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Ir para a home
              </Link>
            </Button>
            {onReset && (
              <Button
                onClick={onReset}
                variant="secondary"
                size="lg"
              >
                Novo registro
              </Button>
            )}
          </div>

          {/* Footer Message */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
            <a
              href="https://rodrigo.run"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition uppercase tracking-[0.12em]"
            >
              DEV: rodrigo.run
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
