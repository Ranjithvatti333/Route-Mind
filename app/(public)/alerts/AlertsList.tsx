"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SeverityBadge } from "@/components/ui/Badges";
import { DataBoundary } from "@/components/ui/States";
import { FilterBar, FilterSelect } from "@/components/ui/Filters";
import { useApiData } from "@/hooks/useApiData";
import { alertsService } from "@/services";
import type { ServiceAlert } from "@/lib/types";

const GROUPS: { key: string; label: string; blurb: string }[] = [
  { key: "critical", label: "Critical", blurb: "Act now — capacity or safety risk predicted" },
  { key: "warning", label: "Warnings", blurb: "Elevated risk — monitor closely and prepare" },
  { key: "info", label: "Information", blurb: "Operational notices with low passenger impact" },
];

function AlertCard({ alert }: { alert: ServiceAlert }) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-card-hover">
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
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reason</dt>
          <dd className="mt-0.5 leading-relaxed text-slate-600">{alert.reason}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recommended action</dt>
          <dd className="mt-0.5 leading-relaxed text-slate-600">{alert.recommendedAction}</dd>
        </div>
      </dl>
    </Card>
  );
}

export function AlertsList() {
  const state = useApiData(() => alertsService.list());
  const [severity, setSeverity] = useState("all");

  const filtered = useMemo(
    () => (state.data ?? []).filter((a) => severity === "all" || a.severity === severity),
    [state.data, severity],
  );

  return (
    <div>
      <FilterBar className="mb-6">
        <FilterSelect
          label="Severity"
          value={severity}
          onChange={setSeverity}
          options={[
            { value: "all", label: "All severities" },
            { value: "critical", label: "Critical" },
            { value: "warning", label: "Warnings" },
            { value: "info", label: "Information" },
          ]}
        />
      </FilterBar>

      <DataBoundary
        state={{ ...state, data: filtered }}
        isEmpty={(a) => a.length === 0}
        emptyTitle="No alerts at this severity"
      >
        {(alerts) => (
          <div className="space-y-10">
            {GROUPS.map((group) => {
              const groupAlerts = alerts.filter((a) => a.severity === group.key);
              if (groupAlerts.length === 0) return null;
              return (
                <section key={group.key} aria-labelledby={`alerts-${group.key}`}>
                  <div className="mb-4 flex items-baseline gap-3">
                    <h2 id={`alerts-${group.key}`} className="text-lg font-bold text-slate-900">
                      {group.label}
                    </h2>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {groupAlerts.length}
                    </span>
                    <p className="hidden text-sm text-slate-500 sm:block">{group.blurb}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {groupAlerts.map((a) => (
                      <AlertCard key={a.id} alert={a} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </DataBoundary>
    </div>
  );
}
