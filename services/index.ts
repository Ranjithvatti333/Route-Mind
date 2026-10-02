/**
 * Domain services — one async function per data need.
 * Each function currently falls back to demo data; when the FastAPI backend
 * lands, the request path becomes live automatically via `request()`.
 */

import type {
  AllocationRecommendation,
  CrowdForecast,
  DemandForecast,
  DemandPoint,
  RouteWeatherImpact,
  ServiceAlert,
  SimulationInput,
  SimulationResult,
  TransitBus,
  TransitEvent,
  TransitRoute,
  WeatherReading,
} from "@/lib/types";
import { request } from "./api";
import { fleetStore } from "@/lib/fleetStore";
import {
  DEMO_ALERTS,
  DEMO_EVENTS,
  DEMO_SIMULATION_BASE,
  DEMO_WEATHER,
  DEMO_WEATHER_IMPACT,
  DEFAULT_DAY,
  buildCrowdForecast,
  buildDemandForecast,
  buildHourlyDemand,
  buildMonthlyDemand,
  buildWeeklyDemand,
} from "@/data/intelligence";

// Route/bus reads go through the shared fleet store so Apply Plan and
// Add/Remove Bus changes are visible on every page, not just the allocation view.
export const routesService = {
  list: () => request<TransitRoute[]>("/api/routes", () => fleetStore.getRoutes()),
  get: (id: string) => request<TransitRoute | undefined>(`/api/routes/${id}`, () => fleetStore.getRoute(id)),
};

export const busesService = {
  list: () => request<TransitBus[]>("/api/buses", () => fleetStore.getBuses()),
};

export const alertsService = {
  list: () => request<ServiceAlert[]>("/api/alerts", () => DEMO_ALERTS),
};

export const crowdService = {
  forecast: (routeId: string, date = "today") =>
    request<CrowdForecast | undefined>(
      `/api/crowd/forecast?routeId=${routeId}&date=${date}`,
      () => buildCrowdForecast(routeId, date),
    ),
};

export const weatherService = {
  current: () => request<WeatherReading>("/api/weather/current", () => DEMO_WEATHER),
  impact: () => request<RouteWeatherImpact[]>("/api/weather/impact", () => DEMO_WEATHER_IMPACT),
};

export const eventsService = {
  list: () => request<TransitEvent[]>("/api/events", () => DEMO_EVENTS),
};

export const allocationService = {
  recommendations: () =>
    request<AllocationRecommendation[]>("/api/allocation/recommendations", () =>
      // Store-built rows: currentBuses is the fixed session baseline and
      // recommendedBuses is the proposed allocation after Add/Remove/Apply.
      fleetStore.getRecommendations(),
    ),
};

export const analyticsService = {
  hourlyDemand: (routeId = "all", busId = "all", day: string = DEFAULT_DAY) =>
    request<DemandPoint[]>(`/api/analytics/demand/hourly?routeId=${routeId}&busId=${busId}&day=${day}`, () =>
      buildHourlyDemand(routeId, busId, day),
    ),
  weeklyDemand: (routeId = "all", busId = "all", day: string = DEFAULT_DAY) =>
    request<DemandPoint[]>(`/api/analytics/demand/weekly?routeId=${routeId}&busId=${busId}&day=${day}`, () =>
      buildWeeklyDemand(routeId, busId, day),
    ),
  monthlyDemand: (routeId = "all", busId = "all", day: string = DEFAULT_DAY) =>
    request<DemandPoint[]>(`/api/analytics/demand/monthly?routeId=${routeId}&busId=${busId}&day=${day}`, () =>
      buildMonthlyDemand(routeId, busId, day),
    ),
};

export const forecastService = {
  demand: (routeId: string, horizon: string, date = "today") =>
    request<DemandForecast>(
      `/api/forecast/demand?routeId=${routeId}&horizon=${horizon}&date=${date}`,
      () => buildDemandForecast(routeId, horizon, date),
    ),
};

export const simulationService = {
  run: (input: SimulationInput) =>
    // In demo mode this performs a deterministic client-side approximation —
    // the real engine lives in the FastAPI/ML backend and will be wired here.
    request<SimulationResult>("/api/simulation/run", () => simulateDemo(input), {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

/** Deterministic demo approximation — NOT a real demand model. */
function simulateDemo(input: SimulationInput): SimulationResult {
  const rainFactor = 1 + Math.min(input.rainfallMm, 40) * 0.004; // up to +16%
  const eventFactor = 1 + Math.min(input.eventAttendance, 60000) / 60000 * 0.12;
  const festivalFactor = input.festival ? 1.18 : 1;
  const disruptionFactor = input.disruptedRouteId ? 1.04 : 1;

  const demand = Math.round(DEMO_SIMULATION_BASE.demand * rainFactor * eventFactor * festivalFactor * disruptionFactor);
  const busDelta = input.busAdditions - input.busRemovals;
  const buses = Math.max(60, DEMO_SIMULATION_BASE.busesRequired + busDelta);
  const utilization = Math.round((DEMO_SIMULATION_BASE.avgUtilizationPct * DEMO_SIMULATION_BASE.busesRequired) / buses);
  const waiting = Number(Math.max(2, DEMO_SIMULATION_BASE.avgWaitingTimeMin * (buses / DEMO_SIMULATION_BASE.busesRequired)).toFixed(1));
  const revenue = Math.round(DEMO_SIMULATION_BASE.revenueInr * rainFactor * eventFactor * festivalFactor);
  const cost = Math.round(DEMO_SIMULATION_BASE.operatingCostInr * (buses / DEMO_SIMULATION_BASE.busesRequired));
  const overcrowded = Math.max(
    0,
    DEMO_SIMULATION_BASE.overcrowdedRoutes +
      (input.disruptedRouteId ? 1 : 0) +
      (utilization > 85 ? 1 : 0) -
      (utilization < 70 ? 1 : 0),
  );

  return {
    demand,
    avgUtilizationPct: utilization,
    avgWaitingTimeMin: waiting,
    revenueInr: revenue,
    operatingCostInr: cost,
    busesRequired: buses,
    overcrowdedRoutes: overcrowded,
  };
}
