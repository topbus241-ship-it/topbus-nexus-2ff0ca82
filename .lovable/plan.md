# TopBus OS — Frontend Premium (Protótipo)

Plataforma operacional modular para empresas de ônibus urbano. Protótipo frontend navegável, responsivo, com dados mockados e arquitetura pronta para backend real.

## Stack

- Scaffold `web_app` (template padrão: React + TypeScript + Vite + TailwindCSS + shadcn/ui + React Router). Observação: o template oficial não é Next.js; usaremos Vite/React mantendo todos os requisitos de arquitetura, tipos, camada de API e responsividade. Caso seja obrigatório Next.js, me avise antes da implementação.
- lucide-react para ícones lineares, react-hook-form + zod nos formulários.
- TanStack Query para consumir a camada `mockApi` (troca trivial por fetch/axios depois).

## Design System

- Paleta: azul petróleo / azul escuro / branco / cinza muito claro / grafite, com verde, âmbar e vermelho discretos para status. Sem neon, sem gradientes pesados, sem emojis.
- Tipografia Inter, escala consistente, espaçamento generoso, bordas suaves, sombras leves.
- Tokens definidos em `index.css` + `tailwind.config.ts` (HSL semantic tokens).
- Componentes base: Button (primary/secondary/ghost), Input, Select, Card, Table, Badge, Modal, Tabs, Tooltip, Drawer, Breadcrumbs, EmptyState, LoadingState, ErrorState.

## Estrutura de pastas

```text
src/
  components/
    layout/      (AppLayout, Sidebar, MobileDrawer, Header, Footer, Breadcrumbs, PageTitle)
    dashboard/   (StatCard, InsightCard, SectorCard)
    forms/       (FormSection, UploadBox, SignatureBox)
    tables/      (DataTable, MobileRecordCard, FilterBar, SearchInput)
    modules/     (ModuleBuilderCard, ModulePreview)
    typebot/     (TypebotFlow, ArchitectureDiagram)
    ui/          (shadcn primitives)
  features/
    auth/ vehicles/ drivers/ providers/ operations/
    fleet-status/ schedules/ reports/ module-builder/ insights/
  lib/
    api/mockApi.ts
    mocks/      (vehicles, drivers, providers, routes, schedules, services, damages, fleet, sectors, insights, metrics)
    types/      (User, UserRole, Sector, Vehicle, Driver, Provider, Route, Schedule, ServiceRecord, DamageRecord, FleetStatus, ModuleDefinition, ModuleField, Insight, DashboardMetric, UploadedDocument)
    utils/
  pages/        (rotas)
  styles/
```

## Camada de API mockada

`src/lib/api/mockApi.ts` expõe: getDashboardMetrics, getVehicles, getDrivers, getProviders, getRoutes, getSchedules, getServiceRecords, getDamageRecords, getFleetStatus, getSectors, getInsights, createRecord, updateRecord, uploadFile, generatePdf. Cada função retorna Promise com delay simulado, lendo de `lib/mocks`. Substituir por `fetch('/api/...')` no futuro sem tocar componentes.

## Perfis e navegação

Login mockado com seleção de perfil (Master, Gestor Manutenção, Portaria, Operação, Financeiro, RH, Abastecimento, Frota). Perfil persistido em `localStorage` via contexto `AuthContext`. Sidebar filtra itens conforme `role`. Estrutura pronta para JWT (interceptor placeholder no `mockApi`).

## Telas (rotas)

1. `/login` — seleção de perfil premium
2. `/` — Dashboard Master (cards, veículos parados, últimos registros, insights, evolução de custos, status por setor)
3. `/setores` — grid de SectorCards
4. `/veiculos` — tabela desktop + cards mobile, filtros, busca, status badges
5. `/motoristas`
6. `/prestadores`
7. `/linhas-rotas`
8. `/escala` — busca por chapa/data/hora, card de resultado mockado
9. `/servico-terceirizado` — lista + formulário em seções + upload + assinatura simulada
10. `/avaria` — lista + formulário com cálculo automático de valor total
11. `/status-frota` — KPIs + tabela/cards de veículos parados
12. `/relatorios` — upload com drag-and-drop simulado
13. `/criador-modulos` — somente Master; fluxo em etapas com preview ao vivo
14. `/insights` — copiloto analítico com cards mockados (Ollama/Mistral mencionado como roadmap)
15. `/configuracoes`
16. `/typebot` — fluxo conceitual + diagrama de arquitetura

Todos os mocks especificados (veículos 97021/21052/74226, motoristas DEVAIR/TESTE 01, prestador EDER, linhas 7840/2550, avaria do letreiro com R$315,00, etc.) ficam centralizados em `lib/mocks`.

## Responsividade

- Sidebar fixa em desktop, drawer no mobile.
- Tabelas convertem para cards no mobile via componente `DataTable` + `MobileRecordCard`.
- Formulários em coluna única no mobile, grid de 2 colunas em desktop.
- Sem overflow horizontal; uploads e assinatura adaptados ao mobile.

## Microinterações

Hover suave em cards, transições 150–200ms, focus rings visíveis, skeletons em loading, empty states ilustrados com ícone linear, toast de confirmação ao salvar.

## Rodapé global

`DEV - rodrigo.run © 2026 TopBus OS - Todos os direitos reservados`, com `rodrigo.run` como link.

## README

Objetivo, como rodar, estrutura de pastas, localização dos mocks, como trocar `mockApi` por API real, próximos passos para backend (NestJS + PostgreSQL + JWT), aviso de protótipo frontend.

## Fora de escopo nesta entrega

- Backend, banco e autenticação reais.
- Integração real com Typebot, Ollama/Mistral, BI.
- Uploads reais de arquivos.

## Pontos a confirmar

1. Tudo bem usar o template oficial Vite + React + TS no lugar de Next.js? (mesma stack moderna, mesmos requisitos atendidos)
2. Posso iniciar a implementação completa em um único passo, ou prefere entrega por módulos (ex: layout + dashboard primeiro, depois operação, depois módulos/insights)?
