import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadBox({
  label = "Arraste arquivos ou clique para selecionar",
  hint = "PDF, planilha, imagem até 25MB",
  multiple = true,
}: {
  label?: string;
  hint?: string;
  multiple?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [hover, setHover] = useState(false);

  const onPick = (list: FileList | null) => {
    if (!list) return;
    setFiles((curr) => [...curr, ...Array.from(list)]);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          onPick(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-sm transition-colors",
          hover ? "border-primary bg-primary/5" : "border-border bg-secondary/40 hover:bg-secondary/70",
        )}
      >
        <UploadCloud className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </button>
      <input
        ref={ref}
        type="file"
        multiple={multiple}
        className="hidden"
        onChange={(e) => onPick(e.target.files)}
      />
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-xs"
            >
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => setFiles((curr) => curr.filter((_, j) => j !== i))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
