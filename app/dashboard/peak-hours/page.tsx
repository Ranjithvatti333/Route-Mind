"use client";

import { ChartCard } from "@/components/ui/Card";
import { DataBoundary } from "@/components/ui/States";
import { DemandBarChart } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { analyticsService, routesService } from "@/services";

/** Simple matrix view: hour intensity by route. */
export default function PeakHoursPage() {
  const demand = useApiData(() => analyticsService.hourlyDemand());
  const routes = useApiData(() => routesService.list());

  const peaks = (routes.data ?? [])
    .map((r) => ({ id: r.id, window: r.peakWindow, pax: r.dailyPassengers }))
    .sort((a, b) => b.pax - a.pax)
    .slice(0, 6);

  const maxDemand = Math.max(...(demand.data ?? []).map((p) => p.passengers), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Peak Hours</h2>
          <p className="text-sm text-slate-500">When the network feels the pressure</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataBoundary state={demand} emptyTitle="No demand data">
            {(d) => (
              <ChartCard title="Demand by hour" subtitle="Network-wide, 5 AM to 10 PM">
                <DemandBarChart data={d} height={320} />
              </ChartCard>
            )}
          </DataBoundary>
        </div>

        <ChartCard title="Top peak windows" subtitle="Routes under most pressure">
          <ol className="space-y-3">
            {peaks.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{p.id}</p>
                  <p className="text-xs text-slate-500">{p.window}</p>
                </div>
                <span className="text-xs font-semibold tabular-nums text-slate-500">
                  {(p.pax / 1000).toFixed(1)}k/day
                </span>
              </li>
            ))}
          </ol>
        </ChartCard>
      </div>

      <DataBoundary state={demand} emptyTitle="No data">
        {(d) => (
          <ChartCard title="Hour intensity matrix" subtitle="Darker = busier hour">
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9 lg:grid-cols-12" role="img" aria-label="Hourly demand intensity heatmap">
              {d.map((p) => {
                const intensity = p.passengers / maxDemand;
                return (
                  <div key={p.label} className="text-center">
                    <div
                      className="h-10 rounded-md"
                      style={{ backgroundColor: `rgba(61, 78, 228, ${0.12 + intensity * 0.85})` }}
                      title={`${p.label}: ${p.passengers.toLocaleString("en-IN")}`}
                    />
                    <span className="mt-1 block text-[10px] text-slate-400">{p.label}</span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        )}
      </DataBoundary>
    </div>
  );
}
