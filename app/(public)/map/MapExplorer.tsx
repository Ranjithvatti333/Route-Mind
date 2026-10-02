"use client";

import { useMemo, useState } from "react";
import { MapPanel } from "@/components/map/MapPanel";
import { FilterSelect } from "@/components/ui/Filters";
import { MAP_ROUTES, DEMO_ROUTES } from "@/data/routes";
import { STOP_DEMAND, DEPOTS } from "@/data/network";
import { DEMO_EVENTS } from "@/data/intelligence";
import type { StopDemand } from "@/lib/types";

type LayerKey = "routes" | "stops" | "events" | "depots";

const LAYERS: { key: LayerKey; label: string }[] = [
  { key: "routes", label: "Routes" },
  { key: "stops", label: "Stop crowding" },
  { key: "events", label: "Events" },
  { key: "depots", label: "Depots" },
];

export function MapExplorer() {
  const [active, setActive] = useState<Record<LayerKey, boolean>>({
    routes: true,
    stops: true,
    events: true,
    depots: false,
  });
  const [focusRouteId, setFocusRouteId] = useState("all");

  const toggle = (key: LayerKey) => setActive((a) => ({ ...a, [key]: !a[key] }));

  const routeOptions = useMemo(
    () => [
      { value: "all", label: "All routes (network view)" },
      ...DEMO_ROUTES.map((r) => ({ value: r.id, label: `${r.id} — ${r.source} → ${r.destination}` })),
    ],
    [],
  );

  // Focused view: selected corridor is spotlighted by the map itself (others
  // render subdued) and only that route's own stops are drawn.
  const focusedRoute = DEMO_ROUTES.find((r) => r.id === focusRouteId);
  const mapStops: StopDemand[] =
    focusRouteId !== "all" && focusedRoute
      ? focusedRoute.stops.map((s) => ({
          stopId: s.id,
          name: s.name,
          lat: s.lat,
          lng: s.lng,
          crowd: focusedRoute.crowd,
        }))
      : STOP_DEMAND;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Map layers">
        {LAYERS.map((layer) => (
          <button
            key={layer.key}
            type="button"
            aria-pressed={active[layer.key]}
            onClick={() => toggle(layer.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset transition-colors ${
              active[layer.key]
                ? "bg-brand-600 text-white ring-brand-600"
                : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
            }`}
          >
            {layer.label}
          </button>
        ))}
        <div className="ml-auto w-72">
          <FilterSelect
            label="Focus route"
            value={focusRouteId}
            onChange={setFocusRouteId}
            options={routeOptions}
          />
        </div>
      </div>

      <div className="h-[62vh] min-h-[420px]">
        <MapPanel
          routes={active.routes ? MAP_ROUTES : []}
          selectedRouteId={focusRouteId === "all" ? null : focusRouteId}
          onSelectRoute={setFocusRouteId}
          stops={active.stops ? mapStops : []}
          depots={DEPOTS}
          events={DEMO_EVENTS}
          showDepots={active.depots}
          showEvents={active.events}
          showLegend
          height="100%"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Low</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Moderate</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" />High</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Critical</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet-400 opacity-70" />Event zone</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" />Depot</span>
        <span className="ml-auto">Map data &copy; OpenStreetMap contributors</span>
      </div>
    </div>
  );
}
