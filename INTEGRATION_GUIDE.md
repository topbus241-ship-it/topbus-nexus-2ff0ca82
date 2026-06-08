# Instruções de Integração - PhotoCaptureBox e Créditos

## Status de Implementação

### ✅ Concluído:
1. **PhotoCaptureBox Component** (`src/components/forms/PhotoCaptureBox.tsx`)
   - Câmera com acesso via `getUserMedia` API
   - Galeria via `capture="environment"`
   - Upload de arquivos
   - GPS automático via Geolocation API
   - Campo manual de localização
   - Sem erros de compilação

### ⏳ Pendente (Instruções):

## 1. Adicionar Créditos na Home (`src/routes/index.tsx`)

**Localizar a seção:**
```jsx
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
```

**Substituir por:**
```jsx
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
          <div className="mt-6 pt-4 border-t border-slate-200">
            <a
              href="https://rodrigo.run"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition text-[11px] uppercase tracking-[0.12em]"
            >
              DEV: rodrigo.run
            </a>
          </div>
        </footer>
```

---

## 2. Integrar PhotoCaptureBox em Avaria (`src/routes/avaria.tsx`)

**Adicionar import no topo:**
```jsx
import { PhotoCaptureBox } from "@/components/forms/PhotoCaptureBox";
```

**Localizar a seção de "Foto de comprovação":**
```jsx
          <FormSection title="Foto de comprovação" description="Foto ANTES da avaria para comparativo com a conclusão.">
            <div className="grid gap-3 sm:grid-cols-1">
              <div>
                <Label className="text-xs mb-1.5 block">Foto ANTES (situação atual)</Label>
                <UploadBox label="Adicionar foto antes" hint="JPG ou PNG" multiple={false} />
              </div>
            </div>
          </FormSection>
```

**Substituir `UploadBox` por `PhotoCaptureBox`:**
```jsx
          <FormSection title="Foto de comprovação" description="Foto ANTES da avaria para comparativo com a conclusão.">
            <PhotoCaptureBox
              label="Câmera ou galeria"
              hint="JPG ou PNG"
              showLocation={true}
            />
          </FormSection>
```

---

## 3. Integrar PhotoCaptureBox em Serviço Terceirizado (`src/routes/servico-terceirizado.tsx`)

**Adicionar import no topo:**
```jsx
import { PhotoCaptureBox } from "@/components/forms/PhotoCaptureBox";
```

**Localizar a seção de "Foto de referência":**
```jsx
          <FormSection title="Foto de referência" description="Foto ANTES da execução do serviço para comparativo com a conclusão.">
            <div className="grid gap-3 sm:grid-cols-1">
              <div>
                <Label className="text-xs mb-1.5 block">Foto ANTES (situação atual)</Label>
                <UploadBox label="Adicionar foto antes" hint="JPG ou PNG" multiple={false} />
              </div>
            </div>
          </FormSection>
```

**Substituir por:**
```jsx
          <FormSection title="Foto de referência" description="Foto ANTES da execução do serviço para comparativo com a conclusão.">
            <PhotoCaptureBox
              label="Câmera ou galeria"
              hint="JPG ou PNG"
              showLocation={false}
            />
          </FormSection>
```

---

## 4. Banco de Dados - Campos a Adicionar

### Tabela: service_requests (Serviço Terceirizado)
```sql
ALTER TABLE service_requests ADD COLUMN (
  photo_before_url VARCHAR(500),
  photo_before_filename VARCHAR(255),
  photo_before_captured_at TIMESTAMP
);
```

### Tabela: damage_reports (Avaria)
```sql
ALTER TABLE damage_reports ADD COLUMN (
  photo_before_url VARCHAR(500),
  photo_before_filename VARCHAR(255),
  photo_before_captured_at TIMESTAMP,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_accuracy FLOAT,
  location_manual VARCHAR(255),
  location_captured_at TIMESTAMP
);
```

---

## 5. Próximos Passos

1. ✅ Aplicar as edições acima nos arquivos
2. ✅ Testar câmera em dispositivo mobile
3. ✅ Testar GPS automático
4. ✅ Executar: `npm run build` para validar
5. ✅ Fazer commit das mudanças

---

## PhotoCaptureBox Features

### Props:
- `label?: string` - Texto do botão principal
- `hint?: string` - Dica de formato
- `onPhotoCapture?: (file, location) => void` - Callback ao capturar
- `showLocation?: boolean` - Mostrar botão GPS e campos de localização

### Funcionalidades:
- 📷 Câmera com preview em tempo real
- 🖼️ Galeria (captura do dispositivo)
- 📤 Upload de arquivo
- 📍 GPS automático com precisão
- ✍️ Campo manual de localização
- 📱 Totalmente responsivo e mobile-first
- ♿ Acessível

---

## Segurança & Performance

- Fotos armazenadas com hash de timestamp
- Localização apenas com consentimento do usuário
- Compressão de imagem via Canvas API
- Suporte a HTTPS (requerido para câmera)

---

## Validação de Compilação

Após aplicar as mudanças:

```bash
npm run build
```

Todos os arquivos devem compilar sem erros.

