"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatCompact, formatINR } from "@/lib/format";
import { DEMO_SIMULATION_BASE } from "@/data/intelligence";

/** Interactive-feeling What-If teaser — local approximation only, no backend. */
export function WhatIfPreview() {
  const [rain, setRain] = useState(20);

  const result = useMemo(() => {
    // Approximation for illustration only.
    const factor = 1 + rain * 0.006;
    return {
      demand: Math.round(DEMO_SIMULATION_BASE.demand * factor),
      crowding: Math.min(140, Math.round(DEMO_SIMULATION_BASE.avgUtilizationPct * factor * 10) / 10),
      waiting: Math.max(2, Math.round(DEMO_SIMULATION_BASE.avgWaitingTimeMin * factor * 10) / 10),
      buses: Math.round(DEMO_SIMULATION_BASE.busesRequired * factor),
    };
  }, [rain]);

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          What happens if heavy rain occurs tomorrow?
        </h3>
      </div>

      <label htmlFor="rain-slider" className="text-xs font-medium text-slate-500">
        Forecast rainfall — <span className="font-bold text-slate-800">{rain} mm</span>
      </label>
      <input
        id="rain-slider"
        type="range"
        min={0}
        max={60}
        value={rain}
        onChange={(e) => setRain(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>No rain</span>
        <span>Heavy rain</span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Demand", formatCompact(result.demand)],
          ["Crowding", `${result.crowding}%`],
          ["Waiting time", `${result.waiting} min`],
          ["Required buses", `${result.buses}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 px-3 py-3">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="mt-1 text-lg font-bold tabular-nums text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
        Approximate revenue impact at this level: {formatINR(Math.round(result.demand * 26))}.
      </p>
    </Card>
  );
}
