"use client";

import { useMemo, useState } from "react";
import { Card, ChartCard } from "@/components/ui/Card";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { FilterBar, FilterSelect } from "@/components/ui/Filters";
import { ForecastChart } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { forecastService } from "@/services";
import { DEMO_ROUTES } from "@/data/routes";
import { formatCompact } from "@/lib/format";

const HORIZONS = ["30 minutes", "1 hour", "3 hours", "6 hours", "12 hours", "Tomorrow", "7 days"] as const;

export default function ForecastingPage() {
  const [routeId, setRouteId] = useState("R101");
  const [horizon, setHorizon] = useState<string>("3 hours");
  const [date, setDate] = useState("today");

  const forecast = useApiData(() => forecastService.demand(routeId, horizon, date), [routeId, horizon, date]);

  const routeOptions = useMemo(
    () =>
      DEMO_ROUTES.map((r) => ({
        value: r.id,
        label: `${r.id} — ${r.source} → ${r.destination}`,
      })),
    [],
  );

  const peak = useMemo(() => {
    const pts = forecast.data?.points ?? [];
    return pts.reduce((best, p) => ((p.predicted ?? p.actual ?? 0) > (best.predicted ?? best.actual ?? 0) ? p : best), pts[0]);
  }, [forecast.data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Demand Forecast</h2>
          <p className="text-sm text-slate-500">Predicted boardings with confidence intervals</p>
        </div>
      </div>

      <FilterBar>
        <FilterSelect
          label="Route"
          value={routeId}
          onChange={setRouteId}
          options={routeOptions}
        />
        <FilterSelect
          label="Date"
          value={date}
          onChange={setDate}
          options={[
            { value: "today", label: "Today" },
            { value: "tomorrow", label: "Tomorrow" },
          ]}
        />
        <FilterSelect
          label="Time horizon"
          value={horizon}
          onChange={setHorizon}
          options={HORIZONS.map((h) => ({ value: h, label: h }))}
        />
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Peak predicted demand</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
            {forecast.data ? formatCompact(peak?.predicted ?? 0) : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-400">at {peak?.time ?? "—"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Prediction interval</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
            {forecast.data?.points.some((p) => p.lower !== null)
              ? `±${Math.round((((peak?.upper ?? 0) - (peak?.lower ?? 0)) / 2 / (peak?.predicted || 1)) * 100)}%`
              : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-400">at peak point</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Model confidence</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{forecast.data?.confidence ?? "—"}%</p>
          <p className="mt-1 text-xs text-slate-400">{horizon} horizon</p>
        </Card>
      </div>

      {forecast.isLoading && <Card><LoadingState label="Running forecast…" /></Card>}
      {forecast.error && <Card><ErrorState message={forecast.error.message} onRetry={forecast.refetch} /></Card>}
      {!forecast.isLoading && !forecast.error && forecast.data && (
        <ChartCard
          title={`Forecast — ${routeId} — ${date === "tomorrow" ? "Tomorrow" : "Today"}`}
          subtitle={`Historical actuals + predicted demand with ${forecast.data.confidence}% confidence band`}
        >
          <ForecastChart points={forecast.data.points} height={340} />
        </ChartCard>
      )}
      <p className="text-xs text-slate-400">
        Forecast series are served through the same data layer as live predictions.
      </p>
    </div>
  );
}
