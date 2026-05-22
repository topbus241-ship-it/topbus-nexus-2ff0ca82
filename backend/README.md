# Topbus Backend (scaffold)

Este diretório contém um scaffold mínimo para o backend do Topbus.

Passos iniciais:

1. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` e `JWT_SECRET`.

2. Instale dependências (no diretório `backend`):

```bash
pnpm install
# ou
npm install
```

3. Gere o cliente Prisma e aplique migrations:

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

4. Rode o servidor em modo dev:

```bash
pnpm dev
```

Arquivos principais:
- `prisma/schema.prisma` — schema inicial gerado a partir dos tipos do frontend.

Observações:
- Essa é uma base inicial. Próximo passo: criar controllers/serviços para `auth`, `vehicles`, `damage-records`, `typebot` e `ai`.
- Preferência por usar `prisma` + `postgres` para migrações e operações seguras.
 - Uploads: existe rota `POST /api/typebot/upload` que salva arquivos localmente em `public/uploads` e cria registro em `uploadedDocument`.
 - OCR: serviço placeholder em `src/services/ocr.ts` — implementar integração com Tesseract/vision/Ollama como aprimoramento.
 - Chat público: `POST /api/typebot/init-public` inicia conversa sem login; `POST /api/typebot/public-message` envia mensagens públicas.
