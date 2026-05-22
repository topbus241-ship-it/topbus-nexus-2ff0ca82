import type {
  Vehicle,
  Driver,
  Provider,
  Route,
  Schedule,
  ServiceRecord,
  DamageRecord,
  FleetStatus,
  Sector,
  Insight,
  DashboardMetric,
  ModuleDefinition,
  UploadedDocument,
} from "@/lib/types";

export const sectorsMock: Sector[] = [
  { id: "portaria", name: "Portaria", description: "Controle de entrada e saída de veículos e registros de avaria.", moduleCount: 4, recentRecords: 12, status: "operacional" },
  { id: "manutencao", name: "Manutenção", description: "Gestão de avarias, ordens de serviço e oficinas.", moduleCount: 7, recentRecords: 23, status: "atencao" },
  { id: "frota", name: "Frota", description: "Acompanhamento da disponibilidade e status dos veículos.", moduleCount: 5, recentRecords: 18, status: "operacional" },
  { id: "operacao", name: "Operação", description: "Escala operacional, linhas e rotas urbanas.", moduleCount: 6, recentRecords: 41, status: "operacional" },
  { id: "rh", name: "RH", description: "Cadastro de colaboradores, documentos e escalas.", moduleCount: 3, recentRecords: 9, status: "operacional" },
  { id: "financeiro", name: "Financeiro", description: "Custos, relatórios e conferência de serviços terceirizados.", moduleCount: 5, recentRecords: 15, status: "atencao" },
  { id: "abastecimento", name: "Abastecimento", description: "Registro de litragem, postos e cupons.", moduleCount: 2, recentRecords: 7, status: "operacional" },
  { id: "terceirizados", name: "Terceirizados", description: "Prestadores externos e serviços contratados.", moduleCount: 3, recentRecords: 11, status: "operacional" },
  { id: "gestao", name: "Gestão", description: "Visão executiva consolidada de todos os setores.", moduleCount: 9, recentRecords: 62, status: "operacional" },
];

export const vehiclesMock: Vehicle[] = [
  { id: "v1", number: "97021", type: "Ônibus urbano", status: "manutencao", note: "Vidro do letreiro quebrado" },
  { id: "v2", number: "21052", type: "Ônibus urbano", status: "ativo" },
  { id: "v3", number: "74226", type: "Ônibus urbano", status: "parado", note: "Aguardando manutenção elétrica" },
  { id: "v4", number: "33108", type: "Ônibus urbano", status: "aguardando_peca", note: "Aguardando bomba injetora" },
  { id: "v5", number: "44215", type: "Ônibus urbano", status: "ativo" },
  { id: "v6", number: "55672", type: "Ônibus urbano", status: "aguardando_terceiro", note: "Funilaria externa" },
  { id: "v7", number: "61134", type: "Ônibus urbano", status: "liberado" },
  { id: "v8", number: "82091", type: "Ônibus urbano", status: "ativo" },
  { id: "v9", number: "90017", type: "Ônibus urbano", status: "inativo" },
];

export const driversMock: Driver[] = [
  { id: "d1", name: "DEVAIR MENDES DE SOUSA", chapa: "9718482", role: "MOTORISTA URBANO", status: "ativo", lastSchedule: "30/04/2026 07:20", vehicleNumber: "97021" },
  { id: "d2", name: "MOTORISTA TESTE 01", chapa: "9001001", role: "MOTORISTA URBANO", status: "ativo", lastSchedule: "29/04/2026 14:00" },
  { id: "d3", name: "ANTONIO CARLOS SILVA", chapa: "9712001", role: "MOTORISTA URBANO", status: "ativo", lastSchedule: "30/04/2026 05:10", vehicleNumber: "21052" },
  { id: "d4", name: "JOSE RIBEIRO LIMA", chapa: "9714502", role: "MOTORISTA URBANO", status: "afastado" },
  { id: "d5", name: "MARIA APARECIDA NOGUEIRA", chapa: "9719003", role: "MOTORISTA URBANO", status: "ferias" },
];

export const providersMock: Provider[] = [
  { id: "p1", name: "EDER", serviceType: "Mecânica", status: "ativo", servicesCount: 14, accumulatedValue: 28450 },
  { id: "p2", name: "AUTO ELÉTRICA SANTOS", serviceType: "Elétrica", status: "ativo", servicesCount: 8, accumulatedValue: 12300 },
  { id: "p3", name: "FUNILARIA CENTRAL", serviceType: "Funilaria", status: "ativo", servicesCount: 5, accumulatedValue: 9700 },
  { id: "p4", name: "BORRACHARIA UNIÃO", serviceType: "Pneus", status: "inativo", servicesCount: 22, accumulatedValue: 18900 },
];

export const routesMock: Route[] = [
  { id: "r1", line: "7840", name: "Centro / Bairro", status: "ativa", vehicles: ["97021", "44215"] },
  { id: "r2", line: "2550", name: "Terminal / Industrial", status: "ativa", vehicles: ["21052", "82091"] },
  { id: "r3", line: "1170", name: "Estação / Universidade", status: "ativa", vehicles: ["61134"] },
  { id: "r4", line: "3320", name: "Norte / Shopping", status: "suspensa", vehicles: [] },
];

export const schedulesMock: Schedule[] = [
  { id: "s1", chapa: "9718482", driverName: "DEVAIR MENDES DE SOUSA", vehicleNumber: "97021", line: "7840", routeName: "Centro / Bairro", date: "30/04/2026", time: "07:20" },
  { id: "s2", chapa: "9712001", driverName: "ANTONIO CARLOS SILVA", vehicleNumber: "21052", line: "2550", routeName: "Terminal / Industrial", date: "30/04/2026", time: "05:10" },
  { id: "s3", chapa: "9001001", driverName: "MOTORISTA TESTE 01", vehicleNumber: "44215", line: "7840", routeName: "Centro / Bairro", date: "29/04/2026", time: "14:00" },
];

export const serviceRecordsMock: ServiceRecord[] = [
  { id: "sv1", vehicleNumber: "21052", providerName: "EDER", executor: "EDER", serviceType: "Mecânica", serviceDone: "TROCA DA CAIXA DE MARCHA", description: "Substituição completa após falha no engate", value: 4800, authorizer: "Supervisor Manutenção", status: "registrado", createdAt: "28/04/2026" },
  { id: "sv2", vehicleNumber: "74226", providerName: "AUTO ELÉTRICA SANTOS", executor: "Carlos Santos", serviceType: "Elétrica", serviceDone: "REVISÃO DO CHICOTE ELÉTRICO", value: 1200, authorizer: "Gestor Frota", status: "em_andamento", createdAt: "27/04/2026" },
  { id: "sv3", vehicleNumber: "55672", providerName: "FUNILARIA CENTRAL", executor: "Equipe Funilaria", serviceType: "Funilaria", serviceDone: "REPARO LATERAL DIREITA", value: 2350, authorizer: "Supervisor Manutenção", status: "aguardando", createdAt: "25/04/2026" },
];

export const damageRecordsMock: DamageRecord[] = [
  {
    id: "dr1",
    vehicleNumber: "97021",
    driverName: "DEVAIR MENDES DE SOUSA",
    chapa: "9718482",
    reporter: "Portaria - Turno 1",
    damageType: "Vidro",
    affectedPart: "Letreiro frontal",
    description: "VIDRO DO LETREIRO QUEBRADO",
    driverVersion: "Vidro já apresentava trinca ao iniciar o turno.",
    portariaVersion: "Identificado na entrada da garagem após o turno.",
    item: "Vidro do letreiro",
    quantity: 1,
    unitValue: 230,
    laborValue: 85,
    otherValue: 0,
    totalValue: 315,
    status: "registrada",
    createdAt: "28/04/2026",
  },
  {
    id: "dr2",
    vehicleNumber: "33108",
    driverName: "ANTONIO CARLOS SILVA",
    chapa: "9712001",
    reporter: "Portaria - Turno 2",
    damageType: "Funilaria",
    affectedPart: "Para-choque traseiro",
    description: "Amassado leve no para-choque traseiro",
    item: "Reparo para-choque",
    quantity: 1,
    unitValue: 480,
    laborValue: 220,
    otherValue: 0,
    totalValue: 700,
    status: "orcamento",
    createdAt: "26/04/2026",
  },
];

export const fleetStatusMock: FleetStatus[] = [
  { vehicleNumber: "97021", status: "manutencao", reason: "Vidro do letreiro quebrado", responsibleSector: "Manutenção", stoppedAt: "28/04/2026", expectedRelease: "02/05/2026", priority: "media" },
  { vehicleNumber: "74226", status: "parado", reason: "Aguardando manutenção elétrica", responsibleSector: "Manutenção", stoppedAt: "27/04/2026", expectedRelease: "03/05/2026", priority: "alta" },
  { vehicleNumber: "33108", status: "aguardando_peca", reason: "Bomba injetora", responsibleSector: "Manutenção", stoppedAt: "25/04/2026", expectedRelease: "05/05/2026", priority: "alta" },
  { vehicleNumber: "55672", status: "aguardando_terceiro", reason: "Funilaria externa", responsibleSector: "Terceirizados", stoppedAt: "25/04/2026", expectedRelease: "01/05/2026", priority: "media" },
  { vehicleNumber: "90017", status: "inativo", reason: "Baixa programada", responsibleSector: "Gestão", stoppedAt: "10/03/2026", expectedRelease: "-", priority: "baixa" },
];

export const insightsMock: Insight[] = [
  { id: "i1", title: "Veículo 97021 com ocorrência recente", description: "Avaria no letreiro registrada há 3 dias. Recomenda-se inspeção complementar.", severity: "alerta", category: "Frota" },
  { id: "i2", title: "Veículos aguardando peça há mais de 5 dias", description: "2 veículos estão parados aguardando reposição. Verificar fornecedor.", severity: "critico", category: "Manutenção" },
  { id: "i3", title: "Registros sem fotos obrigatórias", description: "4 registros pendentes de anexo de imagem antes/depois.", severity: "alerta", category: "Operação" },
  { id: "i4", title: "Custo de avarias concentrado em veículos parados", description: "70% do custo do mês vem de 3 veículos. Avaliar plano de recuperação.", severity: "info", category: "Financeiro" },
  { id: "i5", title: "Mecânica concentra maior custo do período", description: "Serviços de mecânica representam 58% do total terceirizado no mês.", severity: "info", category: "Financeiro" },
  { id: "i6", title: "Escala reduz preenchimento manual por chapa", description: "Adoção da busca por chapa elimina 80% do retrabalho operacional.", severity: "info", category: "Operação" },
];

export const dashboardMetricsMock: DashboardMetric[] = [
  { key: "active", label: "Veículos ativos", value: 5, delta: 2 },
  { key: "stopped", label: "Veículos parados", value: 4, delta: -1 },
  { key: "damages", label: "Avarias no mês", value: 12, delta: 3 },
  { key: "services", label: "Serviços terceirizados", value: 8, delta: 1 },
  { key: "cost", label: "Custo estimado de avarias", value: "R$ 18.420", delta: 6 },
  { key: "docs", label: "Documentos pendentes", value: 5, delta: -2 },
];

/* Séries analíticas mockadas — substituir por GET /api/analytics no backend real */
export const sparklinesMock: Record<string, number[]> = {
  active: [4, 5, 4, 6, 5, 5, 6, 7, 6, 7, 6, 5],
  stopped: [6, 5, 7, 6, 5, 5, 4, 5, 4, 3, 4, 4],
  damages: [4, 6, 5, 7, 6, 8, 7, 9, 10, 9, 11, 12],
  services: [3, 4, 5, 4, 6, 5, 6, 7, 6, 7, 8, 8],
  cost: [12, 14, 13, 15, 14, 16, 15, 17, 16, 17, 18, 18.4],
  docs: [9, 8, 8, 7, 6, 7, 6, 6, 5, 6, 5, 5],
};

export const fleetMonthlyMock = [
  { month: "Jan", ativos: 38, parados: 6, avarias: 7 },
  { month: "Fev", ativos: 40, parados: 5, avarias: 6 },
  { month: "Mar", ativos: 39, parados: 7, avarias: 9 },
  { month: "Abr", ativos: 41, parados: 4, avarias: 12 },
  { month: "Mai", ativos: 42, parados: 4, avarias: 10 },
  { month: "Jun", ativos: 43, parados: 3, avarias: 8 },
];

export const costBreakdownMock = [
  { name: "Mecânica", value: 10680 },
  { name: "Elétrica", value: 3120 },
  { name: "Funilaria", value: 2350 },
  { name: "Pneus", value: 1480 },
  { name: "Outros", value: 790 },
];

export const fleetDistributionMock = [
  { name: "Ativos", value: 41 },
  { name: "Manutenção", value: 4 },
  { name: "Aguardando peça", value: 2 },
  { name: "Aguardando terceiro", value: 1 },
  { name: "Inativos", value: 2 },
];

export const operationalTimelineMock = [
  { hour: "04h", saidas: 2, retornos: 0 },
  { hour: "06h", saidas: 14, retornos: 1 },
  { hour: "08h", saidas: 9, retornos: 4 },
  { hour: "10h", saidas: 5, retornos: 7 },
  { hour: "12h", saidas: 6, retornos: 6 },
  { hour: "14h", saidas: 11, retornos: 8 },
  { hour: "16h", saidas: 7, retornos: 12 },
  { hour: "18h", saidas: 4, retornos: 15 },
  { hour: "20h", saidas: 2, retornos: 11 },
  { hour: "22h", saidas: 0, retornos: 6 },
];

export const uploadedDocumentsMock: UploadedDocument[] = [
  { id: "u1", sector: "Manutenção", documentType: "Orçamento", fileName: "orcamento-eder-21052.pdf", uploadedAt: "29/04/2026", uploadedBy: "Supervisor Manutenção" },
  { id: "u2", sector: "RH", documentType: "Documento RH", fileName: "atestado-devair.pdf", uploadedAt: "28/04/2026", uploadedBy: "RH" },
  { id: "u3", sector: "Operação", documentType: "Relatório operacional", fileName: "relatorio-escala-abr.xlsx", uploadedAt: "27/04/2026", uploadedBy: "Operação" },
];

export const moduleDefinitionsMock: ModuleDefinition[] = [
  {
    id: "m1",
    name: "Registro de Abastecimento",
    sectorId: "abastecimento",
    description: "Registro de abastecimento por veículo, com cupom fotografado e assinatura do motorista.",
    fields: [
      { id: "f1", label: "Veículo", type: "vehicle", required: true },
      { id: "f2", label: "Motorista", type: "driver", required: true },
      { id: "f3", label: "Litros", type: "number", required: true },
      { id: "f4", label: "Valor", type: "currency", required: true },
      { id: "f5", label: "Posto", type: "text", required: true },
      { id: "f6", label: "Foto do cupom", type: "photo", required: true },
      { id: "f7", label: "Assinatura", type: "signature", required: true },
    ],
    permissions: ["master", "abastecimento"],
    publishedAt: "20/04/2026",
  },
];
