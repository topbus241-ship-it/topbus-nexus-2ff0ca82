/*
  Backend API adapter
  This file replaces the previous mockApi implementation and calls the real backend endpoints at /api/...
  It expects a JWT stored in localStorage under `topbus-token` when auth is used.
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

export const getDashboardMetrics = async (): Promise<DashboardMetric[]> => fetchJson('/api/data/dashboardMetrics');
export const getSectors = async (): Promise<Sector[]> => fetchJson('/api/data/sectors');
export const getVehicles = async (): Promise<Vehicle[]> => fetchJson('/api/data/vehicles');
export const getDrivers = async (): Promise<Driver[]> => fetchJson('/api/data/drivers');
export const getProviders = async (): Promise<Provider[]> => fetchJson('/api/data/providers');
export const getRoutes = async (): Promise<Route[]> => fetchJson('/api/data/routes');
export const getSchedules = async (): Promise<Schedule[]> => fetchJson('/api/data/schedules');
export const getServiceRecords = async (): Promise<ServiceRecord[]> => fetchJson('/api/data/serviceRecords');
export const getDamageRecords = async (): Promise<DamageRecord[]> => fetchJson('/api/data/damageRecords');
export const getFleetStatus = async (): Promise<FleetStatus[]> => fetchJson('/api/data/fleetStatus');
export const getInsights = async (): Promise<Insight[]> => fetchJson('/api/data/insights');
export const getUploadedDocuments = async (): Promise<UploadedDocument[]> => fetchJson('/api/data/uploadedDocuments');
export const getModuleDefinitions = async (): Promise<ModuleDefinition[]> => fetchJson('/api/data/moduleDefinitions');

export const findScheduleByChapaDateTime = async (
  chapa: string,
  date: string,
  time: string,
): Promise<Schedule | null> => {
  const list = await getSchedules();
  return list.find((s) => s.chapa === chapa.trim() && s.date === date.trim() && s.time === time.trim()) ?? null;
};

export const createRecord = async <T extends object>(resource: string, payload: T): Promise<any> => {
  return fetchJson(`/api/data/${resource}`, { method: 'POST', body: JSON.stringify(payload) });
};

export const updateRecord = async <T extends object>(resource: string, id: string, payload: T): Promise<any> => {
  return fetchJson(`/api/data/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
};

export const uploadFile = async (file: File, meta: Record<string, string>): Promise<{ id: string; fileName: string }> => {
  // Backend currently persists uploadedDocuments record; actual file storage should be implemented separately.
  const payload = { fileName: file.name, ...meta };
  return fetchJson('/api/data/uploadedDocuments', { method: 'POST', body: JSON.stringify(payload) });
};

export const generatePdf = async (resource: string, id: string): Promise<{ url: string }> => {
  // If backend provides a PDF generator endpoint
  return fetchJson(`/api/data/${resource}/${id}/pdf`);
};
