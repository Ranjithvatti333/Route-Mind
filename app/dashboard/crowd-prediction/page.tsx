"use client";

import { useMemo, useState } from "react";
import { Card, ChartCard } from "@/components/ui/Card";
import { CrowdBadge } from "@/components/ui/Badges";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { FilterSelect, FilterBar } from "@/components/ui/Filters";
import { CrowdTimelineChart, UtilBar } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { crowdService } from "@/services";
import { DEMO_ROUTES } from "@/data/routes";

export default function CrowdPredictionPage() {
  const [routeId, setRouteId] = useState("R101");
  const state = useApiData(() => crowdService.forecast(routeId), [routeId]);

  const routeOptions = useMemo(
    () =>
      DEMO_ROUTES.map((r) => ({
        value: r.id,
        label: `${r.id} — ${r.source} → ${r.destination}`,
      })),
    [],
  );

  const peakPoint = useMemo(() => {
    const pts = state.data?.points ?? [];
    return pts.reduce<(typeof pts)[number] | null>(
      (best, p) => (best === null || p.utilization > best.utilization ? p : best),
      null,
    );
  }, [state.data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Crowd Prediction</h2>
          <p className="text-sm text-slate-500">Short-horizon utilization and overcrowding ETA</p>
        </div>
      </div>

      <FilterBar>
        <FilterSelect
          label="Route"
          value={routeId}
          onChange={setRouteId}
          options={routeOptions}
        />
      </FilterBar>

      {state.isLoading && <Card><LoadingState label="Loading prediction…" /></Card>}
      {state.error && <Card><ErrorState message={state.error.message} onRetry={state.refetch} /></Card>}

      {!state.isLoading && !state.error && state.data && (
        <>
          {state.data.overcrowdingEta && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M12 8v5m0 3h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-red-800">
                  Overcrowding predicted in approximately {state.data.overcrowdingEta.replace("~", "")}
                </p>
                <p className="text-xs text-red-700/80">
                  Route {routeId} is expected to cross 100% utilization — consider deploying standby buses now.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartCard
                title={`Utilization trajectory — route ${routeId}`}
                subtitle="Predicted % of capacity by time · full operating day"
              >
                <CrowdTimelineChart points={state.data.points} height={300} />
              </ChartCard>
            </div>

            <Card className="p-5">
              <h3 className="text-sm font-bold text-slate-900">Prediction snapshot</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Current utilization</p>
                  <UtilBar value={state.data.currentUtilization} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Predicted peak</p>
                  <UtilBar value={state.data.predictedUtilization} />
                </div>
                <dl className="space-y-2.5 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Capacity (seats)</dt>
                    <dd className="font-semibold tabular-nums text-slate-800">{state.data.capacity.toLocaleString("en-IN")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Confidence</dt>
                    <dd className="font-semibold tabular-nums text-slate-800">{state.data.confidence}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Expected level</dt>
                    <dd>
                      <CrowdBadge level={state.data.points[2]?.crowd ?? "moderate"} />
                    </dd>
                  </div>
                </dl>
                <div className="rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500">
                  {peakPoint
                    ? `Peak trajectory for ${routeId}: ${peakPoint.time} → ${peakPoint.utilization}%.`
                    : "No trajectory available."}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
