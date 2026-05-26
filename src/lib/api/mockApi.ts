/*
  Backend API adapter with optional demo mock mode.
  Mocks OFF: calls real backend endpoints at /api/...
  Mocks ON: returns frontend demo data from local static objects.
*/

import type {
  DamageRecord,
  DashboardMetric,
  Driver,
  FleetStatus,
  Insight,
  ModuleDefinition,
  Provider,
  Route,
  Schedule,
  Sector,
  ServiceRecord,
  UploadedDocument,
  Vehicle,
} from '@/lib/types';

import { demoData } from './demoData';
import { isMockModeEnabled } from './mockMode';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('topbus-token') : null);

async function fetchJson(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(path, { ...opts, headers: { ...(opts.headers || {}), ...headers } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

function fromDemo<T>(key: keyof typeof demoData): Promise<T> {
  return Promise.resolve(demoData[key] as T);
}

function readList<T>(resource: keyof typeof demoData, apiPath: string): Promise<T> {
  return isMockModeEnabled() ? fromDemo<T>(resource) : fetchJson(apiPath);
}

export const getDashboardMetrics = async (): Promise<DashboardMetric[]> =>
  readList('dashboardMetrics', '/api/data/dashboardMetrics');

export const getSectors = async (): Promise<Sector[]> =>
  readList('sectors', '/api/data/sectors');

export const getVehicles = async (): Promise<Vehicle[]> =>
  readList('vehicles', '/api/data/vehicles');

export const getDrivers = async (): Promise<Driver[]> =>
  readList('drivers', '/api/data/drivers');

export const getProviders = async (): Promise<Provider[]> =>
  readList('providers', '/api/data/providers');

export const getRoutes = async (): Promise<Route[]> =>
  readList('routes', '/api/data/routes');

export const getSchedules = async (): Promise<Schedule[]> =>
  readList('schedules', '/api/data/schedules');

export const getServiceRecords = async (): Promise<ServiceRecord[]> =>
  readList('serviceRecords', '/api/data/serviceRecords');

export const getDamageRecords = async (): Promise<DamageRecord[]> =>
  readList('damageRecords', '/api/data/damageRecords');

export const getFleetStatus = async (): Promise<FleetStatus[]> =>
  readList('fleetStatus', '/api/data/fleetStatus');

export const getInsights = async (): Promise<Insight[]> =>
  readList('insights', '/api/data/insights');

export const getUploadedDocuments = async (): Promise<UploadedDocument[]> =>
  readList('uploadedDocuments', '/api/data/uploadedDocuments');

export const getModuleDefinitions = async (): Promise<ModuleDefinition[]> =>
  readList('moduleDefinitions', '/api/data/moduleDefinitions');

export const findScheduleByChapaDateTime = async (
  chapa: string,
  date: string,
  time: string,
): Promise<Schedule | null> => {
  const list = await getSchedules();
  return list.find((s) => s.chapa === chapa.trim() && s.date === date.trim() && s.time === time.trim()) ?? null;
};

export const createRecord = async <T extends object>(resource: string, payload: T): Promise<any> => {
  if (isMockModeEnabled()) {
    return {
      id: `mock-${Date.now()}`,
      ...payload,
      mockMode: true,
    };
  }

  return fetchJson(`/api/data/${resource}`, { method: 'POST', body: JSON.stringify(payload) });
};

export const updateRecord = async <T extends object>(resource: string, id: string, payload: T): Promise<any> => {
  if (isMockModeEnabled()) {
    return {
      id,
      ...payload,
      mockMode: true,
    };
  }

  return fetchJson(`/api/data/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
};

export const uploadFile = async (file: File, meta: Record<string, string>): Promise<{ id: string; fileName: string }> => {
  if (isMockModeEnabled()) {
    return {
      id: `mock-upload-${Date.now()}`,
      fileName: file.name,
    };
  }

  const payload = { fileName: file.name, ...meta };
  return fetchJson('/api/data/uploadedDocuments', { method: 'POST', body: JSON.stringify(payload) });
};

export const generatePdf = async (resource: string, id: string): Promise<{ url: string }> => {
  if (isMockModeEnabled()) {
    return {
      url: `/mock/${resource}/${id}.pdf`,
    };
  }

  return fetchJson(`/api/data/${resource}/${id}/pdf`);
};


export const getAnalytics = async () => {
  return {
    sparklines: {
      active: [212, 218, 224, 229, 234, 238, 244],
      vehicles: [2, 2, 2, 2, 2, 2, 2],
      stopped: [21, 19, 18, 16, 15, 14, 11],
      damages: [18, 16, 15, 13, 12, 10, 8],
      services: [7, 8, 9, 9, 10, 11, 12],
      cost: [12400, 13800, 13150, 14900, 16200, 17400, 18420],
      budget: [315, 315, 315, 315, 315, 315, 315],
      docs: [4, 5, 6, 7, 8, 9, 10],
      evidence: [3, 5, 6, 7, 8, 10, 12],
      status: [80, 82, 84, 83, 85, 86, 88],
    },

    fleetMonthly: [
      { month: "Jan", ativos: 212, parados: 21, avarias: 18 },
      { month: "Fev", ativos: 218, parados: 19, avarias: 16 },
      { month: "Mar", ativos: 224, parados: 18, avarias: 15 },
      { month: "Abr", ativos: 229, parados: 16, avarias: 13 },
      { month: "Mai", ativos: 238, parados: 14, avarias: 10 },
      { month: "Jun", ativos: 244, parados: 11, avarias: 8 },
    ],

    fleetDistribution: [
      { name: "Ativos", value: 244 },
      { name: "Manutenção", value: 11 },
      { name: "Avaria", value: 8 },
      { name: "Aguardando peça", value: 5 },
      { name: "Liberados", value: 18 },
    ],

    operationalTimeline: [
      { hour: "05h", saidas: 18, retornos: 2 },
      { hour: "07h", saidas: 42, retornos: 4 },
      { hour: "09h", saidas: 30, retornos: 12 },
      { hour: "12h", saidas: 22, retornos: 18 },
      { hour: "15h", saidas: 34, retornos: 21 },
      { hour: "18h", saidas: 28, retornos: 40 },
      { hour: "21h", saidas: 10, retornos: 37 },
    ],

    costBreakdown: [
      { name: "Mecânica", value: 12400 },
      { name: "Elétrica", value: 6800 },
      { name: "Funilaria", value: 4200 },
      { name: "Peças", value: 3150 },
      { name: "Terceiros", value: 9200 },
    ],
  };
};
