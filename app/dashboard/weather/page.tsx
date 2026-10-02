"use client";

import { Card, ChartCard } from "@/components/ui/Card";
import { DataBoundary } from "@/components/ui/States";
import { DemandAreaChart } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { weatherService, analyticsService } from "@/services";
import { formatSignedPct } from "@/lib/format";

const CONDITIONS = [
  { key: "temperatureC", label: "Temperature", unit: "°C" },
  { key: "rainfallMm", label: "Rainfall", unit: "mm" },
  { key: "humidityPct", label: "Humidity", unit: "%" },
] as const;

export default function WeatherPage() {
  const current = useApiData(() => weatherService.current());
  const impact = useApiData(() => weatherService.impact());
  const demand = useApiData(() => analyticsService.hourlyDemand());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Weather</h2>
          <p className="text-sm text-slate-500">Current conditions and learned route impact</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DataBoundary state={current} emptyTitle="No weather data">
          {(w) => (
            <>
              {CONDITIONS.map((c) => (
                <Card key={c.key} className="p-5">
                  <p className="text-sm font-medium text-slate-500">{c.label}</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                    {w[c.key]}
                    <span className="ml-1 text-sm font-medium text-slate-400">{c.unit}</span>
                  </p>
                </Card>
              ))}
              <Card className="p-5 sm:col-span-2 lg:col-span-1">
                <p className="text-sm font-medium text-slate-500">Condition</p>
                <p className="mt-2 text-sm font-semibold leading-snug text-slate-800">{w.condition}</p>
              </Card>
            </>
          )}
        </DataBoundary>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataBoundary state={impact} isEmpty={(i) => i.length === 0} emptyTitle="No impact data">
          {(impacts) => (
            <ChartCard
              title="Weather impact by route"
              subtitle="Predicted demand change in rain — learned per route"
            >
              <ul className="space-y-3">
                {impacts.map((imp) => (
                  <li key={imp.routeId} className="rounded-xl border border-slate-100 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-slate-800">{imp.routeId}</span>
                      <span
                        className={`rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums ${
                          imp.demandChangePct >= 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {formatSignedPct(imp.demandChangePct)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{imp.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
                Route Mind learns route-specific weather relationships — it does not assume rain
                always increases demand.
              </p>
            </ChartCard>
          )}
        </DataBoundary>

        <DataBoundary state={demand} emptyTitle="No demand data">
          {(d) => (
            <ChartCard title="Demand context" subtitle="Hourly boardings today">
              <DemandAreaChart data={d} color="#089086" height={340} />
            </ChartCard>
          )}
        </DataBoundary>
      </div>
    </div>
  );
}
