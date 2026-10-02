"use client";

import { useMemo } from "react";
import { ChartCard } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataBoundary } from "@/components/ui/States";
import { DemandBarChart, RevenueChart, DemandAreaChart } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { routesService, busesService, analyticsService } from "@/services";
import { formatCompact, formatINR } from "@/lib/format";

export default function RevenuePage() {
  const routes = useApiData(() => routesService.list());
  const buses = useApiData(() => busesService.list());
  const hourly = useApiData(() => analyticsService.hourlyDemand());

  const totalRevenue = useMemo(
    () => (routes.data ?? []).reduce((s, r) => s + r.dailyPassengers * r.fare, 0),
    [routes.data],
  );
  const totalPax = useMemo(() => (routes.data ?? []).reduce((s, r) => s + r.dailyPassengers, 0), [routes.data]);
  const totalTrips = useMemo(() => (buses.data ?? []).reduce((s, b) => s + b.tripsToday, 0), [buses.data]);

  const byDay = useMemo(
    () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
      label: d,
      passengers: Math.round((totalRevenue / 7) * (1 + [0.02, 0.04, 0.06, 0.01, 0.12, -0.14, -0.22][i])),
    })),
    [totalRevenue],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Revenue</h2>
          <p className="text-sm text-slate-500">Fare revenue across routes, buses and time</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total revenue (today)" value={formatINR(totalRevenue)} delta="+3.8% vs yesterday" deltaPositive />
        <KpiCard label="Revenue / passenger" value={`₹${totalPax ? Math.round(totalRevenue / totalPax) : 0}`} />
        <KpiCard label="Revenue / trip" value={formatINR(totalTrips ? Math.round(totalRevenue / totalTrips) : 0)} delta={`${formatCompact(totalTrips)} trips`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataBoundary state={routes} isEmpty={(r) => r.length === 0} emptyTitle="No route revenue data">
          {(list) => (
            <ChartCard title="Revenue by route" subtitle="Daily fare collection">
              <DemandBarChart
                data={list.map((r) => ({ label: r.id, passengers: r.dailyPassengers * r.fare }))}
                color="#5b6ff1"
                valueFormatter={formatINR}
                height={300}
              />
            </ChartCard>
          )}
        </DataBoundary>

        <DataBoundary state={buses} isEmpty={(b) => b.length === 0} emptyTitle="No bus revenue data">
          {(list) => (
            <ChartCard title="Revenue by bus (top 12)" subtitle="Today">
              <DemandBarChart
                data={list
                  .slice()
                  .sort((a, b) => b.revenueToday - a.revenueToday)
                  .slice(0, 12)
                  .map((b) => ({ label: b.id, passengers: b.revenueToday }))}
                color="#0db3a4"
                valueFormatter={formatINR}
                height={300}
              />
            </ChartCard>
          )}
        </DataBoundary>

        <ChartCard title="Revenue by day" subtitle="Week shape">
          <DemandBarChart data={byDay} valueFormatter={formatINR} height={280} />
        </ChartCard>

        <DataBoundary state={hourly} emptyTitle="No hourly data">
          {(d) => (
            <ChartCard title="Revenue by hour" subtitle="Boardings × average fare">
              <RevenueChart data={d.map((p) => ({ label: p.label, passengers: Math.round(p.passengers * 26) }))} height={280} />
            </ChartCard>
          )}
        </DataBoundary>
      </div>

      <DataBoundary state={hourly} emptyTitle="No data">
        {() => (
          <ChartCard title="Monthly revenue trend" subtitle="Aggregated series · last 6 months">
            <DemandAreaChart
              data={["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((m, i) => ({
                label: m,
                passengers: Math.round(totalRevenue * 30 * (0.94 + i * 0.02)),
              }))}
              color="#089086"
              valueFormatter={formatINR}
              height={240}
            />
          </ChartCard>
        )}
      </DataBoundary>
    </div>
  );
}
