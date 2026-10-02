"use client";

import { Fragment, useEffect, useState } from "react";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HYDERABAD_CENTER } from "@/data/network";
import { CROWD_META } from "@/lib/format";
import type { Depot, NetworkMapRoute, StopDemand, TransitEvent } from "@/lib/types";

export interface TransportMapProps {
  routes?: NetworkMapRoute[];
  /** Route to spotlight — other corridors render subdued. Single-route maps focus automatically. */
  selectedRouteId?: string | null;
  /** Corridor click handler for click-to-select network views. */
  onSelectRoute?: (routeId: string) => void;
  stops?: StopDemand[];
  depots?: Depot[];
  events?: TransitEvent[];
  showDepots?: boolean;
  showEvents?: boolean;
  /** Small in-map legend explaining only the visual categories in use. */
  showLegend?: boolean;
  height?: string;
  className?: string;
}

/** Dim, desaturated style for corridors that are not in focus. */
const OTHER_ROUTE_STYLE = { color: "#94a3b8", weight: 2, opacity: 0.3 } as const;

/**
 * Standard raster OpenStreetMap tiles — a real geographic basemap with
 * roads, highways and locality labels (Secunderabad, Kukatpally,
 * Charminar…) so the network reads as an actual city map. Keyless.
 */
const BASEMAP_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

/** Fits the view on mount and on focus changes only — never fights user pan/zoom. */
function RouteFitter({
  routes,
  selectedRouteId,
}: {
  routes: NetworkMapRoute[];
  selectedRouteId: string | null;
}) {
  const map = useMap();
  const fitKey = `${routes.map((r) => r.routeId).join(",")}|${selectedRouteId ?? "all"}`;
  useEffect(() => {
    const source = selectedRouteId ? routes.filter((r) => r.routeId === selectedRouteId) : routes;
    if (source.length > 0) {
      map.fitBounds(
        source.flatMap((r) => r.coordinates),
        { padding: [40, 40] },
      );
    }
    // Corridor geometry is static demo data keyed by routeId — fitKey covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, map]);
  return null;
}

function LegendRow({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-2 text-slate-600 first:mt-0">
      <span className="flex w-6 justify-center">{swatch}</span>
      {label}
    </p>
  );
}

/**
 * Leaflet transport network map on standard OpenStreetMap raster tiles.
 * Overview mode draws subdued, distinguishable corridors; focus mode spotlights
 * one route (white casing + bold color), renders its stops in order with
 * origin/destination labels, and dims everything else.
 * Pure client component — load through a `dynamic(..., { ssr: false })` wrapper.
 */
export default function TransportMap({
  routes = [],
  selectedRouteId = null,
  onSelectRoute,
  stops = [],
  depots = [],
  events = [],
  showDepots = false,
  showEvents = false,
  showLegend = false,
  height = "480px",
  className = "",
}: TransportMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Focus mode: explicit selection, or a single-route map (route detail page).
  const focusedId = selectedRouteId ?? (routes.length === 1 ? routes[0].routeId : null);
  const focusedRoute = routes.find((r) => r.routeId === focusedId) ?? null;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 ${className}`} style={{ height }}>
      <MapContainer
        center={HYDERABAD_CENTER}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl
      >
        <TileLayer
          attribution={BASEMAP_ATTRIBUTION}
          url={BASEMAP_URL}
          maxNativeZoom={19}
          maxZoom={19}
        />
        <RouteFitter routes={routes} selectedRouteId={focusedId} />

        {routes.map((route) => {
          const isSelected = route.routeId === focusedId;
          const isDimmed = focusedId != null && !isSelected;
          const isHovered = hoveredId === route.routeId;

          // Out-of-focus corridors recede; everything else rides on a white
          // casing so route colors stay readable over the detailed streets.
          if (isDimmed) {
            return (
              <Polyline
                key={route.routeId}
                positions={route.coordinates}
                pathOptions={OTHER_ROUTE_STYLE}
                eventHandlers={{ click: () => onSelectRoute?.(route.routeId) }}
              >
                <Tooltip sticky>{`Route ${route.routeId} · ${CROWD_META[route.crowd].label} crowd`}</Tooltip>
              </Polyline>
            );
          }

          return (
            <Fragment key={route.routeId}>
              <Polyline
                positions={route.coordinates}
                pathOptions={{
                  color: "#ffffff",
                  weight: isSelected ? 8 : isHovered ? 7 : 5.5,
                  opacity: isSelected ? 0.9 : 0.7,
                }}
                interactive={false}
              />
              <Polyline
                positions={route.coordinates}
                pathOptions={{
                  color: route.color,
                  weight: isSelected ? 4.5 : isHovered ? 3.5 : 2.5,
                  opacity: isSelected || isHovered ? 1 : 0.8,
                }}
                eventHandlers={{
                  click: () => onSelectRoute?.(route.routeId),
                  mouseover: () => setHoveredId(route.routeId),
                  mouseout: () => setHoveredId(null),
                }}
              >
                <Tooltip sticky>{`Route ${route.routeId} · ${CROWD_META[route.crowd].label} crowd`}</Tooltip>
              </Polyline>
            </Fragment>
          );
        })}

        {stops.map((stop, i) => {
          // In focus mode stops belong to the selected route, drawn in route
          // order; otherwise they are network-wide crowding markers.
          const inFocus = focusedId != null;
          return (
            <CircleMarker
              key={stop.stopId}
              center={[stop.lat, stop.lng]}
              radius={inFocus ? 5 : stop.crowd === "critical" ? 9 : stop.crowd === "high" ? 7 : 5}
              pathOptions={
                inFocus
                  ? { color: "#ffffff", weight: 2, fillColor: focusedRoute?.color ?? "#3d4ee4", fillOpacity: 1 }
                  : {
                      color: "#ffffff",
                      weight: 2,
                      fillColor: CROWD_META[stop.crowd].hex,
                      fillOpacity: 0.9,
                    }
              }
            >
              {inFocus ? (
                i === 0 || i === stops.length - 1 ? (
                  <Tooltip
                    permanent
                    direction={i === 0 ? "right" : "left"}
                    offset={i === 0 ? ([10, 0] as [number, number]) : ([-10, 0] as [number, number])}
                    className="rm-stop-label"
                  >
                    {i === 0 ? `${stop.name} · origin` : `${stop.name} · destination`}
                  </Tooltip>
                ) : (
                  <Tooltip>{`Stop ${i + 1} · ${stop.name}`}</Tooltip>
                )
              ) : (
                <CirclePopup stop={stop} />
              )}
            </CircleMarker>
          );
        })}

        {showDepots &&
          depots.map((depot) => (
            <CircleMarker
              key={depot.id}
              center={[depot.lat, depot.lng]}
              radius={8}
              pathOptions={{ color: "#1e293b", weight: 2, fillColor: "#64748b", fillOpacity: 0.9 }}
            >
              <Tooltip>
                <strong>{depot.name}</strong>
                <br />
                ~{depot.busCount} buses
              </Tooltip>
            </CircleMarker>
          ))}

        {showEvents &&
          events.map((event) => (
            <CircleMarker
              key={event.id}
              center={[event.lat, event.lng]}
              radius={11}
              pathOptions={{ color: "#7c3aed", weight: 2, fillColor: "#a78bfa", fillOpacity: 0.45 }}
            >
              <Tooltip>
                <strong>{event.name}</strong>
                <br />
                {event.location} · {event.date}
                <br />
                Expected attendance: {event.expectedAttendance.toLocaleString("en-IN")}
              </Tooltip>
            </CircleMarker>
          ))}
      </MapContainer>

      {showLegend && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-[500] w-52 rounded-xl bg-white/95 p-3.5 text-xs shadow-card ring-1 ring-slate-200">
          {focusedRoute ? (
            <>
              <p className="text-xs font-bold text-slate-900">Route {focusedRoute.routeId}</p>
              <LegendRow
                swatch={<span className="h-1 w-6 rounded-full" style={{ backgroundColor: focusedRoute.color }} />}
                label="Selected route"
              />
              <LegendRow swatch={<span className="h-0.5 w-6 rounded-full bg-slate-400" />} label="Other routes" />
              <LegendRow
                swatch={
                  <span
                    className="h-2.5 w-2.5 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: focusedRoute.color }}
                  />
                }
                label="Stops in route order"
              />
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-900">Network legend</p>
              <LegendRow swatch={<span className="h-0.5 w-6 rounded-full bg-brand-500" />} label="Route corridor" />
              {(["low", "moderate", "high", "critical"] as const).map((level) => (
                <LegendRow
                  key={level}
                  swatch={<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CROWD_META[level].hex }} />}
                  label={`${CROWD_META[level].label} crowding`}
                />
              ))}
              <LegendRow swatch={<span className="h-2.5 w-2.5 rounded-full bg-violet-400 opacity-70" />} label="Event zone" />
              <LegendRow swatch={<span className="h-2.5 w-2.5 rounded-full bg-slate-500" />} label="Depot" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CirclePopup({ stop }: { stop: StopDemand }) {
  return (
    <Tooltip>
      <strong>{stop.name}</strong>
      <br />
      Crowd: {CROWD_META[stop.crowd].label}
    </Tooltip>
  );
}
