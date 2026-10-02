"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SeverityBadge } from "@/components/ui/Badges";
import { DataBoundary } from "@/components/ui/States";
import { FilterBar, FilterSelect, SearchInput } from "@/components/ui/Filters";
import { Button } from "@/components/ui/Section";
import { useApiData } from "@/hooks/useApiData";
import { alertsService } from "@/services";
import type { ServiceAlert } from "@/lib/types";

/** Operator alert console — acknowledged state is UI-only until the backend persists it. */
export default function DashboardAlertsPage() {
  const state = useApiData(() => alertsService.list());
  const [severity, setSeverity] = useState("all");
  const [query, setQuery] = useState("");
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (state.data ?? [])
      .filter((a) => severity === "all" || a.severity === severity)
      .filter((a) => !q || a.title.toLowerCase().includes(q) || a.routeIds.some((r) => r.toLowerCase().includes(q)));
  }, [state.data, severity, query]);

  const ack = (id: string) =>
    setAcknowledged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const columns = (alert: ServiceAlert) => (
    <Card className={`p-5 transition-shadow hover:shadow-card-hover ${acknowledged.has(alert.id) ? "opacity-55" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={alert.severity} />
        <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
        <span className="ml-auto text-xs text-slate-400">{alert.time}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {alert.routeIds.map((r) => (
          <Link
            key={r}
            href={`/routes/${r}`}
            className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
          >
            {r}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{alert.reason}</p>
      <p className="mt-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600">
        <span className="font-semibold text-slate-700">Recommended:</span> {alert.recommendedAction}
      </p>
      <div className="mt-4 flex gap-2">
        <Button variant={acknowledged.has(alert.id) ? "secondary" : "primary"} className="!px-4 !py-1.5 text-xs" onClick={() => ack(alert.id)}>
          {acknowledged.has(alert.id) ? "Acknowledged ✓" : "Acknowledge"}
        </Button>
        <Link
          href="/dashboard/bus-allocation"
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Act on allocation
        </Link>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Alerts</h2>
          <p className="text-sm text-slate-500">Predicted issues with recommended actions</p>
        </div>
      </div>

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search alerts or route…" label="Search alerts" />
        <FilterSelect
          label="Severity"
          value={severity}
          onChange={setSeverity}
          options={[
            { value: "all", label: "All" },
            { value: "critical", label: "Critical" },
            { value: "warning", label: "Warning" },
            { value: "info", label: "Info" },
          ]}
        />
      </FilterBar>

      <DataBoundary
        state={{ ...state, data: filtered }}
        isEmpty={(a) => a.length === 0}
        emptyTitle="No alerts match"
      >
        {(alerts) => <div className="grid gap-4 xl:grid-cols-2">{alerts.map((a) => <div key={a.id}>{columns(a)}</div>)}</div>}
      </DataBoundary>

      <p className="text-xs text-slate-400">
        Acknowledge state is local — persistence requires the backend.
      </p>
    </div>
  );
}
