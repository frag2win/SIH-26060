export type StationId = 'bharati' | 'maitri';

export type SubsystemStatus = 'nominal' | 'warning' | 'critical' | 'offline';

export type CommandDomain = 'overview' | 'twin' | 'energy' | 'environment' | 'logistics' | 'ai_audit';

export interface StationModule {
  id: string;
  name: string;
  category: 'power' | 'life_support' | 'science' | 'comms' | 'fuel' | 'logistics';
  status: SubsystemStatus;
  health: number; // 0 - 100%
  temperature: number; // °C
  powerDrawKw: number;
  lastServiceDate: string;
  description: string;
  x: number; // SVG %
  y: number; // SVG %
  subcomponents: {
    name: string;
    metric: string;
    value: string | number;
    status: SubsystemStatus;
  }[];
}

export interface EnvironmentData {
  outsideTemp: number; // °C
  windSpeed: number; // km/h
  windGust: number; // km/h
  windDirection: string;
  windChill: number; // °C
  blizzardStatus: 'None' | 'Moderate' | 'Severe' | 'Category 5 Blizzard';
  barometricPressure: number; // hPa
  geomagneticKp: number; // 0 - 9 Kp index (auroral activity)
  uvIndex: number;
  visibilityKm: number;
  permafrostTemp: number; // °C
  sensorClusters: {
    name: string;
    metric: string;
    status: 'nominal' | 'warning' | 'critical';
  }[];
}

export interface PowerData {
  totalGenerationKw: number;
  totalConsumptionKw: number;
  gridFrequencyHz: number;
  batteryReserveKwh: number;
  batteryCapacityPct: number;
  batteryAutonomyHours: number;
  dieselKw: number;
  windKw: number;
  solarKw: number;
  generators: {
    id: string;
    name: string;
    status: 'online' | 'standby' | 'fault' | 'cooling';
    loadPct: number;
    outputKw: number;
    oilTemp: number;
    coolantTemp: number;
    vibrationMmS: number;
    runtimeHours: number;
  }[];
  solarWindKw: number;
}

export interface FuelLifeSupportData {
  arcticDieselLiters: number;
  fuelMaxCapacityLiters: number;
  fuelBurnRateLitersHr: number;
  fuelDaysRemaining: number;
  fuelLineTemp: number; // °C
  fuelLineHeaterActive: boolean;
  indoorTemp: number; // °C
  indoorOxygenPct: number; // %
  indoorCo2Ppm: number; // ppm
  potableWaterLiters: number;
  waterMaxCapacityLiters: number;
  snowmeltMeltRateLitersHr: number;
  indoorHumidityPct: number;
}

export interface LogisticsData {
  foodReservePct: number;
  foodDaysProjected: number;
  potableWaterDaysProjected: number;
  medicalSuppliesPct: number;
  nextResupplyVoyageDays: number;
  resupplyVesselName: string;
  resupplyWindowStatus: 'Open' | 'Approaching' | 'Closed (Winter Freeze)';
  criticalSparesHealthPct: number;
}

export interface CommsData {
  satelliteLinkStatus: 'locked' | 'degraded' | 'searching' | 'down';
  downlinkMbps: number;
  uplinkMbps: number;
  latencyMs: number;
  packetLossPct: number;
  primaryTransponder: string;
  antennaDeIcerActive: boolean;
}

export interface StationTelemetry {
  stationId: StationId;
  stationName: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  elevationMeters: number;
  timestamp: string;
  overallStatus: SubsystemStatus;
  healthScore: number; // 0 - 100
  activePersonnel: number;
  environment: EnvironmentData;
  power: PowerData;
  fuelLifeSupport: FuelLifeSupportData;
  logistics: LogisticsData;
  comms: CommsData;
  modules: StationModule[];
}

export interface AiPrediction {
  threatLevel: 'low' | 'moderate' | 'high' | 'critical';
  threatScore: number; // 0 - 100
  title: string;
  summary: string;
  rootCause: string;
  timeToImpactHours: number;
  recommendedActions: string[];
  protocolCode: string;
  confidenceScore: number;
  affectedModules: string[];
  timestamp: string;
}

export interface IncidentAlert {
  id: string;
  timestamp: string;
  stationId: StationId;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  sourceModule: string;
  resolved: boolean;
  mitigationProtocol?: string;
}

export type ScenarioPreset = 
  | 'nominal'
  | 'cat5_blizzard'
  | 'gen1_overheat'
  | 'fuel_line_waxing'
  | 'satellite_blackout';
