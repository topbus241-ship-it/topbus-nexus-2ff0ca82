# TopBus OS — Frontend (Protótipo)

Plataforma operacional modular para empresas de ônibus urbano. Este repositório contém o **frontend premium navegável** com dados mockados, pronto para integração com backend real.

## Como rodar

```bash
bun install
bun run dev
```

## Estrutura

```
src/
  components/   # layout, dashboard, forms, common, ui
  lib/
    api/        # camada única de chamadas (mockApi)
    mocks/      # dados centralizados
    types/      # contratos TypeScript
    auth/       # contexto de sessão (placeholder JWT)
    nav.ts      # navegação filtrada por perfil
  routes/       # rotas TanStack file-based
  assets/       # logo oficial TopBus
```

## Onde estão os mocks

`src/lib/mocks/index.ts` — todos os dados ficam aqui, nunca dentro de componentes.

## Como trocar mocks por API real

Em `src/lib/api/mockApi.ts`, cada função (`getVehicles`, `createRecord`, `uploadFile`, ...) retorna `Promise<T>`. Para usar backend real, substitua o corpo:

```ts
export const getVehicles = (): Promise<Vehicle[]> =>
  fetch("/api/vehicles", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
```

A assinatura permanece a mesma — componentes e React Query continuam funcionando.

## Próximos passos para backend

- NestJS + PostgreSQL
- Auth JWT (interceptor já comentado em `mockApi.ts`)
- Storage para uploads (Drive / S3)
- IA local: Ollama + Mistral em rede interna
- Typebot → Webhook → Backend → Dashboard

## Observações

Protótipo frontend. Não há backend nem banco reais nesta versão.
