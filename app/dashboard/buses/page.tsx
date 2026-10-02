"use client";

import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DataBoundary } from "@/components/ui/States";
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

export default function DashboardBusesPage() {
  const state = useApiData(() => busesService.list());

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
    { key: "route", header: "Route", render: (b) => <span className="font-semibold text-slate-700">{b.routeId}</span> },
    { key: "pax", header: "Passengers", render: (b) => <span className="tabular-nums">{b.passengersToday.toLocaleString("en-IN")}</span> },
    { key: "trips", header: "Trips", render: (b) => <span className="tabular-nums">{b.tripsToday}</span> },
    { key: "rev", header: "Revenue", render: (b) => <span className="tabular-nums">{formatINR(b.revenueToday)}</span> },
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Bus Analytics</h2>
          <p className="text-sm text-slate-500">Fleet performance and status</p>
        </div>
      </div>

      <Card>
        <DataBoundary state={state} isEmpty={(b) => b.length === 0} emptyTitle="No buses loaded">
          {(rows) => <DataTable columns={columns} rows={rows} rowKey={(b) => b.id} caption="Bus analytics" />}
        </DataBoundary>
      </Card>
    </div>
  );
}
