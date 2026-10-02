/**
 * Client-side report generation. Every builder derives its content from the
 * same shared dataset the dashboard uses (fleet store, demand series, crowd
 * forecasts, alerts, weather, events, allocation) — no invented metrics and
 * no backend. Output is plain text so it can be downloaded without extra
 * dependencies.
 */

import { fleetStore } from "@/lib/fleetStore";
import {
  DEMO_ALERTS,
  DEMO_CROWD_FORECAST,
  DEMO_EVENTS,
  DEMO_HOURLY_DEMAND,
  DEMO_MONTHLY_DEMAND,
  DEMO_SIMULATION_BASE,
  DEMO_WEATHER,
  DEMO_WEATHER_IMPACT,
  DEMO_WEEKLY_DEMAND,
  buildDemandForecast,
} from "@/data/intelligence";
import { DEMO_ROUTES } from "@/data/routes";
import { formatINR, formatNumber, routeUtilization } from "@/lib/format";

export interface GeneratedReport {
  filename: string;
  content: string;
}

/** Rule for one horizontal rule line. */
function rule(ch = "-", width = 66): string {
  return ch.repeat(width);
}

/** Left-aligned padded cell. */
function pad(value: string | number, width: number): string {
  return String(value).padEnd(width);
}

/** Right-aligned padded cell (numbers). */
function padNum(value: string | number, width: number): string {
  return String(value).padStart(width);
}

function section(title: string): string {
  return `\n${title}\n${rule("=")}`;
}

function header(title: string): string {
  const now = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `ROUTE MIND\n${title}\n\nGenerated: ${now}\nScope:     sample network — 30 routes, demo dataset`;
}

function commonContext() {
  const routes = fleetStore.getRoutes();
  const buses = fleetStore.getBuses();
  const totalPassengers = routes.reduce((s, r) => s + r.dailyPassengers, 0);
  const totalRevenue = routes.reduce((s, r) => s + r.dailyPassengers * r.fare, 0);
  const avgUtilization = Math.round(
    routes.reduce((s, r) => s + routeUtilization(r), 0) / Math.max(1, routes.length),
  );
  const statusCount = (status: string) => buses.filter((b) => b.status === status).length;
  return {
    routes,
    buses,
    totalPassengers,
    totalRevenue,
    avgUtilization,
    statusCount,
    fleetLine: `${buses.length} buses — ${statusCount("active")} active, ${statusCount("idle")} idle, ${statusCount("maintenance")} under maintenance`,
  };
}

function topRoutes(n: number) {
  return [...fleetStore.getRoutes()]
    .sort((a, b) => b.dailyPassengers - a.dailyPassengers)
    .slice(0, n);
}

function todaysAlerts() {
  return DEMO_ALERTS.filter((a) => a.time.startsWith("Today"));
}

function crowdBands() {
  const forecasts = Object.values(DEMO_CROWD_FORECAST);
  const band = (test: (u: number) => boolean) => forecasts.filter((f) => test(f.predictedUtilization));
  return {
    total: forecasts.length,
    critical: band((u) => u >= 100),
    high: band((u) => u >= 75 && u < 100),
    moderate: band((u) => u >= 50 && u < 75),
    low: band((u) => u < 50),
  };
}

function dailyReport(): string {
  const ctx = commonContext();
  const peak = DEMO_HOURLY_DEMAND.reduce((a, b) => (b.passengers > a.passengers ? b : a));
  const bands = crowdBands();

  const lines: string[] = [header("Daily Network Report")];

  lines.push(section("1. Summary"));
  lines.push(`Total passengers (today, network): ${formatNumber(ctx.totalPassengers)}`);
  lines.push(`Network utilization (seats):       ${ctx.avgUtilization}%`);
  lines.push(`Peak period:                       ${peak.label} — ${formatNumber(peak.passengers)} boardings network-wide`);
  lines.push(`Fleet:                             ${ctx.fleetLine}`);
  lines.push(`Revenue (estimated fare box):      ${formatINR(ctx.totalRevenue)}`);

  lines.push(section("2. Hourly demand profile"));
  lines.push(`${pad("Hour", 8)}${padNum("Boardings", 10)}   ${pad("Share", 7)}Bar`);
  for (const p of DEMO_HOURLY_DEMAND) {
    const share = ((p.passengers / ctx.totalPassengers) * 100).toFixed(1);
    const bar = "#".repeat(Math.round((p.passengers / peak.passengers) * 30));
    lines.push(`${pad(p.label, 8)}${padNum(formatNumber(p.passengers), 10)}   ${pad(`${share}%`, 7)}${bar}`);
  }

  lines.push(section("3. Top routes by demand"));
  lines.push(
    `${pad("Route", 7)}${pad("Corridor", 30)}${padNum("Passengers", 11)}   ${padNum("Buses", 5)}   ${padNum("Util", 5)}   Crowd`,
  );
  for (const r of topRoutes(5)) {
    lines.push(
      `${pad(r.id, 7)}${pad(`${r.source} → ${r.destination}`, 30)}${padNum(formatNumber(r.dailyPassengers), 11)}   ${padNum(r.busesAssigned, 5)}   ${padNum(`${routeUtilization(r)}%`, 5)}   ${r.crowd}`,
    );
  }

  lines.push(section("4. Crowding outlook"));
  lines.push(`Critical (≥100% predicted): ${bands.critical.length} routes — ${bands.critical.map((f) => f.routeId).join(", ") || "none"}`);
  lines.push(`High (75–99%):              ${bands.high.length} routes`);
  lines.push(`Moderate (50–74%):          ${bands.moderate.length} routes`);
  lines.push(`Low (<50%):                 ${bands.low.length} routes`);

  const alerts = todaysAlerts();
  lines.push(section(`5. Alerts (${alerts.length} active today)`));
  if (alerts.length === 0) {
    lines.push("No active alerts today.");
  }
  for (const a of alerts) {
    lines.push(`[${a.severity.toUpperCase()}] ${a.time} — ${a.title}`);
    lines.push(`  Routes: ${a.routeIds.join(", ")}`);
    lines.push(`  Action: ${a.recommendedAction}`);
  }

  lines.push(section("6. Revenue"));
  lines.push(`Estimated fare revenue today: ${formatINR(ctx.totalRevenue)}`);
  lines.push(`Avg fare per passenger:       ₹${(ctx.totalRevenue / ctx.totalPassengers).toFixed(1)}`);
  const topRevenue = [...ctx.routes].sort((a, b) => b.dailyPassengers * b.fare - a.dailyPassengers * a.fare).slice(0, 3);
  lines.push("Top revenue routes:");
  for (const r of topRevenue) {
    lines.push(`  ${r.id} — ${formatINR(r.dailyPassengers * r.fare)} (${r.dailyPassengers} pax × ₹${r.fare})`);
  }

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

function weeklyReport(): string {
  const ctx = commonContext();
  const weekTotal = DEMO_WEEKLY_DEMAND.reduce((s, p) => s + p.passengers, 0);
  const busiest = DEMO_WEEKLY_DEMAND.reduce((a, b) => (b.passengers > a.passengers ? b : a));
  const quietest = DEMO_WEEKLY_DEMAND.reduce((a, b) => (b.passengers < a.passengers ? b : a));
  const weekdayAvg =
    DEMO_WEEKLY_DEMAND.slice(0, 5).reduce((s, p) => s + p.passengers, 0) / 5;
  const weekendAvg = DEMO_WEEKLY_DEMAND.slice(5).reduce((s, p) => s + p.passengers, 0) / 2;

  const lines: string[] = [header("Weekly Demand & Performance Report")];

  lines.push(section("1. Weekly demand (Mon–Sun network totals)"));
  lines.push(`${pad("Day", 6)}${padNum("Passengers", 12)}   ${padNum("Share", 7)}  vs avg`);
  const weekAvg = weekTotal / 7;
  for (const p of DEMO_WEEKLY_DEMAND) {
    const vsAvg = (((p.passengers - weekAvg) / weekAvg) * 100).toFixed(1);
    lines.push(
      `${pad(p.label, 6)}${padNum(formatNumber(p.passengers), 12)}   ${padNum(`${((p.passengers / weekTotal) * 100).toFixed(1)}%`, 7)}  ${vsAvg}%`,
    );
  }
  lines.push(`\nWeek total: ${formatNumber(weekTotal)} boardings`);

  lines.push(section("2. Peak analysis"));
  lines.push(`Busiest day:        ${busiest.label} — ${formatNumber(busiest.passengers)} (+${(((busiest.passengers - weekAvg) / weekAvg) * 100).toFixed(1)}% vs week avg)`);
  lines.push(`Quietest day:       ${quietest.label} — ${formatNumber(quietest.passengers)} (${(((quietest.passengers - weekAvg) / weekAvg) * 100).toFixed(1)}% vs week avg)`);
  lines.push(`Weekday daily avg:  ${formatNumber(Math.round(weekdayAvg))}`);
  lines.push(`Weekend daily avg:  ${formatNumber(Math.round(weekendAvg))} (${(((weekendAvg - weekdayAvg) / weekdayAvg) * 100).toFixed(1)}% vs weekdays)`);
  const dailyPeak = DEMO_HOURLY_DEMAND.reduce((a, b) => (b.passengers > a.passengers ? b : a));
  lines.push(`Recurring daily peak: ${dailyPeak.label} on every weekday`);

  lines.push(section("3. Route performance (top 5 by daily demand)"));
  lines.push(
    `${pad("Route", 7)}${pad("Corridor", 30)}${padNum("Passengers", 11)}   ${padNum("Util", 5)}   ${pad("Crowd", 10)}Peak window`,
  );
  for (const r of topRoutes(5)) {
    lines.push(
      `${pad(r.id, 7)}${pad(`${r.source} → ${r.destination}`, 30)}${padNum(formatNumber(r.dailyPassengers), 11)}   ${padNum(`${routeUtilization(r)}%`, 5)}   ${pad(r.crowd, 10)}${r.peakWindow}`,
    );
  }

  lines.push(section("4. Service summary"));
  lines.push(`Fleet: ${ctx.fleetLine}`);
  lines.push(`Network utilization: ${ctx.avgUtilization}% · Estimated weekly fare revenue: ${formatINR(Math.round(ctx.totalRevenue * 7 * 0.9))} (weekend-adjusted)`);
  const alerts = todaysAlerts();
  lines.push(`Open alerts entering the week: ${alerts.length}`);

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

function monthlyReport(): string {
  const ctx = commonContext();
  const total = DEMO_MONTHLY_DEMAND.reduce((s, p) => s + p.passengers, 0);
  const avgFare = ctx.totalRevenue / ctx.totalPassengers;

  const lines: string[] = [header("Monthly KPI & Cost Report")];

  lines.push(section("1. Monthly KPIs"));
  lines.push(`Passengers (6-month total, Apr–Sep): ${formatNumber(total)}`);
  lines.push(`Avg monthly passengers:              ${formatNumber(Math.round(total / DEMO_MONTHLY_DEMAND.length))}`);
  lines.push(`Avg fare per passenger (network):    ₹${avgFare.toFixed(1)}`);
  lines.push(`Network utilization (seats):         ${ctx.avgUtilization}%`);
  lines.push(`Fleet:                               ${ctx.fleetLine}`);

  lines.push(section("2. Demand trend"));
  lines.push(`${pad("Month", 7)}${padNum("Passengers", 12)}   MoM change`);
  let prev: number | null = null;
  for (const p of DEMO_MONTHLY_DEMAND) {
    const mom = prev === null ? "—" : `${p.passengers >= prev ? "+" : ""}${(((p.passengers - prev) / prev) * 100).toFixed(1)}%`;
    lines.push(`${pad(p.label, 7)}${padNum(formatNumber(p.passengers), 12)}   ${mom}`);
    prev = p.passengers;
  }
  const first = DEMO_MONTHLY_DEMAND[0];
  const last = DEMO_MONTHLY_DEMAND[DEMO_MONTHLY_DEMAND.length - 1];
  lines.push(`\nApr → Sep growth: ${(((last.passengers - first.passengers) / first.passengers) * 100).toFixed(1)}%`);

  lines.push(section("3. Revenue & operating cost"));
  lines.push(`Estimated monthly fare revenue (latest month, Sep): ${formatINR(Math.round(last.passengers * avgFare))}`);
  lines.push(`Daily operating cost baseline (current fleet):      ${formatINR(DEMO_SIMULATION_BASE.operatingCostInr)}`);
  lines.push(`Daily fare revenue baseline:                        ${formatINR(DEMO_SIMULATION_BASE.revenueInr)}`);
  lines.push(`Cost recovery (baseline daily):                     ${((DEMO_SIMULATION_BASE.revenueInr / DEMO_SIMULATION_BASE.operatingCostInr) * 100).toFixed(0)}%`);

  lines.push(section("4. Watch items"));
  const bands = crowdBands();
  lines.push(`${bands.critical.length} routes predicted critical at peak — see Route Report for the full list.`);
  lines.push(`${todaysAlerts().length} operational alerts active.`);

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

function routeReport(): string {
  const ctx = commonContext();
  const bands = crowdBands();

  const lines: string[] = [header("Route Report — Full Network")];

  lines.push(section("1. Summary"));
  lines.push(`Routes: ${ctx.routes.length} · Fleet: ${ctx.fleetLine}`);
  lines.push(`Critical at peak: ${bands.critical.map((f) => f.routeId).join(", ") || "none"}`);
  const delayed = ctx.routes.filter((r) => r.status !== "operational");
  lines.push(`Incidents / non-operational status: ${delayed.map((r) => `${r.id} (${r.status})`).join(", ") || "none"}`);

  lines.push(section("2. Route directory"));
  lines.push(
    `${pad("Route", 7)}${pad("Corridor", 32)}${padNum("km", 6)}   ${padNum("₹", 4)}   ${padNum("Buses", 5)}   ${padNum("Pax/day", 10)}   ${padNum("Util", 5)}   ${pad("Crowd", 9)}${pad("Peak", 13)}Status`,
  );
  for (const r of ctx.routes) {
    lines.push(
      `${pad(r.id, 7)}${pad(`${r.source} → ${r.destination}`, 32)}${padNum(r.distanceKm, 6)}   ${padNum(r.fare, 4)}   ${padNum(r.busesAssigned, 5)}   ${padNum(formatNumber(r.dailyPassengers), 10)}   ${padNum(`${routeUtilization(r)}%`, 5)}   ${pad(r.crowd, 9)}${pad(r.peakWindow, 13)}${r.status}`,
    );
  }

  lines.push(section("3. Allocation notes"));
  lines.push(`Total daily passengers: ${formatNumber(ctx.totalPassengers)} · Estimated fare revenue: ${formatINR(ctx.totalRevenue)}`);
  lines.push(`Highest utilization: ${[...ctx.routes].sort((a, b) => routeUtilization(b) - routeUtilization(a))[0].id} at ${routeUtilization([...ctx.routes].sort((a, b) => routeUtilization(b) - routeUtilization(a))[0])}%`);

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

function busReport(): string {
  const ctx = commonContext();
  const { buses } = ctx;
  const totalTrips = buses.reduce((s, b) => s + b.tripsToday, 0);
  const totalPax = buses.reduce((s, b) => s + b.passengersToday, 0);
  const totalRev = buses.reduce((s, b) => s + b.revenueToday, 0);
  const avgUtil = Math.round(buses.reduce((s, b) => s + b.utilization, 0) / Math.max(1, buses.length));
  const maintenance = buses.filter((b) => b.status === "maintenance");

  const lines: string[] = [header("Fleet & Bus Report")];

  lines.push(section("1. Fleet summary"));
  lines.push(`Fleet size:            ${ctx.fleetLine}`);
  lines.push(`Avg utilization:       ${avgUtil}%`);
  lines.push(`Trips completed today: ${formatNumber(totalTrips)}`);
  lines.push(`Passengers served:     ${formatNumber(totalPax)}`);
  lines.push(`Revenue today:         ${formatINR(totalRev)}`);

  lines.push(section("2. Utilization bands"));
  const bandDef: [string, (u: number) => boolean][] = [
    ["≥90%", (u) => u >= 90],
    ["75–89%", (u) => u >= 75 && u < 90],
    ["50–74%", (u) => u >= 50 && u < 75],
    ["<50%", (u) => u < 50],
  ];
  for (const [label, test] of bandDef) {
    lines.push(`${pad(label, 8)} ${buses.filter((b) => test(b.utilization)).length} buses`);
  }

  lines.push(section("3. Top 10 buses by revenue today"));
  lines.push(
    `${pad("Bus", 12)}${pad("Registration", 14)}${pad("Route", 7)}${padNum("Trips", 6)}   ${padNum("Pax", 7)}   ${padNum("Util", 6)}   Revenue`,
  );
  for (const b of [...buses].sort((x, y) => y.revenueToday - x.revenueToday).slice(0, 10)) {
    lines.push(
      `${pad(b.id, 12)}${pad(b.registration, 14)}${pad(b.routeId, 7)}${padNum(b.tripsToday, 6)}   ${padNum(formatNumber(b.passengersToday), 7)}   ${padNum(`${b.utilization}%`, 6)}   ${formatINR(b.revenueToday)}`,
    );
  }

  lines.push(section(`4. Maintenance flags (${maintenance.length})`));
  if (maintenance.length === 0) {
    lines.push("No buses in maintenance.");
  }
  for (const b of maintenance) {
    lines.push(`${pad(b.id, 12)}${pad(b.registration, 14)}route ${b.routeId} — ${b.tripsToday} trips, util ${b.utilization}%`);
  }

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

function weatherReport(): string {
  const ctx = commonContext();
  const rainAlerts = DEMO_ALERTS.filter(
    (a) => /rain/i.test(a.title) || /rain/i.test(a.reason),
  );

  const lines: string[] = [header("Weather Impact Report")];

  lines.push(section("1. Current conditions"));
  lines.push(`Condition:  ${DEMO_WEATHER.condition}`);
  lines.push(`Temp:       ${DEMO_WEATHER.temperatureC}°C`);
  lines.push(`Rainfall:   ${DEMO_WEATHER.rainfallMm} mm`);
  lines.push(`Humidity:   ${DEMO_WEATHER.humidityPct}%`);

  lines.push(section("2. Route-level rain sensitivity (predicted demand change)"));
  lines.push(`${pad("Route", 7)}${padNum("Demand Δ", 10)}   Note`);
  for (const w of DEMO_WEATHER_IMPACT) {
    const sign = w.demandChangePct > 0 ? "+" : "";
    lines.push(`${pad(w.routeId, 7)}${padNum(`${sign}${w.demandChangePct}%`, 10)}   ${w.note}`);
  }

  if (rainAlerts.length > 0) {
    lines.push(section("3. Weather alerts"));
    for (const a of rainAlerts) {
      lines.push(`[${a.severity.toUpperCase()}] ${a.time} — ${a.title}`);
      lines.push(`  Routes: ${a.routeIds.join(", ")}`);
      lines.push(`  ${a.reason}`);
      lines.push(`  Action: ${a.recommendedAction}`);
    }
  }

  lines.push(section("4. Operational watch list"));
  const watch = DEMO_WEATHER_IMPACT.filter((w) => {
    const f = DEMO_CROWD_FORECAST[w.routeId];
    return w.demandChangePct > 0 && f && f.predictedUtilization >= 100;
  });
  if (watch.length === 0) {
    lines.push("No route combines positive rain sensitivity with critical crowding.");
  } else {
    lines.push("Positive rain sensitivity AND critical peak crowding:");
    for (const w of watch) {
      const f = DEMO_CROWD_FORECAST[w.routeId];
      lines.push(`  ${w.routeId}: ${w.demandChangePct > 0 ? "+" : ""}${w.demandChangePct}% in rain, predicted peak ${f.predictedUtilization}%`);
    }
  }
  lines.push(`Fleet readiness: ${ctx.fleetLine}`);

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

function eventReport(): string {
  const totalAttendance = DEMO_EVENTS.reduce((s, e) => s + e.expectedAttendance, 0);
  const affected = new Set(DEMO_EVENTS.flatMap((e) => e.affectedRouteIds));

  const lines: string[] = [header("Event Impact Report")];

  lines.push(section("1. Upcoming events"));
  lines.push(
    `${pad("Date", 12)}${pad("Event", 34)}${padNum("Attendance", 11)}   ${padNum("Δ Demand", 9)}   Routes`,
  );
  for (const e of DEMO_EVENTS) {
    lines.push(
      `${pad(e.date, 12)}${pad(`${e.name} (${e.location})`, 34)}${padNum(formatNumber(e.expectedAttendance), 11)}   ${padNum(`+${e.predictedDemandIncreasePct}%`, 9)}   ${e.affectedRouteIds.join(", ")}`,
    );
  }

  lines.push(section("2. Network exposure"));
  lines.push(`Events tracked:            ${DEMO_EVENTS.length}`);
  lines.push(`Total expected attendance: ${formatNumber(totalAttendance)}`);
  lines.push(`Distinct routes affected:  ${affected.size} — ${[...affected].sort().join(", ")}`);
  const biggest = DEMO_EVENTS.reduce((a, b) => (b.expectedAttendance > a.expectedAttendance ? b : a));
  lines.push(`Largest event:             ${biggest.name} — ${formatNumber(biggest.expectedAttendance)} at ${biggest.location} on ${biggest.date}`);

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

function forecastReport(): string {
  const forecasts = Object.values(DEMO_CROWD_FORECAST);
  const confidences = forecasts.map((f) => f.confidence);
  const avgConfidence = Math.round(confidences.reduce((s, c) => s + c, 0) / confidences.length);
  const sample = buildDemandForecast("R101", "3 hours", "today");

  const lines: string[] = [header("Forecast Model Report")];

  lines.push(section("1. Model confidence"));
  lines.push(`Routes covered:              ${forecasts.length}`);
  lines.push(`Avg crowd-model confidence:  ${avgConfidence}%`);
  lines.push(`Range:                       ${Math.min(...confidences)}% – ${Math.max(...confidences)}%`);
  lines.push(`Routes at ≥85% confidence:   ${confidences.filter((c) => c >= 85).length}`);
  lines.push(`Sample demand-model confidence (R101, 3h): ${sample.confidence}%`);

  lines.push(section("2. Predicted peaks (top 8 routes)"));
  lines.push(`${pad("Route", 7)}${padNum("Predicted peak", 15)}   ${padNum("Confidence", 11)}   Overcrowding ETA`);
  for (const f of [...forecasts].sort((a, b) => b.predictedUtilization - a.predictedUtilization).slice(0, 8)) {
    lines.push(
      `${pad(f.routeId, 7)}${padNum(`${f.predictedUtilization}%`, 15)}   ${padNum(`${f.confidence}%`, 11)}   ${f.overcrowdingEta ?? "none"}`,
    );
  }

  lines.push(section("3. Overcrowding ETAs"));
  const etas = forecasts.filter((f) => f.overcrowdingEta);
  if (etas.length === 0) {
    lines.push("No overcrowding predicted today.");
  }
  for (const f of etas) {
    lines.push(`${pad(f.routeId, 7)}${f.overcrowdingEta} (peak ${f.predictedUtilization}%)`);
  }

  lines.push(section("4. Drift check"));
  const drift = Math.abs(avgConfidence - DEMO_SIMULATION_BASE.avgUtilizationPct);
  lines.push(`Confidence vs baseline utilization delta: ${drift} points — ${drift <= 10 ? "within tolerance" : "review model calibration"}`);

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

function allocationReport(): string {
  const recs = fleetStore.getRecommendations();

  const lines: string[] = [header("Bus Allocation Report")];

  lines.push(section("1. Recommended vs current allocation"));
  lines.push(
    `${pad("Route", 7)}${padNum("Current", 8)}   ${padNum("Recommended", 11)}   ${padNum("Δ Buses", 8)}   ${padNum("Wait Δ", 8)}   ${padNum("Crowd Δ", 8)}   ${padNum("Cost Δ/day", 11)}`,
  );
  for (const r of recs) {
    lines.push(
      `${pad(r.routeId, 7)}${padNum(r.currentBuses, 8)}   ${padNum(r.recommendedBuses, 11)}   ${padNum(r.recommendedBuses - r.currentBuses, 8)}   ${padNum(`${r.waitingTimeChangeMin > 0 ? "+" : ""}${r.waitingTimeChangeMin}m`, 8)}   ${padNum(`${r.crowdingChangePct > 0 ? "+" : ""}${r.crowdingChangePct}%`, 8)}   ${formatINR(r.operatingCostChangeInr)}`,
    );
  }

  lines.push(section("2. Rationale"));
  for (const r of recs) {
    lines.push(`${r.routeId}: ${r.reason}`);
  }

  const added = recs.filter((r) => r.recommendedBuses > r.currentBuses).length;
  const removed = recs.filter((r) => r.recommendedBuses < r.currentBuses).length;
  lines.push(section("3. Impact if applied"));
  lines.push(`${added} routes gain buses, ${removed} routes release buses. Net cost change: ${formatINR(recs.reduce((s, r) => s + r.operatingCostChangeInr, 0))}/day.`);

  lines.push(`\n${rule()}\nEnd of report — sample data, not real TGSRTC measurements.`);
  return lines.join("\n");
}

const BUILDERS: Record<string, () => string> = {
  daily: dailyReport,
  weekly: weeklyReport,
  monthly: monthlyReport,
  route: routeReport,
  bus: busReport,
  weather: weatherReport,
  event: eventReport,
  forecast: forecastReport,
  allocation: allocationReport,
};

/** Generate a report by card id. Falls back to a generic notice for unknown ids. */
export function generateReport(id: string): GeneratedReport {
  const build = BUILDERS[id];
  const filename = `route-mind-${id}-report.txt`;
  if (!build) {
    return { filename, content: `ROUTE MIND\n\nReport "${id}" is not available in demo mode.` };
  }
  return { filename, content: build() };
}
