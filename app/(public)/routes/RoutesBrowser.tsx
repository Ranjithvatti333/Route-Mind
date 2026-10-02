"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { CrowdBadge } from "@/components/ui/Badges";
import { DataBoundary } from "@/components/ui/States";
import { FilterBar, FilterSelect, SearchInput } from "@/components/ui/Filters";
import { useApiData } from "@/hooks/useApiData";
import { routesService } from "@/services";
import { formatCompact } from "@/lib/format";
import type { TransitRoute } from "@/lib/types";

function RouteCard({ route }: { route: TransitRoute }) {
  return (
    <Link href={`/routes/${route.id}`} className="block" aria-label={`Route ${route.id}: ${route.source} to ${route.destination}`}>
      <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center rounded-lg bg-brand-600 px-2.5 py-1 text-sm font-bold text-white">
              {route.id}
            </span>
            <h2 className="mt-3 text-sm font-semibold text-slate-900">
              {route.source}
              <span className="mx-1.5 text-slate-300">&rarr;</span>
              {route.destination}
            </h2>
          </div>
          <CrowdBadge level={route.crowd} />
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-400">Stops</dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-slate-800">{route.stops.length}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-400">Daily pax</dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-slate-800">{formatCompact(route.dailyPassengers)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-400">Buses</dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-slate-800">{route.busesAssigned}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Peak: <span className="font-semibold text-slate-700">{route.peakWindow}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1.5 font-semibold ${
              route.status === "operational"
                ? "text-emerald-600"
                : route.status === "delayed"
                  ? "text-amber-600"
                  : "text-red-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                route.status === "operational"
                  ? "bg-emerald-500"
                  : route.status === "delayed"
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
            />
            <span className="capitalize">{route.status}</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function RoutesBrowser() {
  const state = useApiData(() => routesService.list());
  const [query, setQuery] = useState("");
  const [crowd, setCrowd] = useState("all");
  const [status, setStatus] = useState("all");

  const routes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (state.data ?? []).filter((r) => {
      const matchesQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q);
      const matchesCrowd = crowd === "all" || r.crowd === crowd;
      const matchesStatus = status === "all" || r.status === status;
      return matchesQuery && matchesCrowd && matchesStatus;
    });
  }, [state.data, query, crowd, status]);

  return (
    <div>
      <FilterBar className="mb-6">
        <SearchInput value={query} onChange={setQuery} placeholder="Search route number, source or destination…" />
        <FilterSelect
          label="Crowd"
          value={crowd}
          onChange={setCrowd}
          options={[
            { value: "all", label: "All levels" },
            { value: "low", label: "Low" },
            { value: "moderate", label: "Moderate" },
            { value: "high", label: "High" },
            { value: "critical", label: "Critical" },
          ]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All statuses" },
            { value: "operational", label: "Operational" },
            { value: "delayed", label: "Delayed" },
            { value: "suspended", label: "Suspended" },
          ]}
        />
        <div className="ml-auto flex items-center gap-2 pb-0.5">
          <span className="text-xs text-slate-400">{routes.length} routes</span>
        </div>
      </FilterBar>

      <DataBoundary
        state={{ ...state, data: routes }}
        isEmpty={(r) => r.length === 0}
        emptyTitle="No routes match your filters"
        emptyDescription="Try clearing the search or choosing a different crowd level."
      >
        {(list) => (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </DataBoundary>
    </div>
  );
}
