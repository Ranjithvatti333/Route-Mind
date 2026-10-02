"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { CrowdBadge } from "@/components/ui/Badges";
import { MapPanel } from "@/components/map/MapPanel";
import { useApiData } from "@/hooks/useApiData";
import { routesService, alertsService } from "@/services";
import { MAP_ROUTES } from "@/data/routes";
import { STOP_DEMAND, DEPOTS } from "@/data/network";
import { DEMO_EVENTS } from "@/data/intelligence";
import { formatCompact, formatINR } from "@/lib/format";

export default function NetworkPage() {
  const routesState = useApiData(() => routesService.list());
  const alertsState = useApiData(() => alertsService.list());
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const route = useMemo(
    () => (routesState.data ?? []).find((r) => r.id === selectedRoute),
    [routesState.data, selectedRoute],
  );
  const routeAlerts = useMemo(
    () => (alertsState.data ?? []).filter((a) => selectedRoute && a.routeIds.includes(selectedRoute)),
    [alertsState.data, selectedRoute],
  );

  // Focus mode: selected route is spotlighted (others render subdued) and
  // only its own stops are drawn — keeps the 30-route network legible.
  const mapStops =
    route && selectedRoute
      ? route.stops.map((s) => ({ stopId: s.id, name: s.name, lat: s.lat, lng: s.lng, crowd: route.crowd }))
      : STOP_DEMAND;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Network</h2>
          <p className="text-sm text-slate-500">Interactive network — select a route for its operational picture</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-[480px] lg:h-[560px]">
            <MapPanel
              routes={MAP_ROUTES}
              selectedRouteId={selectedRoute}
              onSelectRoute={(id) => setSelectedRoute((prev) => (prev === id ? null : id))}
              stops={mapStops}
              depots={DEPOTS}
              events={DEMO_EVENTS}
              showDepots
              showEvents
              showLegend
              height="100%"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {MAP_ROUTES.map((r) => (
              <button
                key={r.routeId}
                type="button"
                aria-pressed={selectedRoute === r.routeId}
                onClick={() => setSelectedRoute(selectedRoute === r.routeId ? null : r.routeId)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ring-inset transition-colors ${
                  selectedRoute === r.routeId
                    ? "text-white ring-transparent"
                    : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
                }`}
                style={selectedRoute === r.routeId ? { backgroundColor: r.color } : undefined}
              >
                {r.routeId}
              </button>
            ))}
          </div>
        </div>

        <Card className="p-5">
          {route ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Route {route.id}</h3>
                <CrowdBadge level={route.crowd} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {route.source} &rarr; {route.destination}
              </p>

              <dl className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
                {[
                  ["Passenger demand / day", route.dailyPassengers.toLocaleString("en-IN")],
                  ["Current buses", `${route.busesAssigned}`],
                  ["Predicted peak utilization", route.crowd === "critical" ? "118%" : route.crowd === "high" ? "96%" : "72%"],
                  ["Crowding", route.crowd.charAt(0).toUpperCase() + route.crowd.slice(1)],
                  ["Revenue / day", formatINR(route.dailyPassengers * route.fare)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-semibold tabular-nums text-slate-800">{v}</dd>
                  </div>
                ))}
              </dl>

              <h4 className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">Alerts</h4>
              {routeAlerts.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No active alerts on this route.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {routeAlerts.map((a) => (
                    <li key={a.id} className="rounded-xl border border-slate-100 p-3 text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-800">{a.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M9 20l-5.4-5.4a2 2 0 0 1 0-2.8L13.2 2.2H21v7.8l-9.6 9.6a2 2 0 0 1-2.4.4ZM16.5 7.5h.01" strokeLinecap="round" />
              </svg>
              <p className="mt-3 text-sm font-semibold text-slate-700">Select a route</p>
              <p className="mt-1 max-w-56 text-xs text-slate-500">
                Pick a route chip or click a corridor on the map to inspect demand, fleet and alerts.
              </p>
            </div>
          )}
          <p className="mt-4 text-[11px] text-slate-400">
            {selectedRoute ? "Route values for the current service day." : `${formatCompact((routesState.data ?? []).reduce((s, r) => s + r.dailyPassengers, 0))} daily boardings across the network.`}
          </p>
        </Card>
      </div>
    </div>
  );
}
