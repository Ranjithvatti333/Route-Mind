"use client";

import { useMemo, useState } from "react";
import { Card, ChartCard } from "@/components/ui/Card";
import { CrowdBadge } from "@/components/ui/Badges";
import { CrowdTimelineChart } from "@/components/charts";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { FilterBar, FilterSelect } from "@/components/ui/Filters";
import { useApiData } from "@/hooks/useApiData";
import { crowdService, routesService } from "@/services";
import { DEMO_ROUTES } from "@/data/routes";

const LEVEL_DEFS = [
  { level: "Low", desc: "Plenty of seats available", color: "bg-emerald-500" },
  { level: "Moderate", desc: "Seats filling, standing room comfortable", color: "bg-amber-500" },
  { level: "High", desc: "Standing room only, boarding delays likely", color: "bg-orange-500" },
  { level: "Critical", desc: "Over capacity — some passengers may be left behind", color: "bg-red-500" },
];

export function CrowdExplorer() {
  const [routeId, setRouteId] = useState("R101");
  const [date, setDate] = useState("today");
  const [time, setTime] = useState("18:00");

  const routesState = useApiData(() => routesService.list());
  const forecastState = useApiData(() => crowdService.forecast(routeId, date), [routeId, date]);

  const routeOptions = useMemo(
    () => (routesState.data ?? DEMO_ROUTES).map((r) => ({ value: r.id, label: `${r.id} — ${r.source} → ${r.destination}` })),
    [routesState.data],
  );

  const selectedPoint = useMemo(() => {
    const points = forecastState.data?.points ?? [];
    // Nearest hour slot to the selected time.
    const hour = Number(time.split(":")[0]);
    return points.reduce<(typeof points)[number] | undefined>((best, p) => {
      const pHour = Number(p.time.split(" ")[0]) + (p.time.endsWith("PM") && !p.time.startsWith("12") ? 12 : 0);
      if (best === undefined) return p;
      const bHour = Number(best.time.split(" ")[0]) + (best.time.endsWith("PM") && !best.time.startsWith("12") ? 12 : 0);
      return Math.abs(pHour - hour) < Math.abs(bHour - hour) ? p : best;
    }, undefined);
  }, [forecastState.data, time]);

  return (
    <div>
      <FilterBar className="mb-6">
        <FilterSelect
          label="Route"
          value={routeId}
          onChange={setRouteId}
          options={routeOptions.length ? routeOptions : [{ value: routeId, label: routeId }]}
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
          label="Time"
          value={time}
          onChange={setTime}
          options={Array.from({ length: 35 }, (_, i) => {
            const h = 5 + Math.floor(i / 2);
            const m = i % 2 === 0 ? "00" : "30";
            return { value: `${String(h).padStart(2, "0")}:${m}`, label: `${String(h).padStart(2, "0")}:${m}` };
          })}
        />
      </FilterBar>

      {forecastState.isLoading && <Card><LoadingState label="Loading crowd forecast…" /></Card>}
      {forecastState.error && <Card><ErrorState message={forecastState.error.message} onRetry={forecastState.refetch} /></Card>}

      {!forecastState.isLoading && !forecastState.error && forecastState.data && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ChartCard
              title={`Route ${routeId} — predicted utilization by hour`}
              subtitle={`Bars are colored by expected crowd level · ${date === "tomorrow" ? "tomorrow's" : "today's"} hourly forecast, 5 AM to 10 PM`}
            >
              <CrowdTimelineChart
                points={forecastState.data.points}
                height={300}
                highlightTime={selectedPoint?.time}
              />
            </ChartCard>

            <Card className="p-5">
              <h2 className="text-sm font-bold text-slate-900">Crowd levels explained</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {LEVEL_DEFS.map((l) => (
                  <li key={l.level} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${l.color}`} aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{l.level}</p>
                      <p className="text-xs text-slate-500">{l.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="text-sm font-bold text-slate-900">At {time}</h2>
              {selectedPoint ? (
                <div className="mt-3">
                  <CrowdBadge level={selectedPoint.crowd} />
                  <p className="mt-3 text-4xl font-bold tabular-nums text-slate-900">
                    {selectedPoint.utilization}%
                  </p>
                  <p className="text-xs text-slate-500">predicted capacity utilization</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No forecast slot near this time.</p>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-bold text-slate-900">Route snapshot</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Current utilization", `${forecastState.data.currentUtilization}%`],
                  ["Peak predicted", `${forecastState.data.predictedUtilization}%`],
                  ["Fleet capacity (seats)", forecastState.data.capacity.toLocaleString("en-IN")],
                  ["Prediction confidence", `${forecastState.data.confidence}%`],
                  ["Overcrowding ETA", forecastState.data.overcrowdingEta ?? "None expected today"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-semibold tabular-nums text-slate-800">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
