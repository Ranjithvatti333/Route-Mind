/**
 * Route Mind — shared domain types.
 * These mirror the shape the FastAPI backend is expected to return.
 * Demo data lives in `data/` and conforms to these interfaces so the
 * swap to live endpoints is seamless.
 */

export type CrowdLevel = "low" | "moderate" | "high" | "critical";

export type RouteStatus = "operational" | "delayed" | "suspended";

export type AlertSeverity = "critical" | "warning" | "info";

export type BusStatus = "active" | "idle" | "maintenance";

export interface Stop {
  id: string;
  name: string;
  /** Approximate demo coordinates for Hyderabad — replaced by backend geo data. */
  lat: number;
  lng: number;
  sequence: number;
}

export interface TransitRoute {
  id: string; // e.g. "R101"
  source: string;
  destination: string;
  stops: Stop[];
  distanceKm: number;
  travelTimeMin: number;
  fare: number; // INR
  busesAssigned: number;
  dailyPassengers: number;
  capacityPerBus: number;
  crowd: CrowdLevel;
  peakWindow: string; // e.g. "6 PM – 8 PM"
  status: RouteStatus;
}

export interface TransitBus {
  id: string;
  registration: string;
  routeId: string;
  status: BusStatus;
  tripsToday: number;
  passengersToday: number;
  utilization: number; // 0-100
  revenueToday: number; // INR
}

export interface ServiceAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  routeIds: string[];
  time: string;
  reason: string;
  recommendedAction: string;
}

export interface CrowdPoint {
  time: string; // "6 PM"
  crowd: CrowdLevel;
  utilization: number; // predicted % of capacity
}

export interface CrowdForecast {
  routeId: string;
  points: CrowdPoint[];
  currentUtilization: number;
  predictedUtilization: number;
  capacity: number;
  confidence: number; // 0-100
  overcrowdingEta: string | null; // e.g. "~30 minutes"
}

export interface WeatherReading {
  temperatureC: number;
  rainfallMm: number;
  humidityPct: number;
  condition: string;
}

export interface RouteWeatherImpact {
  routeId: string;
  demandChangePct: number; // e.g. +24 / -8
  note: string;
}

export interface TransitEvent {
  id: string;
  name: string;
  location: string;
  date: string;
  expectedAttendance: number;
  affectedRouteIds: string[];
  predictedDemandIncreasePct: number;
  lat: number;
  lng: number;
}

export interface Depot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  busCount: number;
}

export interface AllocationRecommendation {
  routeId: string;
  currentBuses: number;
  recommendedBuses: number;
  waitingTimeChangeMin: number; // negative = improvement
  crowdingChangePct: number; // negative = improvement
  operatingCostChangeInr: number;
  reason: string;
}

export interface DemandPoint {
  label: string;
  passengers: number;
}

export interface ForecastPoint {
  time: string;
  actual: number | null;
  predicted: number | null;
  lower: number | null;
  upper: number | null;
}

export interface DemandForecast {
  routeId: string;
  horizon: string;
  confidence: number;
  points: ForecastPoint[];
}

export interface KpiStat {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}

export interface SimulationInput {
  rainfallMm: number;
  eventAttendance: number;
  festival: boolean;
  availableBuses: number;
  busAdditions: number;
  busRemovals: number;
  disruptedRouteId: string | null;
}

export interface SimulationResult {
  demand: number;
  avgUtilizationPct: number;
  avgWaitingTimeMin: number;
  revenueInr: number;
  operatingCostInr: number;
  busesRequired: number;
  overcrowdedRoutes: number;
}

export interface NetworkMapRoute {
  routeId: string;
  color: string;
  coordinates: [number, number][]; // [lat, lng] polyline
  crowd: CrowdLevel;
}

export interface StopDemand {
  stopId: string;
  name: string;
  lat: number;
  lng: number;
  crowd: CrowdLevel;
}

/** Table cell-friendly row shape used by generic DataTable. */
export interface ReportCard {
  id: string;
  title: string;
  description: string;
  cadence: string;
}

export interface ApiEnvelope<T> {
  data: T;
  source: "api" | "demo";
}
