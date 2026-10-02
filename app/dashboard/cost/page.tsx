"use client";

import { Card, ChartCard } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DemandBarChart } from "@/components/charts";
import { formatINR } from "@/lib/format";

const CURRENT = {
  operating: 5080000,
  fuel: 1940000,
  driver: 2360000,
  maintenance: 780000,
};

const RECOMMENDED = {
  operating: 5004000,
  fuel: 1887000,
  driver: 2332000,
  maintenance: 785000,
};

const ROWS = [
  ["Total operating cost", CURRENT.operating, RECOMMENDED.operating],
  ["Fuel / energy", CURRENT.fuel, RECOMMENDED.fuel],
  ["Driver cost", CURRENT.driver, RECOMMENDED.driver],
  ["Maintenance", CURRENT.maintenance, RECOMMENDED.maintenance],
] as const;

export default function CostPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Cost</h2>
          <p className="text-sm text-slate-500">Operating cost structure and plan comparison</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Operating cost / day" value={formatINR(CURRENT.operating)} delta="Current plan" />
        <KpiCard label="Fuel / energy" value={formatINR(CURRENT.fuel)} delta={`${((CURRENT.fuel / CURRENT.operating) * 100).toFixed(0)}% of operating`} />
        <KpiCard label="Driver cost" value={formatINR(CURRENT.driver)} delta={`${((CURRENT.driver / CURRENT.operating) * 100).toFixed(0)}% of operating`} />
        <KpiCard label="Maintenance" value={formatINR(CURRENT.maintenance)} delta={`${((CURRENT.maintenance / CURRENT.operating) * 100).toFixed(0)}% of operating`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Cost structure" subtitle="Current plan breakdown">
          <DemandBarChart
            data={[
              { label: "Fuel", passengers: CURRENT.fuel },
              { label: "Drivers", passengers: CURRENT.driver },
              { label: "Maintenance", passengers: CURRENT.maintenance },
              { label: "Other", passengers: CURRENT.operating - CURRENT.fuel - CURRENT.driver - CURRENT.maintenance },
            ]}
            color="#ea580c"
            valueFormatter={formatINR}
            seriesName={(p) => `${p.label} cost`}
            height={300}
          />
        </ChartCard>

        <ChartCard title="Current plan vs recommended plan" subtitle="Projected daily impact of the allocation recommendation">
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th scope="col" className="px-4 py-2.5 font-semibold">Head</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Current</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Recommended</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, cur, rec]) => {
                  const delta = rec - cur;
                  return (
                    <tr key={label} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-700">{label}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">{formatINR(cur)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">{formatINR(rec)}</td>
                      <td className={`px-4 py-3 text-right font-bold tabular-nums ${delta <= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {delta >= 0 ? "+" : "−"}
                        {formatINR(Math.abs(delta))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Card className="mt-4 bg-slate-50 p-4">
            <p className="text-xs leading-relaxed text-slate-500">
              The recommended plan reallocates underused buses (R103, R107) toward critical
              corridors (R101, R104). Net effect is a small cost saving while cutting peak
              overcrowding. The optimization engine computes this live once the
              backend is connected.
            </p>
          </Card>
        </ChartCard>
      </div>
    </div>
  );
}
