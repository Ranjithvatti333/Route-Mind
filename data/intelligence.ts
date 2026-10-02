/**
 * Intelligence data — alerts, weather, events, forecasts, allocation,
 * and analytics series. All values are synthetic sample data for the
 * frontend experience. Never present these as real Hyderabad transport
 * measurements.
 */

import type {
  AllocationRecommendation,
  CrowdForecast,
  CrowdLevel,
  CrowdPoint,
  DemandForecast,
  DemandPoint,
  ForecastPoint,
  RouteWeatherImpact,
  ServiceAlert,
  SimulationResult,
  TransitEvent,
  TransitRoute,
  WeatherReading,
} from "@/lib/types";
import { DEMO_BUSES, DEMO_ROUTES, getBus, getRoute } from "./routes";

export const DEMO_ALERTS: ServiceAlert[] = [
  {
    id: "AL-1041",
    severity: "critical",
    title: "R101 expected to exceed capacity around 7:00 PM",
    routeIds: ["R101"],
    time: "Today · 6:10 PM",
    reason: "Predicted demand spike of +31% over typical Tuesday evening; current allocation at 88% utilization.",
    recommendedAction: "Add 3 buses on R101 between 6:30 PM and 8:30 PM from Secunderabad depot standby pool.",
  },
  {
    id: "AL-1040",
    severity: "critical",
    title: "R104 overcrowding forecast across evening peak",
    routeIds: ["R104"],
    time: "Today · 5:45 PM",
    reason: "Utilization projected at 118% by 7:00 PM; festival footfall building near Charminar corridor.",
    recommendedAction: "Reallocate 2 buses from R109 standby and extend headways on short turns.",
  },
  {
    id: "AL-1038",
    severity: "warning",
    title: "Festival activity may increase demand near Central Hyderabad",
    routeIds: ["R107", "R104", "R109"],
    time: "Today · 4:00 PM",
    reason: "Procession route passes Afzalgunj–Charminar stretch between 6 PM and 10 PM.",
    recommendedAction: "Pre-position crowd-control signage; monitor stop-level density every 15 minutes.",
  },
  {
    id: "AL-1035",
    severity: "warning",
    title: "Heavy rain likely on western corridor",
    routeIds: ["R110", "R106"],
    time: "Today · 2:30 PM",
    reason: "Meteorological bulletin indicates 15–25 mm rainfall between 5 PM and 9 PM toward Patancheru.",
    recommendedAction: "Check tire condition on R110 fleet; alert drivers on waterlogged stretches near Miyapur.",
  },
  {
    id: "AL-1031",
    severity: "info",
    title: "Scheduled maintenance for 4 buses on R108",
    routeIds: ["R108"],
    time: "Today · 11:00 AM",
    reason: "Periodic service check due for TS07 UB 1295–1298 at Madhapur workshop.",
    recommendedAction: "No passenger impact expected; standby vehicles available if needed.",
  },
  {
    id: "AL-1029",
    severity: "info",
    title: "Route R110 diversion via ring road",
    routeIds: ["R110"],
    time: "Yesterday · 7:20 PM",
    reason: "Roadwork between Erragadda and Kukatpally until Friday.",
    recommendedAction: "Display diversion notices at affected stops; expect +8 min travel time.",
  },
];

export const DEMO_WEATHER: WeatherReading = {
  temperatureC: 29,
  rainfallMm: 6.5,
  humidityPct: 71,
  condition: "Light rain — cloud cover increasing toward evening",
};

export const DEMO_WEATHER_IMPACT: RouteWeatherImpact[] = [
  { routeId: "R101", demandChangePct: 24, note: "Strong historical rain sensitivity on office commute segment." },
  { routeId: "R102", demandChangePct: 5, note: "Mild effect; metro parallel absorbs most shift." },
  { routeId: "R103", demandChangePct: -8, note: "IT corridor demand dips in rain — remote-work flexibility." },
  { routeId: "R104", demandChangePct: 17, note: "Market corridor; shoppers shift to buses in rain." },
  { routeId: "R106", demandChangePct: 11, note: "Long-haul commuters less likely to switch modes." },
  { routeId: "R110", demandChangePct: 9, note: "Suburban workers depend on this service regardless of rain." },
];

export const DEMO_EVENTS: TransitEvent[] = [
  {
    id: "EV-201",
    name: "Bathukamma Celebrations",
    location: "Tank Bund",
    date: "2026-10-04",
    expectedAttendance: 45000,
    affectedRouteIds: ["R101", "R105", "R114"],
    predictedDemandIncreasePct: 38,
    lat: 17.4165,
    lng: 78.4872,
  },
  {
    id: "EV-202",
    name: "Trade Expo — HITEX",
    location: "Madhapur",
    date: "2026-10-06",
    expectedAttendance: 18000,
    affectedRouteIds: ["R103", "R108", "R112", "R115"],
    predictedDemandIncreasePct: 22,
    lat: 17.4777,
    lng: 78.3762,
  },
  {
    id: "EV-203",
    name: "Cricket Match — Uppal Stadium",
    location: "Uppal",
    date: "2026-10-08",
    expectedAttendance: 32000,
    affectedRouteIds: ["R105", "R114", "R118"],
    predictedDemandIncreasePct: 29,
    lat: 17.4059,
    lng: 78.5516,
  },
  {
    id: "EV-204",
    name: "Charminar Night Market Festival",
    location: "Charminar",
    date: "2026-10-12",
    expectedAttendance: 27000,
    affectedRouteIds: ["R104", "R107", "R113"],
    predictedDemandIncreasePct: 33,
    lat: 17.3616,
    lng: 78.4747,
  },
];

/** Demand series — 24h operating-day shape. */
export const DEMO_HOURLY_DEMAND: DemandPoint[] = [
  { label: "5 AM", passengers: 1400 },
  { label: "6 AM", passengers: 4100 },
  { label: "7 AM", passengers: 8200 },
  { label: "8 AM", passengers: 10700 },
  { label: "9 AM", passengers: 8500 },
  { label: "10 AM", passengers: 6000 },
  { label: "11 AM", passengers: 4900 },
  { label: "12 PM", passengers: 5200 },
  { label: "1 PM", passengers: 5700 },
  { label: "2 PM", passengers: 5000 },
  { label: "3 PM", passengers: 5400 },
  { label: "4 PM", passengers: 6500 },
  { label: "5 PM", passengers: 9800 },
  { label: "6 PM", passengers: 12800 },
  { label: "7 PM", passengers: 13600 },
  { label: "8 PM", passengers: 10100 },
  { label: "9 PM", passengers: 6000 },
  { label: "10 PM", passengers: 3000 },
];

/**
 * Crowd forecast for the full operating day (5:00 AM – 10:00 PM, hourly).
 * Utilization bands: <50 low · 50–74 moderate · 75–99 high · ≥100 critical.
 */

function point(time: string, utilization: number): CrowdPoint {
  const crowd: CrowdLevel =
    utilization >= 100 ? "critical" : utilization >= 75 ? "high" : utilization >= 50 ? "moderate" : "low";
  return { time, crowd, utilization };
}

/** Operating-day hour labels, 5 AM through 10 PM. */
export const OPERATING_HOURS: string[] = [
  "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
  "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM",
];

/** Parse "6 PM – 8 PM" into [startHour, endHour] on the 24h clock. */
function parsePeakWindow(window: string): [number, number] {
  const to24 = (label: string): number => {
    const h = parseInt(label.trim(), 10);
    const pm = /pm/i.test(label);
    return pm && h !== 12 ? h + 12 : !pm && h === 12 ? 0 : h;
  };
  const [a, b] = window.split("–");
  return [to24(a), to24(b ?? a)];
}

/** Target peak utilization per crowd level, ± deterministic route jitter. */
const TARGET_PEAK: Record<CrowdLevel, number> = { low: 54, moderate: 74, high: 94, critical: 114 };

/**
 * Deterministic per-route crowd forecast derived from the route's own
 * characteristics (peak window, crowd level, fleet capacity). The same
 * route always produces the same trajectory — no randomness.
 */
/** Overcrowding ETA from an hourly utilization series (4 PM anchor). */
function overcrowdingEtaFrom(utils: number[]): string | null {
  if (Math.max(...utils) < 100) return null;
  const firstIdx = utils.findIndex((u, i) => i > 11 && u >= 100);
  const hours = firstIdx > 11 ? firstIdx - 11 : 0;
  return hours <= 0 ? "~45 minutes" : hours === 1 ? "~1 hour" : `~${hours} hours`;
}

function crowdForecastFor(route: TransitRoute): CrowdForecast {
  const idx = Number(route.id.slice(1)) - 101;
  const [peakStart, peakEnd] = parsePeakWindow(route.peakWindow);
  const targetPeak = TARGET_PEAK[route.crowd] + (idx % 7) + (idx % 3);
  const maxShape = Math.max(...DEMO_HOURLY_DEMAND.map((p) => p.passengers));

  const shape = OPERATING_HOURS.map((_, i) => {
    const hour = 5 + i;
    const peakBoost =
      hour >= peakStart && hour <= peakEnd ? 1.55 : hour === peakStart - 1 || hour === peakEnd + 1 ? 1.15 : 1;
    const jitter = 1 + (((idx * 7 + hour * 3) % 9) - 4) / 100; // ±4%
    // Route-specific midday bend keeps same-level routes visually distinct.
    const middayBend = 1 + (((idx % 5) - 2) / 100) * Math.min(1, Math.abs(hour - 13.5) / 8);
    return (DEMO_HOURLY_DEMAND[i].passengers / maxShape) * peakBoost * jitter * middayBend;
  });
  const maxRouteShape = Math.max(...shape);
  const utils = shape.map((v) => Math.round((v / maxRouteShape) * targetPeak));
  const points = OPERATING_HOURS.map((time, i) => point(time, utils[i]));

  const predictedUtilization = Math.max(...utils);
  const currentUtilization = utils[11]; // 4 PM anchor

  return {
    routeId: route.id,
    points,
    currentUtilization,
    predictedUtilization,
    capacity: route.busesAssigned * route.capacityPerBus,
    confidence: 82 + (idx % 9),
    overcrowdingEta: overcrowdingEtaFrom(utils),
  };
}

const HAND_TUNED_CROWD: Record<string, CrowdForecast> = {
  R101: {
    routeId: "R101",
    points: [
      point("5 AM", 28), point("6 AM", 42), point("7 AM", 66), point("8 AM", 82),
      point("9 AM", 71), point("10 AM", 58), point("11 AM", 49), point("12 PM", 46),
      point("1 PM", 52), point("2 PM", 55), point("3 PM", 60), point("4 PM", 64),
      point("5 PM", 78), point("6 PM", 88), point("7 PM", 112), point("8 PM", 118),
      point("9 PM", 84), point("10 PM", 52),
    ],
    currentUtilization: 64,
    predictedUtilization: 118,
    capacity: 624,
    confidence: 87,
    overcrowdingEta: "~30 minutes",
  },
  R104: {
    routeId: "R104",
    points: [
      point("5 AM", 26), point("6 AM", 44), point("7 AM", 74), point("8 AM", 92),
      point("9 AM", 78), point("10 AM", 60), point("11 AM", 52), point("12 PM", 50),
      point("1 PM", 54), point("2 PM", 56), point("3 PM", 57), point("4 PM", 58),
      point("5 PM", 82), point("6 PM", 101), point("7 PM", 118), point("8 PM", 92),
      point("9 PM", 61), point("10 PM", 48),
    ],
    currentUtilization: 58,
    predictedUtilization: 118,
    capacity: 572,
    confidence: 84,
    overcrowdingEta: "~1 hour",
  },
  R106: {
    routeId: "R106",
    points: [
      point("5 AM", 22), point("6 AM", 38), point("7 AM", 64), point("8 AM", 84),
      point("9 AM", 72), point("10 AM", 55), point("11 AM", 47), point("12 PM", 44),
      point("1 PM", 49), point("2 PM", 51), point("3 PM", 55), point("4 PM", 41),
      point("5 PM", 62), point("6 PM", 89), point("7 PM", 96), point("8 PM", 88),
      point("9 PM", 55), point("10 PM", 42),
    ],
    currentUtilization: 41,
    predictedUtilization: 96,
    capacity: 832,
    confidence: 82,
    overcrowdingEta: null,
  },
};

/** Every route in the network has its own crowd trajectory. */
export const DEMO_CROWD_FORECAST: Record<string, CrowdForecast> = Object.fromEntries(
  DEMO_ROUTES.map((route) => [route.id, HAND_TUNED_CROWD[route.id] ?? crowdForecastFor(route)]),
);

/**
 * Date-specific crowd forecast. "Today" returns the base trajectory;
 * "tomorrow" applies a deterministic day-ahead adjustment — the morning
 * peak eases, midday holds near normal, and the evening builds harder —
 * plus per-route/per-hour jitter. The same (route, date) pair always
 * produces the same series; no randomness.
 */
export function buildCrowdForecast(routeId: string, date = "today"): CrowdForecast | undefined {
  const base = DEMO_CROWD_FORECAST[routeId];
  if (!base || date !== "tomorrow") return base;
  const idx = Number(routeId.slice(1)) - 101;

  const points = base.points.map((p, i) => {
    const hour = 5 + i;
    const tilt = hour <= 9 ? 0.88 : hour <= 15 ? 0.97 : 1.1;
    const jitter = 1 + (((idx * 11 + hour * 7) % 9) - 4) / 100; // ±4%
    const utilization = Math.min(125, Math.max(5, Math.round(p.utilization * tilt * jitter)));
    return point(p.time, utilization);
  });

  const utils = points.map((p) => p.utilization);
  return {
    routeId,
    points,
    currentUtilization: utils[11], // 4 PM anchor
    predictedUtilization: Math.max(...utils),
    capacity: base.capacity,
    confidence: Math.max(60, base.confidence - 3), // day-ahead slightly less certain
    overcrowdingEta: overcrowdingEtaFrom(utils),
  };
}

/** Allocation recommendations — currentBuses mirror each route's assigned fleet. */
export const DEMO_ALLOCATION: AllocationRecommendation[] = [
  {
    routeId: "R101",
    currentBuses: 12,
    recommendedBuses: 16,
    waitingTimeChangeMin: -3.2,
    crowdingChangePct: -19,
    operatingCostChangeInr: 12400,
    reason: "Evening peak demand forecast exceeds current capacity by 18%. Adding 4 buses keeps utilization under 85% and cuts average wait below 6 minutes.",
  },
  {
    routeId: "R103",
    currentBuses: 14,
    recommendedBuses: 12,
    waitingTimeChangeMin: 1.1,
    crowdingChangePct: 6,
    operatingCostChangeInr: -8900,
    reason: "Midday utilization on R103 averages 54% — two buses can be redeployed to R101 with negligible waiting-time impact.",
  },
  {
    routeId: "R107",
    currentBuses: 15,
    recommendedBuses: 13,
    waitingTimeChangeMin: 0.8,
    crowdingChangePct: 4,
    operatingCostChangeInr: -6200,
    reason: "Short 10.4 km corridor with high frequency; demand models show 13 buses maintain sub-5-minute waits all day.",
  },
  {
    routeId: "R104",
    currentBuses: 11,
    recommendedBuses: 14,
    waitingTimeChangeMin: -2.7,
    crowdingChangePct: -16,
    operatingCostChangeInr: 9300,
    reason: "Festival footfall plus evening peak pushes R104 to critical. Three additional buses absorb the projected surge.",
  },
];

/** Weekly demand — Mon–Sun network totals. */
export const DEMO_WEEKLY_DEMAND: DemandPoint[] = [
  { label: "Mon", passengers: 155000 },
  { label: "Tue", passengers: 159000 },
  { label: "Wed", passengers: 164000 },
  { label: "Thu", passengers: 156000 },
  { label: "Fri", passengers: 177000 },
  { label: "Sat", passengers: 137000 },
  { label: "Sun", passengers: 101000 },
];

export const DEMO_MONTHLY_DEMAND: DemandPoint[] = [
  { label: "Apr", passengers: 4530000 },
  { label: "May", passengers: 4660000 },
  { label: "Jun", passengers: 4860000 },
  { label: "Jul", passengers: 4700000 },
  { label: "Aug", passengers: 4920000 },
  { label: "Sep", passengers: 5070000 },
];

/**
 * Analytics builders — deterministic, filter-aware derivatives of the shared
 * route/bus dataset. The same (day, route, bus) inputs always produce the
 * same series; no randomness. NOT real measurements.
 */

export const ANALYTICS_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;
export type AnalyticsDay = (typeof ANALYTICS_DAYS)[number];

export const DEFAULT_DAY: AnalyticsDay = "Wednesday";

function dayIndex(day: string): number {
  const i = ANALYTICS_DAYS.indexOf(day as AnalyticsDay);
  return i === -1 ? ANALYTICS_DAYS.indexOf(DEFAULT_DAY) : i;
}

/** Total-demand multiplier per day (weekdays higher, weekend dip; Fri peak). */
export function dayDemandFactor(day: string): number {
  const di = dayIndex(day);
  return di <= 4 ? 0.92 + (di % 5) * 0.03 : di === 5 ? 0.85 : 0.62;
}

/** Utilization multiplier per day — demand and seat fill move together. */
function dayUtilFactor(day: string): number {
  const di = dayIndex(day);
  return di <= 4 ? 0.95 + (di % 5) * 0.02 : di === 5 ? 0.8 : 0.62;
}

/** Scale a utilization percentage by the day profile, clamped to a sane band. */
export function applyDayFactor(value: number, day: string): number {
  return Math.round(Math.min(118, Math.max(5, value * dayUtilFactor(day))));
}

/**
 * Network-wide hourly boardings for a day of week. Weekdays keep the
 * commuter double-peak with a per-day tilt; Saturday trades peak strength
 * for a busy midday/afternoon; Sunday is light with one late-afternoon bump.
 */
function networkHourly(day: string): number[] {
  const di = dayIndex(day);
  return DEMO_HOURLY_DEMAND.map((p, i) => {
    const h = 5 + i; // series starts at 5 AM
    const amPeak = h >= 7 && h <= 9;
    const pmPeak = h >= 17 && h <= 19;
    const midday = h >= 11 && h <= 16;
    let v = p.passengers;
    if (di <= 4) {
      v *= 0.92 + (di % 5) * 0.03; // Mon 0.92 … Fri 1.04
      if (amPeak) v *= 1 + (di % 3) * 0.03;
      if (pmPeak) v *= 1.02 + (di % 4) * 0.02;
    } else if (di === 5) {
      if (amPeak || pmPeak) v *= 0.55;
      if (midday) v *= 1.5;
      if (h >= 12 && h <= 18) v *= 1.15;
      v *= 0.85;
    } else {
      if (amPeak) v *= 0.3;
      if (pmPeak) v *= 0.7;
      if (h >= 13 && h <= 18) v *= 1.6;
      v *= 0.62;
    }
    return Math.round(v);
  });
}

/** Resolve the effective route for a (routeId, busId) filter pair — bus implies its route. */
function resolveRoute(routeId: string, busId: string): TransitRoute | undefined {
  if (routeId !== "all") return getRoute(routeId);
  const bus = busId !== "all" ? getBus(busId) : undefined;
  return bus ? getRoute(bus.routeId) : undefined;
}

/** Route's hourly boardings: network day shape re-weighted by the route's own peak window. */
function routeHourlyBoardings(route: TransitRoute, day: string): number[] {
  const idx = Number(route.id.slice(1)) - 101;
  const [peakStart, peakEnd] = parsePeakWindow(route.peakWindow);
  const shape = networkHourly(day);
  const total = shape.reduce((s, v) => s + v, 0);
  return shape.map((v, i) => {
    const h = 5 + i;
    const boost = h >= peakStart && h <= peakEnd ? 1.3 : 1;
    const jitter = 1 + (((idx * 13 + h * 29) % 11) - 5) / 100; // ±5%
    // Day factor keeps the route's daily total day-sensitive (shape
    // normalization alone would cancel the weekend dip).
    return Math.round((v / total) * route.dailyPassengers * dayDemandFactor(day) * boost * jitter);
  });
}

/** Hourly boardings — scales down through network → route → bus. */
export function buildHourlyDemand(routeId: string, busId: string, day: string): DemandPoint[] {
  const bus = busId !== "all" ? getBus(busId) : undefined;
  const route = resolveRoute(routeId, busId);
  const series = route ? routeHourlyBoardings(route, day) : networkHourly(day);
  const share =
    bus && route ? bus.passengersToday / route.dailyPassengers : 1;
  const bIdx = bus ? DEMO_BUSES.indexOf(bus) : 0;
  return DEMO_HOURLY_DEMAND.map((p, i) => {
    let v = series[i] * share;
    if (bus) v *= 1 + (((bIdx * 7 + i * 3) % 9) - 4) / 100; // ±4% per-bus texture
    return { label: p.label, passengers: Math.max(0, Math.round(v)) };
  });
}

/** Mon–Sun totals for the current route/bus scope, reconciled with the hourly day shapes. */
export function buildWeeklyDemand(routeId: string, busId: string, day: string): DemandPoint[] {
  const bus = busId !== "all" ? getBus(busId) : undefined;
  const route = resolveRoute(routeId, busId);
  const dayTotals = ANALYTICS_DAYS.map((d) => networkHourly(d).reduce((s, v) => s + v, 0));
  const share =
    bus && route
      ? bus.passengersToday / route.dailyPassengers
      : route
        ? route.dailyPassengers / DEMO_ROUTES.reduce((s, r) => s + r.dailyPassengers, 0)
        : 1;
  const seed = route ? Number(route.id.slice(1)) : 101;
  const bSeed = bus ? DEMO_BUSES.indexOf(bus) : 0;
  const di = dayIndex(day);
  return ANALYTICS_DAYS.map((d, i) => {
    // Selected day shifts each weekday's estimate deterministically (±12%).
    const jitter = 1 + (((seed * 11 + bSeed * 17 + i * 7 + di * 29) % 25) - 12) / 100;
    return { label: d.slice(0, 3), passengers: Math.max(0, Math.round(dayTotals[i] * share * jitter)) };
  });
}

/** Monthly totals scaled to the current route/bus scope. */
export function buildMonthlyDemand(routeId: string, busId: string, day: string): DemandPoint[] {
  const bus = busId !== "all" ? getBus(busId) : undefined;
  const route = resolveRoute(routeId, busId);
  const share =
    bus && route
      ? bus.passengersToday / route.dailyPassengers
      : route
        ? route.dailyPassengers / DEMO_ROUTES.reduce((s, r) => s + r.dailyPassengers, 0)
        : 1;
  const seed = route ? Number(route.id.slice(1)) : 101;
  const bSeed = bus ? DEMO_BUSES.indexOf(bus) : 0;
  const di = dayIndex(day);
  return DEMO_MONTHLY_DEMAND.map((p, i) => {
    const jitter = 1 + (((seed * 5 + bSeed * 11 + i * 13 + di * 7) % 15) - 7) / 100;
    return { label: p.label, passengers: Math.max(0, Math.round(p.passengers * share * jitter)) };
  });
}

/** Hourly seat utilization for one route on a day — from its own crowd trajectory. */
export function buildRouteHourlyUtilization(routeId: string, day: string): DemandPoint[] {
  const route = getRoute(routeId);
  const forecast = route ? DEMO_CROWD_FORECAST[route.id] : undefined;
  if (!forecast) return [];
  return forecast.points.map((pt) => ({
    label: pt.time,
    passengers: applyDayFactor(pt.utilization, day),
  }));
}

/** Hourly seat utilization for one bus — route trajectory scaled to the vehicle. */
export function buildBusHourlyUtilization(busId: string, day: string): DemandPoint[] {
  const bus = getBus(busId);
  const route = bus ? getRoute(bus.routeId) : undefined;
  const forecast = route ? DEMO_CROWD_FORECAST[route.id] : undefined;
  if (!bus || !forecast) return [];
  const peakUtil = Math.max(...forecast.points.map((p) => p.utilization));
  const rel = peakUtil > 0 ? bus.utilization / peakUtil : 0;
  const bIdx = DEMO_BUSES.indexOf(bus);
  return forecast.points.map((pt, i) => {
    const jitter = 1 + (((bIdx * 7 + i * 5) % 9) - 4) / 100;
    const v = pt.utilization * rel * dayUtilFactor(day) * jitter;
    return { label: pt.time, passengers: Math.min(118, Math.max(5, Math.round(v))) };
  });
}

/** Hourly fare revenue for one bus on a day — boardings × route fare. */
export function buildBusHourlyRevenue(busId: string, day: string): DemandPoint[] {
  const bus = getBus(busId);
  const route = bus ? getRoute(bus.routeId) : undefined;
  if (!bus || !route) return [];
  return buildHourlyDemand(route.id, bus.id, day).map((p) => ({
    label: p.label,
    passengers: p.passengers * route.fare,
  }));
}

/**
 * Deterministic demand-forecast builder. Output depends on all three inputs —
 * route (its own demand profile), horizon (number of predicted points and
 * band width) and date (today vs tomorrow shift) — and is stable for the
 * same inputs. NOT a real ML model.
 */

interface HorizonConfig {
  predictedCount: number;
  stepMin: number;
  bandPct: number;
  confidence: number;
  anchorHour: number; // first predicted hour on the 24h clock
  daily?: boolean;
}

const FORECAST_HORIZONS: Record<string, HorizonConfig> = {
  "30 minutes": { predictedCount: 1, stepMin: 30, bandPct: 6, confidence: 94, anchorHour: 14 },
  "1 hour": { predictedCount: 2, stepMin: 60, bandPct: 8, confidence: 92, anchorHour: 14 },
  "3 hours": { predictedCount: 4, stepMin: 60, bandPct: 10, confidence: 88, anchorHour: 15 },
  "6 hours": { predictedCount: 7, stepMin: 60, bandPct: 13, confidence: 84, anchorHour: 15 },
  "12 hours": { predictedCount: 13, stepMin: 60, bandPct: 16, confidence: 79, anchorHour: 10 },
  Tomorrow: { predictedCount: 18, stepMin: 60, bandPct: 18, confidence: 77, anchorHour: 5 },
  "7 days": { predictedCount: 7, stepMin: 1440, bandPct: 22, confidence: 72, anchorHour: 0, daily: true },
};

function formatForecastTime(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Route's expected boardings at an operating hour (network shape + route demand + peak boost). */
function hourlyRouteDemand(route: TransitRoute, hour: number): number {
  const idx = Number(route.id.slice(1)) - 101;
  const [peakStart, peakEnd] = parsePeakWindow(route.peakWindow);
  const shapeIdx = hour - 5;
  const shape = DEMO_HOURLY_DEMAND[shapeIdx]?.passengers ?? DEMO_HOURLY_DEMAND[0].passengers;
  const total = DEMO_HOURLY_DEMAND.reduce((s, p) => s + p.passengers, 0);
  const peakBoost = hour >= peakStart && hour <= peakEnd ? 1.3 : 1;
  const jitter = 1 + (((idx * 13 + hour * 29) % 11) - 5) / 100; // ±5%
  return Math.round((shape / total) * route.dailyPassengers * peakBoost * jitter);
}

export function buildDemandForecast(routeId: string, horizon: string, date = "today"): DemandForecast {
  const route = DEMO_ROUTES.find((r) => r.id === routeId) ?? DEMO_ROUTES[0];
  const idx = Number(route.id.slice(1)) - 101;
  const cfg = FORECAST_HORIZONS[horizon] ?? FORECAST_HORIZONS["3 hours"];
  // Date shift: deterministic per route AND hour, so tomorrow reshapes the
  // trajectory (not a uniform scale that the chart axis would hide).
  const hourFactor = (hour: number): number =>
    date === "tomorrow" ? 0.96 + ((idx * 3 + hour * 5) % 7) / 100 : 1;

  const points: ForecastPoint[] = [];

  if (cfg.daily) {
    // 7-day horizon: one point per day.
    const dayFactors = [1.02, 1.05, 1.08, 1.03, 1.12, 0.92, 0.74];
    for (let i = 0; i < cfg.predictedCount; i++) {
      const jitter = 1 + (((idx * 11 + i * 17) % 13) - 6) / 100;
      const v = Math.round(route.dailyPassengers * dayFactors[i] * hourFactor(i) * jitter);
      const band = Math.round(v * (cfg.bandPct / 100));
      points.push({ time: `Day ${i + 1}`, actual: null, predicted: v, lower: v - band, upper: v + band });
    }
  } else {
    // Historical tail — three actual hours before the anchor.
    for (let h = cfg.anchorHour - 3; h < cfg.anchorHour; h++) {
      points.push({
        time: formatForecastTime(h * 60),
        actual: Math.round(hourlyRouteDemand(route, h) * hourFactor(h)),
        predicted: null,
        lower: null,
        upper: null,
      });
    }
    for (let i = 0; i < cfg.predictedCount; i++) {
      const minutes = cfg.anchorHour * 60 + i * cfg.stepMin;
      const hour = Math.floor(minutes / 60);
      const jitter = 1 + (((idx * 11 + hour * 17) % 13) - 6) / 100;
      const v = Math.max(1, Math.round(hourlyRouteDemand(route, hour) * hourFactor(hour) * jitter));
      const band = Math.round(v * (cfg.bandPct / 100));
      points.push({
        time: formatForecastTime(minutes),
        actual: null,
        predicted: v,
        lower: Math.max(0, v - band),
        upper: v + band,
      });
    }
  }

  return { routeId: route.id, horizon, confidence: cfg.confidence, points };
}

export const DEMO_SIMULATION_BASE: SimulationResult = {
  demand: 341000,
  avgUtilizationPct: 71,
  avgWaitingTimeMin: 7.4,
  revenueInr: 13070000,
  operatingCostInr: 9120000,
  busesRequired: 351,
  overcrowdedRoutes: 10,
};

export const DEMO_REPORTS = [
  { id: "daily", title: "Daily Report", description: "Network-wide summary: passengers, utilization, alerts, revenue.", cadence: "Daily · 11:59 PM" },
  { id: "weekly", title: "Weekly Report", description: "Week-over-week demand trends, peak analysis, route rankings.", cadence: "Weekly · Monday 6 AM" },
  { id: "monthly", title: "Monthly Report", description: "Monthly KPIs, revenue breakdown, cost efficiency, forecasts.", cadence: "Monthly · 1st 7 AM" },
  { id: "route", title: "Route Report", description: "Per-route deep dive: demand, crowding, allocation, incidents.", cadence: "On demand" },
  { id: "bus", title: "Bus Report", description: "Fleet utilization, trips, revenue per vehicle, maintenance flags.", cadence: "On demand" },
  { id: "weather", title: "Weather Report", description: "Weather correlation analysis and route-level rain sensitivity.", cadence: "Daily · 7 AM" },
  { id: "event", title: "Event Report", description: "Event impact analysis: attendance vs. predicted vs. actual demand.", cadence: "Post-event" },
  { id: "forecast", title: "Forecast Report", description: "Model accuracy tracking, confidence intervals, drift checks.", cadence: "Weekly · Sunday 9 PM" },
  { id: "allocation", title: "Allocation Report", description: "Recommended vs. actual bus allocation and resulting KPIs.", cadence: "Daily · 5 AM" },
];
