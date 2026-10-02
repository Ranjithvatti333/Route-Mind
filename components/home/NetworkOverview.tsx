"use client";

import { KpiCard } from "@/components/ui/KpiCard";
import { DataBoundary } from "@/components/ui/States";
import { useApiData } from "@/hooks/useApiData";
import { routesService, alertsService } from "@/services";
import { formatCompact } from "@/lib/format";

/** Network KPI strip on the home page. */
export function NetworkOverview() {
  const routesState = useApiData(() => routesService.list());
  const alertsState = useApiData(() => alertsService.list());

  const routes = routesState.data;
  const totalPassengers = routes?.reduce((s, r) => s + r.dailyPassengers, 0) ?? 0;
  const totalBuses = routes?.reduce((s, r) => s + r.busesAssigned, 0) ?? 0;
  const activeAlerts = alertsState.data?.length ?? 0;

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="network-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Network overview</p>
            <h2 id="network-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              The network at a glance
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DataBoundary state={routesState} isEmpty={(r) => r.length === 0} emptyTitle="No routes in the network">
            {() => (
              <>
                <KpiCard
                  label="Routes monitored"
                  value={`${routes?.length}`}
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                      <path d="M6 19 9 5m6 14 3-14M4.5 12h15" />
                    </svg>
                  }
                />
                <KpiCard
                  label="Buses in service"
                  value={formatCompact(totalBuses)}
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                      <rect x="4" y="4" width="16" height="13" rx="2" />
                      <path d="M4 11h16M8 21h.01M16 21h.01" />
                    </svg>
                  }
                />
                <KpiCard
                  label="Daily passengers"
                  value={formatCompact(totalPassengers)}
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                      <circle cx="9" cy="8" r="3.2" />
                      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.6a3.2 3.2 0 0 1 0 5.8m1 7.6a5.5 5.5 0 0 0-2.5-4.6" />
                    </svg>
                  }
                />
              </>
            )}
          </DataBoundary>

          <DataBoundary state={alertsState} isEmpty={(a) => a.length === 0} emptyTitle="No alerts">
            {() => (
              <KpiCard
                label="Active alerts"
                value={`${activeAlerts}`}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                    <path d="M12 4 3 19h18L12 4Zm0 6v4m0 2.5h.01" />
                  </svg>
                }
              />
            )}
          </DataBoundary>
        </div>
      </div>
    </section>
  );
}
