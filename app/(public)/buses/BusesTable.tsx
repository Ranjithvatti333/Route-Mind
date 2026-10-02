"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DataBoundary } from "@/components/ui/States";
import { FilterBar, FilterSelect, SearchInput } from "@/components/ui/Filters";
import { UtilBar } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { busesService } from "@/services";
import { formatINR } from "@/lib/format";
import type { TransitBus } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  idle: "bg-slate-100 text-slate-600 ring-slate-200",
  maintenance: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function BusesTable() {
  const state = useApiData(() => busesService.list());
  const [query, setQuery] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const routeOptions = useMemo(() => {
    const ids = Array.from(new Set((state.data ?? []).map((b) => b.routeId))).sort();
    return [{ value: "all", label: "All routes" }, ...ids.map((id) => ({ value: id, label: id }))];
  }, [state.data]);

  const buses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (state.data ?? []).filter((b) => {
      const matchesQuery =
        !q || b.id.toLowerCase().includes(q) || b.registration.toLowerCase().includes(q);
      const matchesRoute = routeFilter === "all" || b.routeId === routeFilter;
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      return matchesQuery && matchesRoute && matchesStatus;
    });
  }, [state.data, query, routeFilter, statusFilter]);

  const columns: Column<TransitBus>[] = [
    {
      key: "bus",
      header: "Bus",
      render: (b) => (
        <div>
          <p className="font-semibold text-slate-800">{b.registration}</p>
          <p className="text-xs text-slate-400">{b.id}</p>
        </div>
      ),
    },
    {
      key: "route",
      header: "Route",
      render: (b) => (
        <Link href={`/routes/${b.routeId}`} className="font-semibold text-brand-600 hover:text-brand-700">
          {b.routeId}
        </Link>
      ),
    },
    { key: "trips", header: "Trips", render: (b) => <span className="tabular-nums">{b.tripsToday}</span> },
    { key: "pax", header: "Passengers", render: (b) => <span className="tabular-nums">{b.passengersToday.toLocaleString("en-IN")}</span> },
    { key: "revenue", header: "Revenue", render: (b) => <span className="tabular-nums">{formatINR(b.revenueToday)}</span> },
    { key: "util", header: "Utilization", render: (b) => <UtilBar value={b.utilization} /> },
    {
      key: "status",
      header: "Status",
      render: (b) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STATUS_STYLES[b.status]}`}>
          {b.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <FilterBar className="mb-6">
        <SearchInput value={query} onChange={setQuery} placeholder="Search bus number or ID…" />
        <FilterSelect label="Route" value={routeFilter} onChange={setRouteFilter} options={routeOptions} />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "idle", label: "Idle" },
            { value: "maintenance", label: "Maintenance" },
          ]}
        />
      </FilterBar>

      <Card>
        <DataBoundary
          state={{ ...state, data: buses }}
          isEmpty={(b) => b.length === 0}
          emptyTitle="No buses match your filters"
        >
          {(rows) => <DataTable columns={columns} rows={rows} rowKey={(b) => b.id} caption="Fleet list" />}
        </DataBoundary>
      </Card>
    </div>
  );
}
