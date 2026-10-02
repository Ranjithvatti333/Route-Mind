"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, ChartCard } from "@/components/ui/Card";
import { DEMO_ROUTES } from "@/data/routes";
import { DEMO_SCHEDULE, demoDepartures } from "@/data/schedules";

export function SchedulesBrowser() {
  const [routeId, setRouteId] = useState(DEMO_ROUTES[0].id);
  const route = DEMO_ROUTES.find((r) => r.id === routeId) ?? DEMO_ROUTES[0];
  const departures = demoDepartures(route.id, route.travelTimeMin);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-5">
        <h2 className="text-sm font-bold text-slate-900">Select route</h2>
        <ul className="mt-3 space-y-1.5">
          {DEMO_ROUTES.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setRouteId(r.id)}
                aria-pressed={routeId === r.id}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                  routeId === r.id
                    ? "border-brand-200 bg-brand-50 text-brand-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-slate-800 ring-1 ring-slate-200">
                  {r.id}
                </span>
                <span className="truncate">
                  {r.source} &rarr; {r.destination}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <ChartCard
          title={`Route ${route.id} — ${route.source} to ${route.destination}`}
          subtitle={`First bus ${DEMO_SCHEDULE.firstBus} · Last bus ${DEMO_SCHEDULE.lastBus} · Peak headway ${DEMO_SCHEDULE.headwayPeakMin} min · Off-peak ${DEMO_SCHEDULE.headwayOffPeakMin} min`}
        >
          <div className="scroll-slim max-h-[480px] overflow-y-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" className="py-2 pr-4 font-semibold">Departure</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Arrival</th>
                  <th scope="col" className="py-2 font-semibold">Bus type</th>
                </tr>
              </thead>
              <tbody>
                {departures.map((t) => (
                  <tr key={`${route.id}-${t.departure}`} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-4 font-semibold tabular-nums text-slate-800">{t.departure}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-600">{t.arrival}</td>
                    <td className="py-2.5 text-slate-600">{t.busType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
        <p className="text-xs text-slate-400">
          <Link href={`/routes/${route.id}`} className="font-semibold text-brand-600 hover:text-brand-700">
            View full route details &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
