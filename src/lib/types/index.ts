export type UserRole =
  | "master"
  | "manutencao"
  | "portaria"
  | "operacao"
  | "financeiro"
  | "rh"
  | "abastecimento"
  | "frota";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sectorId?: string;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  moduleCount: number;
  recentRecords: number;
  status: "operacional" | "atencao" | "critico";
}

export type VehicleStatus =
  | "ativo"
  | "manutencao"
  | "parado"
  | "aguardando_peca"
  | "aguardando_terceiro"
  | "liberado"
  | "inativo";

export interface Vehicle {
  id: string;
  number: string;
  type: string;
  status: VehicleStatus;
  note?: string;
}

export interface Driver {
  id: string;
  name: string;
  chapa: string;
  role: string;
  status: "ativo" | "afastado" | "ferias";
  lastSchedule?: string;
  vehicleNumber?: string;
}

export interface Provider {
  id: string;
  name: string;
  serviceType: string;
  status: "ativo" | "inativo";
  servicesCount: number;
  accumulatedValue: number;
}

export interface Route {
  id: string;
  line: string;
  name: string;
  status: "ativa" | "suspensa";
  vehicles: string[];
}

export interface Schedule {
  id: string;
  chapa: string;
  driverName: string;
  vehicleNumber: string;
  line: string;
  routeName: string;
  date: string;
  time: string;
}

export interface ServiceRecord {
  id: string;
  vehicleNumber: string;
  providerName: string;
  executor: string;
  serviceType: string;
  serviceDone: string;
  description?: string;
  value: number;
  authorizer: string;
  status: "registrado" | "em_andamento" | "concluido" | "aguardando";
  createdAt: string;
}

export interface DamageRecord {
  id: string;
  vehicleNumber: string;
  driverName: string;
  chapa: string;
  reporter: string;
  damageType: string;
  affectedPart: string;
  description: string;
  driverVersion?: string;
  portariaVersion?: string;
  item: string;
  quantity: number;
  unitValue: number;
  laborValue: number;
  otherValue: number;
  totalValue: number;
  status: "registrada" | "orcamento" | "aprovada" | "concluida";
  createdAt: string;
}

export interface FleetStatus {
  vehicleNumber: string;
  status: VehicleStatus;
  reason: string;
  responsibleSector: string;
  stoppedAt: string;
  expectedRelease: string;
  priority: "baixa" | "media" | "alta";
}

export type ModuleFieldType =
  | "text"
  | "longtext"
  | "number"
  | "currency"
  | "date"
  | "datetime"
  | "vehicle"
  | "driver"
  | "provider"
  | "line"
  | "route"
  | "photo"
  | "signature"
  | "file"
  | "status"
  | "observation";

export interface ModuleField {
  id: string;
  label: string;
  type: ModuleFieldType;
  required: boolean;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  sectorId: string;
  description: string;
  fields: ModuleField[];
  permissions: UserRole[];
  publishedAt?: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: "info" | "alerta" | "critico";
  category: string;
}

export interface DashboardMetric {
  key: string;
  label: string;
  value: number | string;
  delta?: number;
  unit?: string;
}

export interface UploadedDocument {
  id: string;
  sector: string;
  documentType: string;
  fileName: string;
  note?: string;
  uploadedAt: string;
  uploadedBy: string;
}
