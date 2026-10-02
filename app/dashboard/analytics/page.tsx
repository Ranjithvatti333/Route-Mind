"use client";

import { useState } from "react";
import { ChartCard } from "@/components/ui/Card";
import { DataBoundary } from "@/components/ui/States";
import { FilterBar, FilterSelect } from "@/components/ui/Filters";
import { DemandAreaChart, DemandBarChart } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { analyticsService, busesService, routesService } from "@/services";
import {
  ANALYTICS_DAYS,
  DEFAULT_DAY,
  applyDayFactor,
  buildBusHourlyRevenue,
  buildBusHourlyUtilization,
  buildRouteHourlyUtilization,
  dayDemandFactor,
} from "@/data/intelligence";
import { routeUtilization } from "@/lib/format";

const TABS = ["Daily", "Weekly", "Monthly", "Route", "Bus"] as const;
type Tab = (typeof TABS)[number];

const DAY_OPTIONS = ANALYTICS_DAYS.map((d) => ({ value: d, label: d }));

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>("Daily");
  const [routeFilter, setRouteFilter] = useState("all");
  const [busFilter, setBusFilter] = useState("all");
  const [day, setDay] = useState<string>(DEFAULT_DAY);

  const hourly = useApiData(
    () => analyticsService.hourlyDemand(routeFilter, busFilter, day),
    [routeFilter, busFilter, day],
  );
  const weekly = useApiData(
    () => analyticsService.weeklyDemand(routeFilter, busFilter, day),
    [routeFilter, busFilter, day],
  );
  const monthly = useApiData(
    () => analyticsService.monthlyDemand(routeFilter, busFilter, day),
    [routeFilter, busFilter, day],
  );
  const routes = useApiData(() => routesService.list());
  const buses = useApiData(() => busesService.list());

  const routeSelected = routeFilter !== "all";
  const busSelected = busFilter !== "all";
  const dayRevenueFactor = dayDemandFactor(day);

  // Bus tab scope: a selected bus gets its own profiles; otherwise the
  // selected route's fleet, or the whole network rolled up per route.
  const scopedBuses = (buses.data ?? []).filter((b) => b.routeId === routeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Analytics</h2>
          <p className="text-sm text-slate-500">Demand and utilization trends across the network</p>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Analytics period" className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-card">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <FilterBar>
        <FilterSelect label="Day" value={day} onChange={setDay} options={DAY_OPTIONS} />
        <FilterSelect
          label="Route"
          value={routeFilter}
          onChange={setRouteFilter}
          options={[
            { value: "all", label: "All routes" },
            ...(routes.data ?? []).map((r) => ({ value: r.id, label: `${r.id} — ${r.source}` })),
          ]}
        />
        <FilterSelect
          label="Bus"
          value={busFilter}
          onChange={setBusFilter}
          options={[
            { value: "all", label: "All buses" },
            ...(buses.data ?? []).map((b) => ({ value: b.id, label: b.id })),
          ]}
        />
      </FilterBar>

      {(tab === "Daily" || tab === "Weekly" || tab === "Monthly") && (
        <div className="grid gap-6 lg:grid-cols-2">
          <DataBoundary state={hourly} emptyTitle="No hourly data">
            {(d) => (
              <ChartCard
                title="Passenger trend"
                subtitle={
                  busSelected
                    ? `Hourly boardings · ${busFilter} · ${day}`
                    : routeSelected
                      ? `Hourly boardings · ${routeFilter} · ${day}`
                      : `Network hourly boardings · ${day}`
                }
              >
                <DemandAreaChart data={d} />
              </ChartCard>
            )}
          </DataBoundary>
          <DataBoundary state={weekly} emptyTitle="No weekly data">
            {(d) => (
              <ChartCard title="Weekday demand" subtitle={busSelected || routeSelected ? "Mon–Sun totals · current scope" : "Mon–Sun totals"}>
                <DemandBarChart data={d} />
              </ChartCard>
            )}
          </DataBoundary>
          <DataBoundary state={monthly} emptyTitle="No monthly data">
            {(d) => (
              <ChartCard title="Monthly demand" subtitle="Last 6 months">
                <DemandAreaChart data={d} color="#0db3a4" />
              </ChartCard>
            )}
          </DataBoundary>
          <DataBoundary state={weekly} emptyTitle="No data">
            {(d) => (
              <ChartCard title="Weekday vs weekend" subtitle="Weekend dip visible in the data">
                <DemandBarChart
                  data={d.filter((p) => ["Sat", "Sun"].includes(p.label)).concat(d.filter((p) => !["Sat", "Sun"].includes(p.label)).slice(0, 2))}
                  color="#7b94f8"
                />
              </ChartCard>
            )}
          </DataBoundary>
        </div>
      )}

      {tab === "Route" && (
        <DataBoundary state={routes} emptyTitle="No route data">
          {(list) => (
            <div className="grid gap-6 lg:grid-cols-2">
              {routeSelected ? (
                <DataBoundary state={hourly} emptyTitle="No route data">
                  {(d) => (
                    <ChartCard
                      title="Route demand"
                      subtitle={`Hourly boardings · ${busSelected ? busFilter : routeFilter} · ${day}`}
                    >
                      <DemandBarChart data={d} height={320} />
                    </ChartCard>
                  )}
                </DataBoundary>
              ) : (
                <ChartCard title="Route demand" subtitle={`Daily passengers per route · ${day}`}>
                  <DemandBarChart
                    data={list.map((r) => ({ label: r.id, passengers: Math.round(r.dailyPassengers * dayRevenueFactor) }))}
                    height={320}
                  />
                </ChartCard>
              )}
              {routeSelected ? (
                <ChartCard title="Bus utilization by route" subtitle={`Hourly seat utilization · ${routeFilter} · ${day}`}>
                  <DemandBarChart
                    data={buildRouteHourlyUtilization(routeFilter, day)}
                    color="#ea580c"
                    valueFormatter={(v) => `${v}%`}
                    seriesName="Utilization"
                    height={320}
                  />
                </ChartCard>
              ) : (
                <ChartCard title="Bus utilization by route" subtitle={`Approx. seats filled · ${day}`}>
                  <DemandBarChart
                    data={list.map((r) => ({ label: r.id, passengers: applyDayFactor(routeUtilization(r), day) }))}
                    color="#ea580c"
                    valueFormatter={(v) => `${v}%`}
                    seriesName="Utilization"
                    height={320}
                  />
                </ChartCard>
              )}
            </div>
          )}
        </DataBoundary>
      )}

      {tab === "Bus" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {busSelected ? (
            <ChartCard title="Bus utilization distribution" subtitle={`Hourly utilization · ${busFilter} · ${day}`}>
              <DemandBarChart
                data={buildBusHourlyUtilization(busFilter, day)}
                color="#0d9488"
                valueFormatter={(v) => `${v}%`}
                seriesName="Utilization"
              />
            </ChartCard>
          ) : (
            <ChartCard title="Bus utilization distribution" subtitle={routeSelected ? `Utilization · ${routeFilter} fleet · ${day}` : `Utilization per route · ${day}`}>
              <DemandBarChart
                data={
                  routeSelected
                    ? scopedBuses.map((b) => ({ label: b.id, passengers: applyDayFactor(b.utilization, day) }))
                    : (routes.data ?? []).map((r) => ({ label: r.id, passengers: applyDayFactor(routeUtilization(r), day) }))
                }
                color="#0d9488"
                valueFormatter={(v) => `${v}%`}
                seriesName="Utilization"
              />
            </ChartCard>
          )}
          {busSelected ? (
            <ChartCard title="Revenue per bus" subtitle={`Per vehicle · ${busFilter} · ${day}`}>
              <DemandBarChart
                data={buildBusHourlyRevenue(busFilter, day)}
                seriesName="Revenue"
              />
            </ChartCard>
          ) : (
            <ChartCard title="Revenue per bus" subtitle={routeSelected ? `Per vehicle · ${routeFilter} fleet · ${day}` : `Per route · ${day}`}>
              <DemandBarChart
                data={
                  routeSelected
                    ? scopedBuses.map((b) => ({ label: b.id, passengers: Math.round(b.revenueToday * dayRevenueFactor) }))
                    : (routes.data ?? []).map((r) => ({ label: r.id, passengers: Math.round(r.dailyPassengers * r.fare * dayRevenueFactor) }))
                }
                seriesName="Revenue"
              />
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
}
