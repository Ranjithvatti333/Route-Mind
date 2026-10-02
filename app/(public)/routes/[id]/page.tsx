import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, ChartCard } from "@/components/ui/Card";
import { CrowdBadge, SeverityBadge } from "@/components/ui/Badges";
import { CrowdTimelineChart } from "@/components/charts";
import { MapPanel } from "@/components/map/MapPanel";
import { DEMO_ROUTES, MAP_ROUTES } from "@/data/routes";
import { DEMO_ALERTS, DEMO_CROWD_FORECAST, DEMO_EVENTS, DEMO_WEATHER_IMPACT } from "@/data/intelligence";
import { DEMO_SCHEDULE, demoDepartures } from "@/data/schedules";
import { formatINR } from "@/lib/format";
import { routesService } from "@/services";

export function generateStaticParams() {
  return DEMO_ROUTES.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: route } = await routesService.get(id);
  if (!route) return { title: "Route not found" };
  return {
    title: `Route ${route.id}: ${route.source} to ${route.destination}`,
    description: `Demand, crowding, schedule and weather impact for route ${route.id} (${route.source} – ${route.destination}) on Route Mind.`,
  };
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: route } = await routesService.get(id);
  if (!route) notFound();

  const forecast = DEMO_CROWD_FORECAST[route.id];
  const weatherImpact = DEMO_WEATHER_IMPACT.find((w) => w.routeId === route.id);
  const routeEvents = DEMO_EVENTS.filter((e) => e.affectedRouteIds.includes(route.id));
  const routeAlerts = DEMO_ALERTS.filter((a) => a.routeIds.includes(route.id));
  const mapRoute = MAP_ROUTES.find((m) => m.routeId === route.id);
  const timetable = demoDepartures(route.id, route.travelTimeMin);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-brand-700">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/routes" className="hover:text-brand-700">Routes</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-semibold text-slate-800">{route.id}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-xl bg-brand-600 px-3 py-1.5 text-lg font-bold text-white">
              {route.id}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {route.source} <span className="mx-1 text-slate-300">&rarr;</span> {route.destination}
              </h1>
              <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-500">
                {route.stops.length} stops · {route.distanceKm} km · ~{route.travelTimeMin} min · Fare {formatINR(route.fare)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CrowdBadge level={route.crowd} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {mapRoute && (
            <MapPanel
              routes={[mapRoute]}
              stops={route.stops.map((s, i) => ({
                stopId: s.id,
                name: s.name,
                lat: s.lat,
                lng: s.lng,
                crowd: forecast?.points[Math.min(i, forecast.points.length - 1)]?.crowd ?? route.crowd,
              }))}
              height="340px"
            />
          )}

          {/* Route timeline */}
          <ChartCard title="Route timeline" subtitle="Stop sequence with indicative running time">
            <ol className="relative space-y-0 border-l-2 border-slate-100 pl-6">
              {route.stops.map((stop, i) => (
                <li key={stop.id} className="relative pb-6 last:pb-0">
                  <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-500 bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">
                      {i + 1}. {stop.name}
                    </p>
                    <p className="text-xs tabular-nums text-slate-400">
                      ~{Math.round((route.travelTimeMin / (route.stops.length - 1)) * i)} min from origin
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </ChartCard>

          {/* Crowd forecast */}
          {forecast && (
            <ChartCard
              title="Crowd forecast — today"
              subtitle={`Predicted utilization vs capacity (${forecast.capacity} seats) · confidence ${forecast.confidence}%`}
            >
              <CrowdTimelineChart points={forecast.points} />
            </ChartCard>
          )}

          {/* Schedule */}
          <ChartCard
            title="Schedule"
            subtitle={`First bus ${DEMO_SCHEDULE.firstBus} · Last bus ${DEMO_SCHEDULE.lastBus} · Peak headway ${DEMO_SCHEDULE.headwayPeakMin} min`}
          >
            <div className="scroll-slim max-h-72 overflow-y-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th scope="col" className="py-2 pr-4 font-semibold">Departure</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">Arrival</th>
                    <th scope="col" className="py-2 font-semibold">Bus type</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((t) => (
                    <tr key={t.departure} className="border-b border-slate-50 last:border-0">
                      <td className="py-2.5 pr-4 font-semibold tabular-nums text-slate-800">{t.departure}</td>
                      <td className="py-2.5 pr-4 tabular-nums text-slate-600">{t.arrival}</td>
                      <td className="py-2.5 text-slate-600">{t.busType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* Alerts */}
          <ChartCard title="Active alerts on this route">
            {routeAlerts.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No active alerts for this route.</p>
            ) : (
              <ul className="space-y-3">
                {routeAlerts.map((a) => (
                  <li key={a.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={a.severity} />
                      <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                      <span className="ml-auto text-xs text-slate-400">{a.time}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{a.reason}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                      <span className="font-semibold text-slate-700">Recommended:</span> {a.recommendedAction}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </ChartCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-bold text-slate-900">Route overview</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Daily passengers", route.dailyPassengers.toLocaleString("en-IN")],
                ["Buses assigned", `${route.busesAssigned}`],
                ["Capacity per bus", `${route.capacityPerBus} seats`],
                ["Peak window", route.peakWindow],
                ["Distance", `${route.distanceKm} km`],
                ["Travel time", `${route.travelTimeMin} min`],
                ["Fare", formatINR(route.fare)],
                ["Status", route.status.charAt(0).toUpperCase() + route.status.slice(1)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-right font-semibold tabular-nums text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] leading-relaxed text-slate-400">
              Route overview for the current service day.
            </p>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-bold text-slate-900">Weather impact</h2>
            {weatherImpact ? (
              <>
                <p className={`mt-3 text-3xl font-bold tabular-nums ${weatherImpact.demandChangePct >= 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {weatherImpact.demandChangePct >= 0 ? "+" : ""}
                  {weatherImpact.demandChangePct}%
                </p>
                <p className="text-xs text-slate-500">predicted demand change during rain</p>
                <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-500">
                  {weatherImpact.note}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No weather sensitivity learned for this route yet.</p>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-bold text-slate-900">Event impact</h2>
            {routeEvents.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No upcoming events affect this route.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {routeEvents.map((ev) => (
                  <li key={ev.id} className="rounded-xl border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-800">{ev.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {ev.location} · {ev.date}
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-red-600">
                      +{ev.predictedDemandIncreasePct}% predicted demand
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
