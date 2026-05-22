/**
 * TopBus OS — Mock API layer.
 *
 * All UI components consume data through these functions only.
 * To migrate to a real backend, replace each function body with `fetch('/api/...')`
 * (or axios) — function signatures and return shapes can remain identical.
 *
 * JWT interceptor placeholder is documented at the bottom of this file.
 */

import {
  dashboardMetricsMock,
  damageRecordsMock,
  driversMock,
  fleetStatusMock,
  insightsMock,
  moduleDefinitionsMock,
  providersMock,
  routesMock,
  schedulesMock,
  sectorsMock,
  serviceRecordsMock,
  uploadedDocumentsMock,
  vehiclesMock,
  sparklinesMock,
  fleetMonthlyMock,
  costBreakdownMock,
  fleetDistributionMock,
  operationalTimelineMock,
} from "@/lib/mocks";
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
} from "@/lib/types";

const delay = <T>(data: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const getDashboardMetrics = (): Promise<DashboardMetric[]> => delay(dashboardMetricsMock);
export const getSectors = (): Promise<Sector[]> => delay(sectorsMock);
export const getVehicles = (): Promise<Vehicle[]> => delay(vehiclesMock);
export const getDrivers = (): Promise<Driver[]> => delay(driversMock);
export const getProviders = (): Promise<Provider[]> => delay(providersMock);
export const getRoutes = (): Promise<Route[]> => delay(routesMock);
export const getSchedules = (): Promise<Schedule[]> => delay(schedulesMock);
export const getServiceRecords = (): Promise<ServiceRecord[]> => delay(serviceRecordsMock);
export const getDamageRecords = (): Promise<DamageRecord[]> => delay(damageRecordsMock);
export const getFleetStatus = (): Promise<FleetStatus[]> => delay(fleetStatusMock);
export const getInsights = (): Promise<Insight[]> => delay(insightsMock);
export const getUploadedDocuments = (): Promise<UploadedDocument[]> => delay(uploadedDocumentsMock);
export const getModuleDefinitions = (): Promise<ModuleDefinition[]> => delay(moduleDefinitionsMock);

export const getAnalytics = () =>
  delay({
    sparklines: sparklinesMock,
    fleetMonthly: fleetMonthlyMock,
    costBreakdown: costBreakdownMock,
    fleetDistribution: fleetDistributionMock,
    operationalTimeline: operationalTimelineMock,
  });

export const findScheduleByChapaDateTime = async (
  chapa: string,
  date: string,
  time: string,
): Promise<Schedule | null> => {
  const list = await getSchedules();
  return (
    list.find(
      (s) =>
        s.chapa === chapa.trim() &&
        s.date === date.trim() &&
        s.time === time.trim(),
    ) ?? null
  );
};

export const createRecord = async <T extends object>(
  resource: string,
  payload: T,
): Promise<T & { id: string }> => {
  // Future: POST /api/${resource}
  console.info("[mockApi.createRecord]", resource, payload);
  return delay({ ...payload, id: `${resource}-${Date.now()}` });
};

export const updateRecord = async <T extends object>(
  resource: string,
  id: string,
  payload: T,
): Promise<T & { id: string }> => {
  console.info("[mockApi.updateRecord]", resource, id, payload);
  return delay({ ...payload, id });
};

export const uploadFile = async (
  file: File,
  meta: Record<string, string>,
): Promise<{ id: string; fileName: string }> => {
  console.info("[mockApi.uploadFile]", file.name, meta);
  return delay({ id: `up-${Date.now()}`, fileName: file.name });
};

export const generatePdf = async (
  resource: string,
  id: string,
): Promise<{ url: string }> => {
  console.info("[mockApi.generatePdf]", resource, id);
  return delay({ url: `/mock-pdf/${resource}/${id}.pdf` });
};

/**
 * JWT interceptor (placeholder for real backend)
 *
 * Example:
 * const token = localStorage.getItem('topbus-token');
 * fetch(url, { headers: { Authorization: `Bearer ${token}` } });
 */
