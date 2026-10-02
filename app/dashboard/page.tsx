"use client";

import Link from "next/link";
import { ChartCard, Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataBoundary } from "@/components/ui/States";
import { SeverityBadge } from "@/components/ui/Badges";
import { DemandAreaChart } from "@/components/charts";
import { MapPanel } from "@/components/map/MapPanel";
import { useApiData } from "@/hooks/useApiData";
import {
  routesService,
  alertsService,
  analyticsService,
  weatherService,
  eventsService,
  allocationService,
} from "@/services";
import { MAP_ROUTES } from "@/data/routes";
import { STOP_DEMAND, DEPOTS } from "@/data/network";
import { formatCompact, formatINR, formatSignedPct, routeUtilization } from "@/lib/format";

const ICONS = {
  pax: <path d="M9 7.5a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4ZM3 19a6 6 0 0 1 12 0M16 5.5a3.2 3.2 0 0 1 0 6m1.4 7.5a6 6 0 0 0-2.2-4.7" />,
  bus: <path d="M5 4h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm-1 8h16M8 4v8m8-8v8M8 21h.01M16 21h.01" />,
  route: <path d="M6 19 9 5m6 14 3-14M4.5 12h15" />,
  gauge: <path d="M12 15l3.5-5M4.5 17.5a8.5 8.5 0 1 1 15 0" />,
  revenue: <path d="M12 3v18M8 7.5c0-1.4 1.8-2.5 4-2.5s4 1.1 4 2.5-1.8 2.5-4 2.5-4 1.1-4 2.5 1.8 2.5 4 2.5 4-1.1 4-2.5" />,
  alert: <path d="M12 4 3 19h18L12 4Zm0 6v4m0 2.5h.01" />,
};

export default function DashboardOverview() {
  const routesState = useApiData(() => routesService.list());
  const alertsState = useApiData(() => alertsService.list());
  const demandState = useApiData(() => analyticsService.hourlyDemand());
  const weatherState = useApiData(() => weatherService.impact());
  const eventsState = useApiData(() => eventsService.list());
  const allocState = useApiData(() => allocationService.recommendations());

  const routes = routesState.data;
  const totalPax = routes?.reduce((s, r) => s + r.dailyPassengers, 0) ?? 0;
  const totalBuses = routes?.reduce((s, r) => s + r.busesAssigned, 0) ?? 0;
  const avgUtil = routes?.length ? Math.round(routes.reduce((s, r) => s + routeUtilization(r), 0) / routes.length) : 0;
  const revenue = routes?.reduce((s, r) => s + r.dailyPassengers * r.fare, 0) ?? 0;
  const overcrowded = routes?.filter((r) => r.crowd === "critical" || r.crowd === "high").length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Network overview</h2>
          <p className="text-sm text-slate-500">Today · Hyderabad workspace</p>
        </div>
      </div>

      {/* KPI row */}
      <DataBoundary state={routesState} isEmpty={(r) => r.length === 0} emptyTitle="No route data">
        {() => (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <KpiCard label="Total passengers" value={formatCompact(totalPax)} delta="+4.2% vs yesterday" deltaPositive icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">{ICONS.pax}</svg>} />
            <KpiCard label="Active buses" value={`${totalBuses}`} delta="3 in maintenance" deltaPositive={false} icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">{ICONS.bus}</svg>} />
            <KpiCard label="Routes" value={`${routes?.length}`} icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">{ICONS.route}</svg>} />
            <KpiCard label="Avg utilization" value={`${avgUtil}%`} delta="+2.1 pts" deltaPositive icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">{ICONS.gauge}</svg>} />
            <KpiCard label="Revenue (today)" value={formatINR(revenue)} delta="+3.8%" deltaPositive icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">{ICONS.revenue}</svg>} />
            <KpiCard label="Overcrowded routes" value={`${overcrowded}`} delta="Needs attention" deltaPositive={false} icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">{ICONS.alert}</svg>} />
          </div>
        )}
      </DataBoundary>

      {/* Demand + alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataBoundary state={demandState} emptyTitle="No demand data">
            {(demand) => (
              <ChartCard title="Hourly demand" subtitle="Network-wide passenger boardings">
                <DemandAreaChart data={demand} height={280} />
              </ChartCard>
            )}
          </DataBoundary>
        </div>

        <DataBoundary state={alertsState} isEmpty={(a) => a.length === 0} emptyTitle="No active alerts">
          {(alerts) => (
            <ChartCard
              title="Crowd alerts"
              subtitle={`${alerts.length} active`}
              action={
                <Link href="/dashboard/alerts" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  View all
                </Link>
              }
            >
              <ul className="space-y-3">
                {alerts.slice(0, 4).map((a) => (
                  <li key={a.id} className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={a.severity} />
                      <span className="text-xs text-slate-400">{a.time}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium leading-snug text-slate-700">{a.title}</p>
                  </li>
                ))}
              </ul>
            </ChartCard>
          )}
        </DataBoundary>
      </div>

      {/* Weather + events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DataBoundary state={weatherState} isEmpty={(w) => w.length === 0} emptyTitle="No weather impact data">
          {(impacts) => (
            <ChartCard
              title="Weather impact by route"
              subtitle="Predicted demand change under current rain forecast"
              action={
                <Link href="/dashboard/weather" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Details
                </Link>
              }
            >
              <ul className="space-y-2.5">
                {impacts.slice(0, 5).map((imp) => (
                  <li key={imp.routeId} className="flex items-center gap-3 text-sm">
                    <span className="w-12 font-bold text-slate-800">{imp.routeId}</span>
                    <div className="relative h-6 flex-1 rounded-md bg-slate-100">
                      <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300" aria-hidden />
                      <div
                        className={`absolute inset-y-0.5 rounded ${imp.demandChangePct >= 0 ? "bg-red-400" : "bg-emerald-400"}`}
                        style={
                          imp.demandChangePct >= 0
                            ? { left: "50%", width: `${Math.min(48, imp.demandChangePct)}%` }
                            : { right: "50%", width: `${Math.min(48, -imp.demandChangePct)}%` }
                        }
                      />
                    </div>
                    <span className={`w-12 text-right font-bold tabular-nums ${imp.demandChangePct >= 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {formatSignedPct(imp.demandChangePct)}
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          )}
        </DataBoundary>

        <DataBoundary state={eventsState} isEmpty={(e) => e.length === 0} emptyTitle="No upcoming events">
          {(events) => (
            <ChartCard
              title="Upcoming events"
              subtitle="Predicted demand surges · upcoming calendar"
              action={
                <Link href="/dashboard/events" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Details
                </Link>
              }
            >
              <ul className="space-y-2.5">
                {events.slice(0, 4).map((ev) => (
                  <li key={ev.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{ev.name}</p>
                      <p className="text-xs text-slate-500">
                        {ev.location} · {ev.date} · {ev.affectedRouteIds.join(", ")}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                      +{ev.predictedDemandIncreasePct}%
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          )}
        </DataBoundary>
      </div>

      {/* Allocation + map */}
      <div className="grid gap-6 lg:grid-cols-5">
        <DataBoundary state={allocState} isEmpty={(a) => a.length === 0} emptyTitle="No recommendations">
          {(recs) => (
            <ChartCard
              title="Bus allocation recommendation"
              subtitle="From the optimization engine · preview"
              className="lg:col-span-2"
              action={
                <Link href="/dashboard/bus-allocation" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Full plan
                </Link>
              }
            >
              <ul className="space-y-4">
                {recs.slice(0, 4).map((rec) => (
                  <li key={rec.routeId} className="flex items-center gap-3">
                    <span className="w-12 text-sm font-bold text-slate-800">{rec.routeId}</span>
                    <span className="text-sm tabular-nums text-slate-400">{rec.currentBuses}</span>
                    <svg viewBox="0 0 16 16" className="h-3 w-3 fill-slate-300" aria-hidden>
                      <path d="M9.3 2.3 15 8l-5.7 5.7-1.4-1.4 3.3-3.3H1v-2h10.2L7.9 3.7l1.4-1.4Z" />
                    </svg>
                    <span
                      className={`rounded-md px-2 py-0.5 text-sm font-bold tabular-nums ${
                        rec.recommendedBuses >= rec.currentBuses ? "bg-brand-50 text-brand-700" : "bg-accent-50 text-accent-700"
                      }`}
                    >
                      {rec.recommendedBuses}
                    </span>
                    <span className="ml-auto text-xs text-slate-400">
                      {rec.waitingTimeChangeMin < 0 ? `${rec.waitingTimeChangeMin} min wait` : `+${rec.waitingTimeChangeMin} min wait`}
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          )}
        </DataBoundary>

        <Card className="overflow-hidden lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Network map</h3>
            <Link href="/dashboard/network" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Open network view
            </Link>
          </div>
          <div className="h-[320px]">
            <MapPanel routes={MAP_ROUTES} stops={STOP_DEMAND} depots={DEPOTS} showDepots height="100%" />
          </div>
        </Card>
      </div>
    </div>
  );
}
