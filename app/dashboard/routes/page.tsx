"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { CrowdBadge } from "@/components/ui/Badges";
import { DataBoundary } from "@/components/ui/States";
import { UtilBar } from "@/components/charts";
import { useApiData } from "@/hooks/useApiData";
import { routesService } from "@/services";
import { formatCompact, formatINR, routeUtilization } from "@/lib/format";
import type { TransitRoute } from "@/lib/types";

export default function DashboardRoutesPage() {
  const state = useApiData(() => routesService.list());

  const columns: Column<TransitRoute>[] = [
    {
      key: "route",
      header: "Route",
      render: (r) => (
        <Link href={`/routes/${r.id}`} className="font-semibold text-brand-600 hover:text-brand-700">
          {r.id}
        </Link>
      ),
    },
    { key: "pax", header: "Passengers", render: (r) => <span className="tabular-nums">{formatCompact(r.dailyPassengers)}</span> },
    { key: "cap", header: "Capacity", render: (r) => <span className="tabular-nums text-slate-500">{formatCompact(r.busesAssigned * r.capacityPerBus)}</span> },
    {
      key: "util",
      header: "Utilization",
      render: (r) => <UtilBar value={routeUtilization(r)} />,
    },
    { key: "rev", header: "Revenue", render: (r) => <span className="tabular-nums">{formatINR(r.dailyPassengers * r.fare)}</span> },
    { key: "peak", header: "Peak hour", render: (r) => <span className="text-slate-600">{r.peakWindow}</span> },
    { key: "crowd", header: "Crowd", render: (r) => <CrowdBadge level={r.crowd} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Route Analytics</h2>
          <p className="text-sm text-slate-500">Demand, utilization and status per route</p>
        </div>
      </div>

      <Card>
        <DataBoundary state={state} isEmpty={(r) => r.length === 0} emptyTitle="No routes loaded">
          {(rows) => <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} caption="Route analytics" />}
        </DataBoundary>
      </Card>
      <p className="text-xs text-slate-400">
        Utilization = daily passengers ÷ total daily seat-trips (buses × seats × ~8 trips).
      </p>
    </div>
  );
}
