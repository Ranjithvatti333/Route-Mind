"use client";

import { useState } from "react";
import { Card, ChartCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Section";
import { FilterSelect } from "@/components/ui/Filters";
import { Modal } from "@/components/ui/Modal";
import { useFleet } from "@/hooks/useFleet";
import { fleetStore } from "@/lib/fleetStore";
import { formatINR } from "@/lib/format";

function ChangeRow({ label, value, positiveIsGood }: { label: string; value: string; positiveIsGood: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${positiveIsGood ? "text-emerald-600" : "text-red-600"}`}>
        {value}
      </span>
    </div>
  );
}

type Banner = { tone: "success" | "error"; text: string };

const BANNER_STYLES: Record<Banner["tone"], string> = {
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  error: "bg-red-50 text-red-800 ring-red-200",
};

export default function BusAllocationPage() {
  const { routes, buses } = useFleet();
  const [selected, setSelected] = useState("R101");
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dialog, setDialog] = useState<"add" | "remove" | null>(null);
  const [addRouteId, setAddRouteId] = useState("R101");
  const [removeBusId, setRemoveBusId] = useState("");

  // Comparison rows from the fleet store: currentBuses is the fixed session
  // baseline, recommendedBuses is the proposed allocation that Add/Remove
  // accumulates against. Apply Plan materializes the fleet without moving
  // the baseline, so the left column never changes.
  const recs = fleetStore.getRecommendations();

  const totals = recs.reduce(
    (acc, r) => ({
      added: acc.added + Math.max(0, r.recommendedBuses - r.currentBuses),
      removed: acc.removed + Math.max(0, r.currentBuses - r.recommendedBuses),
      wait: acc.wait + r.waitingTimeChangeMin,
      crowd: acc.crowd + r.crowdingChangePct,
      cost: acc.cost + r.operatingCostChangeInr,
    }),
    { added: 0, removed: 0, wait: 0, crowd: 0, cost: 0 },
  );

  const detail = recs.find((r) => r.routeId === selected);

  const activeBuses = buses.filter((b) => b.status === "active").length;
  const idleBuses = buses.filter((b) => b.status === "idle").length;
  const maintenanceBuses = buses.length - activeBuses - idleBuses;

  const applyPlan = () => {
    // Apply exactly the recommendation currently on screen — never a stale one.
    const result = fleetStore.applyPlan(recs);
    if (!result.ok) {
      setBanner({ tone: "error", text: result.errors.join(" · ") });
      return;
    }
    if (result.routesChanged === 0) {
      setBanner({ tone: "success", text: "No allocation changes were required." });
      return;
    }
    // Describe only what actually happened, with correct singular/plural.
    const parts = [
      result.added > 0 && `${result.added} ${result.added === 1 ? "bus" : "buses"} added`,
      result.removed > 0 && `${result.removed} ${result.removed === 1 ? "bus" : "buses"} removed`,
    ].filter(Boolean);
    setBanner({
      tone: "success",
      text: `Plan applied — ${parts.join(" and ")} across ${result.routesChanged} ${
        result.routesChanged === 1 ? "route" : "routes"
      }. Fleet now at ${fleetStore.getBuses().length} buses.`,
    });
  };

  const confirmAdd = () => {
    const bus = fleetStore.addBus(addRouteId);
    setDialog(null);
    if (bus) {
      setBanner({
        tone: "success",
        text: `Bus ${bus.id} (${bus.registration}) added and assigned to ${bus.routeId}. Fleet now at ${fleetStore.getBuses().length} buses.`,
      });
    }
  };

  const confirmRemove = () => {
    const bus = fleetStore.removeBus(removeBusId);
    setDialog(null);
    if (bus) {
      const remaining = fleetStore.getRoute(bus.routeId)?.busesAssigned ?? 0;
      setBanner({
        tone: "success",
        text: `Bus ${bus.id} removed — ${bus.routeId} now assigns ${remaining} buses. Fleet now at ${fleetStore.getBuses().length} buses.`,
      });
    }
  };

  const openRemove = () => {
    setRemoveBusId(buses[0]?.id ?? "");
    setDialog("remove");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Bus Allocation</h2>
          <p className="text-sm text-slate-500">Baseline allocation vs proposed plan</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setDialog("add")}>
            Add bus
          </Button>
          <Button variant="secondary" onClick={openRemove} disabled={buses.length === 0}>
            Remove bus
          </Button>
          <Button onClick={applyPlan} title="Apply the recommendation currently displayed">
            Apply plan
          </Button>
        </div>
      </div>

      {banner && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium ring-1 ring-inset ${BANNER_STYLES[banner.tone]}`}
        >
          <span className="flex items-center gap-2">
            {banner.tone === "success" ? (
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-current" aria-hidden>
                <path d="M10 1.7a8.3 8.3 0 1 0 0 16.6A8.3 8.3 0 0 0 10 1.7Zm4.1 6.1-4.9 5a.9.9 0 0 1-1.3 0L5.9 10.9l1.2-1.2 1.4 1.4 4.3-4.5 1.3 1.2Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-current" aria-hidden>
                <path d="M10 1.7a8.3 8.3 0 1 0 0 16.6A8.3 8.3 0 0 0 10 1.7Zm-.9 4.1h1.8v6h-1.8v-6Zm.9 8.6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
              </svg>
            )}
            {banner.text}
          </span>
          <button
            type="button"
            onClick={() => setBanner(null)}
            aria-label="Dismiss"
            className="rounded-lg p-1 opacity-60 transition-opacity hover:opacity-100"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
              <path d="m10 8.6 3.3-3.3 1.4 1.4L11.4 10l3.3 3.3-1.4 1.4L10 11.4l-3.3 3.3-1.4-1.4L8.6 10 5.3 6.7l1.4-1.4L10 8.6Z" />
            </svg>
          </button>
        </div>
      )}

      {/* Live fleet state */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total fleet", `${buses.length}`],
          ["On service (active)", `${activeBuses}`],
          ["Available (idle)", `${idleBuses}`],
          ["In maintenance", `${maintenanceBuses}`],
        ].map(([label, value]) => (
          <Card key={label} className="flex items-center justify-between px-5 py-3.5">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-lg font-bold tabular-nums text-slate-900">{value}</p>
          </Card>
        ))}
      </div>

      {/* Plan impact summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Buses added</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-brand-600">+{totals.added}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Buses removed</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-accent-600">-{totals.removed}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Est. waiting time change</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-600">{totals.wait.toFixed(1)} min</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Est. crowding change</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-600">{totals.crowd}%</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Est. operating cost change</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
            {totals.cost >= 0 ? "+" : ""}
            {formatINR(Math.abs(totals.cost))}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Current vs recommended */}
        <div className="lg:col-span-3">
          <ChartCard title="Baseline vs proposed allocation" subtitle="Click a route for rationale">
            <ul className="divide-y divide-slate-100">
              {recs.map((rec) => {
                const up = rec.recommendedBuses > rec.currentBuses;
                const activeRow = selected === rec.routeId;
                return (
                  <li key={rec.routeId}>
                    <button
                      type="button"
                      onClick={() => setSelected(rec.routeId)}
                      aria-pressed={activeRow}
                      className={`flex w-full flex-wrap items-center gap-4 px-1 py-4 text-left transition-colors ${
                        activeRow ? "rounded-xl bg-brand-50/70 sm:px-3" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-900">{rec.routeId}</span>
                      <span className="flex items-center gap-2">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold tabular-nums text-slate-500">
                          {rec.currentBuses}
                        </span>
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-slate-300" aria-hidden>
                          <path d="M9.3 2.3 15 8l-5.7 5.7-1.4-1.4 3.3-3.3H1v-2h10.2L7.9 3.7l1.4-1.4Z" />
                        </svg>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white ${
                            up ? "bg-brand-600" : "bg-accent-600"
                          }`}
                        >
                          {rec.recommendedBuses}
                        </span>
                      </span>
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${up ? "bg-brand-50 text-brand-700" : "bg-accent-50 text-accent-700"}`}>
                        {up ? "+" : ""}
                        {rec.recommendedBuses - rec.currentBuses}
                      </span>
                      <span className="hidden w-28 text-right text-xs tabular-nums text-slate-500 sm:block">
                        {rec.waitingTimeChangeMin < 0 ? `${rec.waitingTimeChangeMin} min` : `+${rec.waitingTimeChangeMin} min`} wait
                      </span>
                      <span className="hidden w-24 text-right text-xs tabular-nums text-slate-500 sm:block">
                        {rec.crowdingChangePct}% crowd
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ChartCard>
        </div>

        {/* Why panel */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.8.3-1.4 1-1.4 1.9v.3m0 3h.01" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
              Why this recommendation?
            </h3>
            {detail ? (
              <>
                <p className="mt-4 text-sm font-bold text-brand-700">{detail.routeId}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{detail.reason}</p>
                <div className="mt-5">
                  <ChangeRow label="Waiting time" value={`${detail.waitingTimeChangeMin > 0 ? "+" : ""}${detail.waitingTimeChangeMin} min`} positiveIsGood={detail.waitingTimeChangeMin <= 0} />
                  <ChangeRow label="Crowding" value={`${detail.crowdingChangePct}%`} positiveIsGood={detail.crowdingChangePct <= 0} />
                  <ChangeRow
                    label="Operating cost / day"
                    value={`${detail.operatingCostChangeInr >= 0 ? "+" : "−"}${formatINR(Math.abs(detail.operatingCostChangeInr))}`}
                    positiveIsGood={detail.operatingCostChangeInr <= 0}
                  />
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Select a route to see the rationale.</p>
            )}
            <p className="mt-5 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500">
              Apply Plan brings the live fleet to the proposed allocation. The baseline column
              stays fixed for comparison, and manual Add/Remove changes only the proposed side.
              Changes are reflected across buses, routes, dashboard, analytics and the network map.
            </p>
          </Card>
        </div>
      </div>

      {/* Add bus */}
      <Modal open={dialog === "add"} onClose={() => setDialog(null)} title="Add bus to fleet">
        <p className="text-sm leading-relaxed text-slate-500">
          The new bus gets the next unique ID and registration, and starts as available (idle).
        </p>
        <div className="mt-4">
          <FilterSelect
            label="Assign to route"
            value={addRouteId}
            onChange={setAddRouteId}
            options={routes.map((r) => ({ value: r.id, label: `${r.id} — ${r.source} → ${r.destination}` }))}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDialog(null)}>
            Cancel
          </Button>
          <Button onClick={confirmAdd}>Add bus</Button>
        </div>
      </Modal>

      {/* Remove bus */}
      <Modal open={dialog === "remove"} onClose={() => setDialog(null)} title="Remove bus from fleet">
        <FilterSelect
          label="Bus"
          value={removeBusId}
          onChange={setRemoveBusId}
          options={buses.map((b) => ({
            value: b.id,
            label: `${b.id} · ${b.registration} — ${b.routeId}${b.status === "active" ? " (on service)" : ""}`,
          }))}
        />
        <p className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500">
          Removing an assigned bus clears its route assignment and updates that route&apos;s bus
          count, so no broken assignment is left behind.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDialog(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove} disabled={!removeBusId}>
            Remove bus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
