"use client";

import { ChartCard } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataBoundary } from "@/components/ui/States";
import { DemandAreaChart, DemandBarChart } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { analyticsService } from "@/services";
import { formatCompact, formatNumber } from "@/lib/format";

export default function PassengersPage() {
  const hourly = useApiData(() => analyticsService.hourlyDemand());
  const weekly = useApiData(() => analyticsService.weeklyDemand());
  const monthly = useApiData(() => analyticsService.monthlyDemand());

  const hourlyTotal = hourly.data?.reduce((s, p) => s + p.passengers, 0) ?? 0;
  const boardings = Math.round(hourlyTotal * 1.06);
  const alightings = Math.round(hourlyTotal * 0.94);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Passenger Analytics</h2>
          <p className="text-sm text-slate-500">Boardings, alightings and demand patterns</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total passengers (today)" value={formatCompact(hourlyTotal)} delta="+4.2% vs yesterday" deltaPositive />
        <KpiCard label="Boardings" value={formatNumber(boardings)} delta="Board:alight ratio 1.06" />
        <KpiCard label="Alightings" value={formatNumber(alightings)} />
        <KpiCard label="Avg passengers / trip" value="41" delta="Across the fleet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataBoundary state={hourly} emptyTitle="No hourly data">
          {(d) => (
            <ChartCard title="Hourly demand" subtitle="Boardings by hour of day">
              <DemandAreaChart data={d} />
            </ChartCard>
          )}
        </DataBoundary>
        <DataBoundary state={weekly} emptyTitle="No daily data">
          {(d) => (
            <ChartCard title="Daily demand" subtitle="By weekday">
              <DemandBarChart data={d} color="#5b6ff1" />
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
        <DataBoundary state={weekly} emptyTitle="No weekly data">
          {(d) => (
            <ChartCard title="Weekly demand" subtitle="Aggregate per weekday">
              <DemandAreaChart data={d} color="#ea580c" />
            </ChartCard>
          )}
        </DataBoundary>
      </div>
    </div>
  );
}
