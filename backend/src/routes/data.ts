import { Router } from 'express';
import prisma from '../prisma';
import { authenticate } from '../middleware/auth';
import type { UserRole } from '@prisma/client';

const router = Router();

type ResourceEntry = {
  findMany: () => Promise<any>;
  create?: (data: any) => Promise<any>;
  update?: (id: string, data: any) => Promise<any>;
};

function clean<T extends Record<string, any>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as T;
}

function stringValue(value: any, fallback = '') {
  return value === undefined || value === null ? fallback : String(value).trim();
}

function optionalString(value: any) {
  const result = stringValue(value);
  return result ? result : undefined;
}

function numberValue(value: any, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const parsed = Number(
    String(value ?? '')
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.'),
  );

  return Number.isFinite(parsed) ? parsed : fallback;
}

function intValue(value: any, fallback = 0) {
  return Math.trunc(numberValue(value, fallback));
}

function enumValue<T extends string>(value: any, allowed: readonly T[], fallback: T): T {
  const normalized = String(value ?? '').trim() as T;
  return allowed.includes(normalized) ? normalized : fallback;
}

function arrayValue(value: any): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
}

const vehicleStatuses = [
  'ativo',
  'manutencao',
  'parado',
  'aguardando_peca',
  'aguardando_terceiro',
  'liberado',
  'inativo',
] as const;

const sectorStatuses = ['operacional', 'atencao', 'critico'] as const;
const driverStatuses = ['ativo', 'afastado', 'ferias'] as const;
const serviceStatuses = ['registrado', 'em_andamento', 'concluido', 'aguardando'] as const;
const damageStatuses = ['registrada', 'orcamento', 'aprovada', 'concluida'] as const;
const insightSeverities = ['info', 'alerta', 'critico'] as const;
const userRoles = ['master', 'manutencao', 'portaria', 'operacao', 'financeiro', 'rh', 'abastecimento', 'frota'] as const;

async function resolveSectorId(data: any) {
  if (data.sectorId) return String(data.sectorId);

  if (data.sector) {
    const sector = await prisma.sector.findFirst({
      where: { name: String(data.sector) },
    });

    if (sector) return sector.id;
  }

  const firstSector = await prisma.sector.findFirst({ orderBy: { createdAt: 'asc' } });
  if (firstSector) return firstSector.id;

  const created = await prisma.sector.create({
    data: {
      name: 'Geral',
      description: 'Setor padrão criado automaticamente para vincular módulos.',
      status: 'operacional',
    },
  });

  return created.id;
}

async function getDashboardMetrics() {
  const [vehicles, damages, services, documents] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.damageRecord.findMany(),
    prisma.serviceRecord.findMany(),
    prisma.uploadedDocument.findMany(),
  ]);

  const active = vehicles.filter((item) => item.status === 'ativo' || item.status === 'liberado').length;
  const stopped = vehicles.filter((item) => item.status !== 'ativo' && item.status !== 'liberado').length;
  const cost = damages.reduce((sum, item) => sum + item.totalValue, 0) + services.reduce((sum, item) => sum + item.value, 0);

  return [
    { key: 'active', label: 'Veículos ativos', value: String(active), delta: '+2' },
    { key: 'stopped', label: 'Veículos parados', value: String(stopped), delta: '-1' },
    { key: 'damages', label: 'Avarias no mês', value: String(damages.length), delta: '+3' },
    { key: 'services', label: 'Serviços terceirizados', value: String(services.length), delta: '+1' },
    {
      key: 'cost',
      label: 'Custo estimado de avarias',
      value: cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      delta: '+6',
    },
    { key: 'docs', label: 'Documentos pendentes', value: String(documents.length), delta: '-2' },
  ];
}

async function getFleetStatus() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { updatedAt: 'desc' } });

  return vehicles.map((vehicle) => ({
    vehicleNumber: vehicle.number,
    status: vehicle.status,
    reason: vehicle.note || (vehicle.status === 'ativo' ? 'Operacional' : 'Requer acompanhamento'),
    responsibleSector: vehicle.status === 'ativo' ? 'Operação' : 'Manutenção',
    stoppedAt: vehicle.updatedAt.toISOString().slice(0, 10),
    expectedRelease: vehicle.status === 'ativo' ? 'Liberado' : 'Em análise',
    priority: vehicle.status === 'parado' || vehicle.status === 'manutencao' ? 'alta' : 'media',
  }));
}

async function getAnalytics() {
  const [vehicles, damages, services] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.damageRecord.findMany(),
    prisma.serviceRecord.findMany(),
  ]);

  const active = vehicles.filter((item) => item.status === 'ativo' || item.status === 'liberado').length;
  const stopped = vehicles.filter((item) => item.status !== 'ativo' && item.status !== 'liberado').length;
  const cost = damages.reduce((sum, item) => sum + item.totalValue, 0) + services.reduce((sum, item) => sum + item.value, 0);

  return {
    sparklines: {
      active: [Math.max(0, active - 4), Math.max(0, active - 2), active, active + 1, active],
      vehicles: [vehicles.length, vehicles.length, vehicles.length],
      stopped: [stopped + 2, stopped + 1, stopped],
      damages: [Math.max(0, damages.length - 2), damages.length, damages.length + 1],
      services: [Math.max(0, services.length - 1), services.length, services.length + 1],
      cost: [Math.max(0, cost - 1000), cost, cost + 500],
      docs: [1, 2, 3, 4, 5],
    },

    fleetMonthly: [
      { month: 'Jan', ativos: Math.max(0, active - 5), parados: stopped + 2, avarias: Math.max(0, damages.length - 2) },
      { month: 'Fev', ativos: Math.max(0, active - 3), parados: stopped + 1, avarias: Math.max(0, damages.length - 1) },
      { month: 'Mar', ativos: active, parados: stopped, avarias: damages.length },
      { month: 'Abr', ativos: active + 1, parados: Math.max(0, stopped - 1), avarias: damages.length },
      { month: 'Mai', ativos: active, parados: stopped, avarias: damages.length },
      { month: 'Jun', ativos: active + 2, parados: Math.max(0, stopped - 2), avarias: Math.max(0, damages.length - 1) },
    ],

    fleetDistribution: [
      { name: 'Ativos', value: active },
      { name: 'Parados', value: stopped },
      { name: 'Avarias', value: damages.length },
      { name: 'Serviços', value: services.length },
    ],

    operationalTimeline: [
      { hour: '05h', saidas: 18, retornos: 2 },
      { hour: '07h', saidas: 42, retornos: 4 },
      { hour: '09h', saidas: 30, retornos: 12 },
      { hour: '12h', saidas: 22, retornos: 18 },
      { hour: '15h', saidas: 34, retornos: 21 },
      { hour: '18h', saidas: 28, retornos: 40 },
      { hour: '21h', saidas: 10, retornos: 37 },
    ],

    costBreakdown: [
      { name: 'Mecânica', value: services.filter((item) => item.serviceType.toLowerCase().includes('mec')).reduce((sum, item) => sum + item.value, 0) },
      { name: 'Elétrica', value: services.filter((item) => item.serviceType.toLowerCase().includes('el')).reduce((sum, item) => sum + item.value, 0) },
      { name: 'Avarias', value: damages.reduce((sum, item) => sum + item.totalValue, 0) },
      { name: 'Terceiros', value: services.reduce((sum, item) => sum + item.value, 0) },
    ],
  };
}

const resourceMap: Record<string, ResourceEntry> = {
  dashboardMetrics: {
    findMany: getDashboardMetrics,
  },

  fleetStatus: {
    findMany: getFleetStatus,
  },

  analytics: {
    findMany: getAnalytics,
  },

  schedules: {
    findMany: async () => [],
  },

  sectors: {
    findMany: () => prisma.sector.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.sector.create({
        data: clean({
          name: stringValue(data.name, 'Setor sem nome'),
          description: optionalString(data.description),
          moduleCount: intValue(data.moduleCount, 0),
          recentRecords: intValue(data.recentRecords, 0),
          status: enumValue(data.status, sectorStatuses, 'operacional'),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.sector.update({
        where: { id },
        data: clean({
          name: optionalString(data.name),
          description: optionalString(data.description),
          moduleCount: data.moduleCount !== undefined ? intValue(data.moduleCount) : undefined,
          recentRecords: data.recentRecords !== undefined ? intValue(data.recentRecords) : undefined,
          status: data.status !== undefined ? enumValue(data.status, sectorStatuses, 'operacional') : undefined,
        }),
      }),
  },

  vehicles: {
    findMany: () => prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.vehicle.create({
        data: clean({
          number: stringValue(data.number),
          type: stringValue(data.type, 'Ônibus urbano'),
          status: enumValue(data.status, vehicleStatuses, 'ativo'),
          note: optionalString(data.note),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.vehicle.update({
        where: { id },
        data: clean({
          number: optionalString(data.number),
          type: optionalString(data.type),
          status: data.status !== undefined ? enumValue(data.status, vehicleStatuses, 'ativo') : undefined,
          note: optionalString(data.note),
        }),
      }),
  },

  drivers: {
    findMany: () => prisma.driver.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.driver.create({
        data: clean({
          name: stringValue(data.name, 'Motorista sem nome'),
          chapa: stringValue(data.chapa, `CHAPA-${Date.now()}`),
          role: stringValue(data.role, 'Motorista'),
          status: enumValue(data.status, driverStatuses, 'ativo'),
          lastSchedule: optionalString(data.lastSchedule),
          vehicleNumber: optionalString(data.vehicleNumber),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.driver.update({
        where: { id },
        data: clean({
          name: optionalString(data.name),
          chapa: optionalString(data.chapa),
          role: optionalString(data.role),
          status: data.status !== undefined ? enumValue(data.status, driverStatuses, 'ativo') : undefined,
          lastSchedule: optionalString(data.lastSchedule),
          vehicleNumber: optionalString(data.vehicleNumber),
        }),
      }),
  },

  providers: {
    findMany: () => prisma.provider.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.provider.create({
        data: clean({
          name: stringValue(data.name, 'Prestador sem nome'),
          serviceType: stringValue(data.serviceType, 'Serviço'),
          status: stringValue(data.status, 'ativo'),
          servicesCount: intValue(data.servicesCount, 0),
          accumulatedValue: numberValue(data.accumulatedValue, 0),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.provider.update({
        where: { id },
        data: clean({
          name: optionalString(data.name),
          serviceType: optionalString(data.serviceType),
          status: optionalString(data.status),
          servicesCount: data.servicesCount !== undefined ? intValue(data.servicesCount) : undefined,
          accumulatedValue: data.accumulatedValue !== undefined ? numberValue(data.accumulatedValue) : undefined,
        }),
      }),
  },

  routes: {
    findMany: () => prisma.route.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.route.create({
        data: clean({
          line: stringValue(data.line || data.name, 'Linha sem código'),
          name: stringValue(data.name, data.line || 'Rota operacional'),
          status: stringValue(data.status, 'ativa'),
          vehicles: arrayValue(data.vehicles),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.route.update({
        where: { id },
        data: clean({
          line: optionalString(data.line),
          name: optionalString(data.name),
          status: optionalString(data.status),
          vehicles: data.vehicles !== undefined ? arrayValue(data.vehicles) : undefined,
        }),
      }),
  },

  serviceRecords: {
    findMany: () => prisma.serviceRecord.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.serviceRecord.create({
        data: clean({
          vehicleNumber: stringValue(data.vehicleNumber),
          providerName: stringValue(data.providerName, 'Prestador não informado'),
          executor: stringValue(data.executor, data.providerName || 'Executor não informado'),
          serviceType: stringValue(data.serviceType, 'Serviço'),
          serviceDone: stringValue(data.serviceDone, 'Serviço registrado'),
          description: optionalString(data.description),
          value: numberValue(data.value, 0),
          authorizer: stringValue(data.authorizer, 'Sistema'),
          status: enumValue(data.status, serviceStatuses, 'registrado'),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.serviceRecord.update({
        where: { id },
        data: clean({
          vehicleNumber: optionalString(data.vehicleNumber),
          providerName: optionalString(data.providerName),
          executor: optionalString(data.executor),
          serviceType: optionalString(data.serviceType),
          serviceDone: optionalString(data.serviceDone),
          description: optionalString(data.description),
          value: data.value !== undefined ? numberValue(data.value) : undefined,
          authorizer: optionalString(data.authorizer),
          status: data.status !== undefined ? enumValue(data.status, serviceStatuses, 'registrado') : undefined,
        }),
      }),
  },

  damageRecords: {
    findMany: () => prisma.damageRecord.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.damageRecord.create({
        data: clean({
          vehicleNumber: stringValue(data.vehicleNumber),
          driverName: stringValue(data.driverName, 'Motorista não informado'),
          chapa: stringValue(data.chapa, 'Não informada'),
          reporter: stringValue(data.reporter, 'Sistema'),
          damageType: stringValue(data.damageType, 'Avaria'),
          affectedPart: stringValue(data.affectedPart, 'Não informado'),
          description: stringValue(data.description, 'Avaria registrada'),
          driverVersion: optionalString(data.driverVersion),
          portariaVersion: optionalString(data.portariaVersion),
          item: stringValue(data.item, 'Item não informado'),
          quantity: intValue(data.quantity, 1),
          unitValue: numberValue(data.unitValue, 0),
          laborValue: numberValue(data.laborValue, 0),
          otherValue: numberValue(data.otherValue ?? data.otherValues, 0),
          totalValue: numberValue(data.totalValue, 0),
          status: enumValue(data.status, damageStatuses, 'registrada'),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.damageRecord.update({
        where: { id },
        data: clean({
          vehicleNumber: optionalString(data.vehicleNumber),
          driverName: optionalString(data.driverName),
          chapa: optionalString(data.chapa),
          reporter: optionalString(data.reporter),
          damageType: optionalString(data.damageType),
          affectedPart: optionalString(data.affectedPart),
          description: optionalString(data.description),
          driverVersion: optionalString(data.driverVersion),
          portariaVersion: optionalString(data.portariaVersion),
          item: optionalString(data.item),
          quantity: data.quantity !== undefined ? intValue(data.quantity) : undefined,
          unitValue: data.unitValue !== undefined ? numberValue(data.unitValue) : undefined,
          laborValue: data.laborValue !== undefined ? numberValue(data.laborValue) : undefined,
          otherValue: data.otherValue !== undefined || data.otherValues !== undefined ? numberValue(data.otherValue ?? data.otherValues) : undefined,
          totalValue: data.totalValue !== undefined ? numberValue(data.totalValue) : undefined,
          status: data.status !== undefined ? enumValue(data.status, damageStatuses, 'registrada') : undefined,
        }),
      }),
  },

  insights: {
    findMany: () => prisma.insight.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.insight.create({
        data: clean({
          title: stringValue(data.title, 'Insight sem título'),
          description: stringValue(data.description, 'Insight registrado'),
          severity: enumValue(data.severity, insightSeverities, 'info'),
          category: stringValue(data.category, 'Geral'),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.insight.update({
        where: { id },
        data: clean({
          title: optionalString(data.title),
          description: optionalString(data.description),
          severity: data.severity !== undefined ? enumValue(data.severity, insightSeverities, 'info') : undefined,
          category: optionalString(data.category),
        }),
      }),
  },

  uploadedDocuments: {
    findMany: () => prisma.uploadedDocument.findMany({ orderBy: { uploadedAt: 'desc' } }),
    create: (data: any) =>
      prisma.uploadedDocument.create({
        data: clean({
          sector: stringValue(data.sector, 'Geral'),
          documentType: stringValue(data.documentType, 'Documento'),
          fileName: stringValue(data.fileName, `arquivo-${Date.now()}`),
          note: optionalString(data.note),
          uploadedBy: stringValue(data.uploadedBy, 'Sistema'),
        }),
      }),
    update: (id: string, data: any) =>
      prisma.uploadedDocument.update({
        where: { id },
        data: clean({
          sector: optionalString(data.sector),
          documentType: optionalString(data.documentType),
          fileName: optionalString(data.fileName),
          note: optionalString(data.note),
          uploadedBy: optionalString(data.uploadedBy),
        }),
      }),
  },

  moduleDefinitions: {
    findMany: () =>
      prisma.moduleDefinition.findMany({
        include: { sector: true },
        orderBy: { createdAt: 'desc' },
      }),
    create: async (data: any) =>
      prisma.moduleDefinition.create({
        data: clean({
          name: stringValue(data.name, 'Módulo sem nome'),
          sectorId: await resolveSectorId(data),
          description: optionalString(data.description),
          fields: data.fields ?? [],
          permissions: arrayValue(data.permissions).filter((role) => (userRoles as readonly string[]).includes(role)) as UserRole[],
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        }),
      }),
    update: async (id: string, data: any) => {
      const updateData: any = clean({
        name: optionalString(data.name),
        description: optionalString(data.description),
        fields: data.fields,
        permissions: data.permissions !== undefined ? (arrayValue(data.permissions).filter((role) => (userRoles as readonly string[]).includes(role)) as UserRole[]) : undefined,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      });

      if (data.sectorId || data.sector) {
        updateData.sectorId = await resolveSectorId(data);
      }

      return prisma.moduleDefinition.update({
        where: { id },
        data: updateData,
      });
    },
  },

  chatConfig: {
    findMany: () => prisma.chatConfig.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) =>
      prisma.chatConfig.create({
        data: clean({
          sectorId: stringValue(data.sectorId, 'geral'),
          label: stringValue(data.label, 'Chat'),
          buttons: data.buttons ?? [],
        }),
      }),
    update: (id: string, data: any) =>
      prisma.chatConfig.update({
        where: { id },
        data: clean({
          sectorId: optionalString(data.sectorId),
          label: optionalString(data.label),
          buttons: data.buttons,
        }),
      }),
  },
};

router.get('/:resource', authenticate, async (req, res) => {
  try {
    const { resource } = req.params;
    const resourceKey = Array.isArray(resource) ? String(resource[0] ?? '') : String(resource ?? '');
    const entry = (resourceMap as Record<string, ResourceEntry>)[resourceKey];

    if (!entry) return res.json([]);

    const list = await entry.findMany();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'read_failed', message: err.message });
  }
});

router.post('/:resource', authenticate, async (req, res) => {
  try {
    const { resource } = req.params;
    const resourceKey = Array.isArray(resource) ? String(resource[0] ?? '') : String(resource ?? '');
    const entry = (resourceMap as Record<string, ResourceEntry>)[resourceKey];

    if (!entry?.create) return res.status(404).json({ error: 'resource_not_found' });

    const created = await entry.create(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: 'create_failed', message: err.message });
  }
});

router.put('/:resource/:id', authenticate, async (req, res) => {
  try {
    const { resource, id } = req.params;
    const resourceKey = Array.isArray(resource) ? String(resource[0] ?? '') : String(resource ?? '');
    const entry = (resourceMap as Record<string, ResourceEntry>)[resourceKey];

    if (!entry?.update) return res.status(404).json({ error: 'update_not_supported' });

    const idKey = Array.isArray(id) ? String(id[0] ?? '') : String(id ?? '');
    const updated = await entry.update(idKey, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: 'update_failed', message: err.message });
  }
});

export default router;
