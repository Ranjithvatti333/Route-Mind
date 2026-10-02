"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Section";
import { simulationService } from "@/services";
import { DEMO_SIMULATION_BASE } from "@/data/intelligence";
import { formatCompact, formatINR } from "@/lib/format";
import type { SimulationInput, SimulationResult } from "@/lib/types";

export default function SimulationPage() {
  const [input, setInput] = useState<SimulationInput>({
    rainfallMm: 0,
    eventAttendance: 0,
    festival: false,
    availableBuses: 212,
    busAdditions: 0,
    busRemovals: 0,
    disruptedRouteId: null,
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const { data } = await simulationService.run(input);
      setResult(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setRunning(false);
    }
  };

  const set = <K extends keyof SimulationInput>(key: K, value: SimulationInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const comparisons: { label: string; current: string; simulated: (r: SimulationResult) => string; betterWhenLower?: boolean }[] = [
    { label: "Passenger demand", current: formatCompact(DEMO_SIMULATION_BASE.demand), simulated: (r) => formatCompact(r.demand) },
    { label: "Avg crowding", current: `${DEMO_SIMULATION_BASE.avgUtilizationPct}%`, simulated: (r) => `${r.avgUtilizationPct}%`, betterWhenLower: true },
    { label: "Avg waiting time", current: `${DEMO_SIMULATION_BASE.avgWaitingTimeMin} min`, simulated: (r) => `${r.avgWaitingTimeMin} min`, betterWhenLower: true },
    { label: "Revenue", current: formatINR(DEMO_SIMULATION_BASE.revenueInr), simulated: (r) => formatINR(r.revenueInr) },
    { label: "Operating cost", current: formatINR(DEMO_SIMULATION_BASE.operatingCostInr), simulated: (r) => formatINR(r.operatingCostInr), betterWhenLower: true },
    { label: "Buses required", current: `${DEMO_SIMULATION_BASE.busesRequired}`, simulated: (r) => `${r.busesRequired}` },
    { label: "Overcrowded routes", current: `${DEMO_SIMULATION_BASE.overcrowdedRoutes}`, simulated: (r) => `${r.overcrowdedRoutes}`, betterWhenLower: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">What-If Simulation</h2>
          <p className="text-sm text-slate-500">Test scenarios before committing the operations plan</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900">Scenario controls</h3>

          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="sim-rain" className="flex justify-between text-sm font-medium text-slate-700">
                Rainfall <span className="font-bold text-slate-900">{input.rainfallMm} mm</span>
              </label>
              <input
                id="sim-rain"
                type="range"
                min={0}
                max={60}
                value={input.rainfallMm}
                onChange={(e) => set("rainfallMm", Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>

            <div>
              <label htmlFor="sim-event" className="flex justify-between text-sm font-medium text-slate-700">
                Event attendance <span className="font-bold text-slate-900">{formatCompact(input.eventAttendance)}</span>
              </label>
              <input
                id="sim-event"
                type="range"
                min={0}
                max={60000}
                step={2000}
                value={input.eventAttendance}
                onChange={(e) => set("eventAttendance", Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>

            <label className="flex items-center justify-between text-sm font-medium text-slate-700">
              Festival day
              <input
                type="checkbox"
                checked={input.festival}
                onChange={(e) => set("festival", e.target.checked)}
                className="h-4 w-4 accent-brand-600"
              />
            </label>

            <div>
              <label htmlFor="sim-buses" className="flex justify-between text-sm font-medium text-slate-700">
                Available buses <span className="font-bold text-slate-900">{input.availableBuses}</span>
              </label>
              <input
                id="sim-buses"
                type="range"
                min={120}
                max={260}
                value={input.availableBuses}
                onChange={(e) => set("availableBuses", Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sim-add" className="mb-1 block text-xs font-medium text-slate-500">Bus additions</label>
                <input
                  id="sim-add"
                  type="number"
                  min={0}
                  max={30}
                  value={input.busAdditions}
                  onChange={(e) => set("busAdditions", Math.max(0, Number(e.target.value)))}
                  className="h-9 w-full rounded-lg border border-slate-300 px-3 text-sm tabular-nums focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="sim-rem" className="mb-1 block text-xs font-medium text-slate-500">Bus removals</label>
                <input
                  id="sim-rem"
                  type="number"
                  min={0}
                  max={30}
                  value={input.busRemovals}
                  onChange={(e) => set("busRemovals", Math.max(0, Number(e.target.value)))}
                  className="h-9 w-full rounded-lg border border-slate-300 px-3 text-sm tabular-nums focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sim-disrupt" className="mb-1 block text-xs font-medium text-slate-500">Route disruption</label>
              <select
                id="sim-disrupt"
                value={input.disruptedRouteId ?? ""}
                onChange={(e) => set("disruptedRouteId", e.target.value || null)}
                className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm focus:border-brand-500 focus:outline-none"
              >
                <option value="">None</option>
                {Array.from({ length: 18 }, (_, i) => `R${101 + i}`).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <Button onClick={run} disabled={running} className="w-full">
              {running ? "Running simulation…" : "Run Simulation"}
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2">
          {running && <Card><LoadingState label="Simulating scenario across the network…" /></Card>}
          {error && <Card><ErrorState message={error.message} onRetry={run} /></Card>}
          {!running && !error && !result && (
            <Card>
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                    <path d="M15.5 3.5 20.5 8.5M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" />
                  </svg>
                </span>
                <p className="text-sm font-semibold text-slate-700">No simulation run yet</p>
                <p className="max-w-sm text-sm text-slate-500">
                  Adjust the scenario controls and run the simulation to compare the current plan
                  against your what-if conditions.
                </p>
              </div>
            </Card>
          )}
          {!running && !error && result && (
            <Card>
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-semibold text-slate-900">Results — current vs simulated</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {input.rainfallMm > 0 && `${input.rainfallMm}mm rain · `}
                  {input.eventAttendance > 0 && `${formatCompact(input.eventAttendance)} event · `}
                  {input.festival && "festival day · "}
                  {input.disruptedRouteId && `disruption on ${input.disruptedRouteId} · `}
                  fleet {input.availableBuses}
                </p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th scope="col" className="px-5 py-2.5 font-semibold">Metric</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-semibold">Current</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-semibold">Simulated</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((c) => {
                    const simVal = c.simulated(result);
                    const changed = simVal !== c.current;
                    const worse =
                      c.betterWhenLower !== undefined && changed
                        ? c.betterWhenLower
                          ? parseFloat(simVal.replace(/[^0-9.]/g, "")) > parseFloat(c.current.replace(/[^0-9.]/g, ""))
                          : parseFloat(simVal.replace(/[^0-9.]/g, "")) < parseFloat(c.current.replace(/[^0-9.]/g, ""))
                        : null;
                    return (
                      <tr key={c.label} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3 font-medium text-slate-700">{c.label}</td>
                        <td className="px-5 py-3 text-right tabular-nums text-slate-500">{c.current}</td>
                        <td className="px-5 py-3 text-right font-bold tabular-nums text-slate-900">{simVal}</td>
                        <td className={`px-5 py-3 text-right text-xs font-bold tabular-nums ${!changed ? "text-slate-300" : worse ? "text-red-600" : "text-emerald-600"}`}>
                          {changed ? (worse ? "worse" : "better") : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="border-t border-slate-100 px-5 py-3">
                <p className="text-xs text-slate-400">
                  Deterministic approximation in the browser. The real engine
                  (demand models + fleet constraints) runs server-side.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
