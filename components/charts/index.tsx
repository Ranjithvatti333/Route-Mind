"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CROWD_META, formatCompact, formatINR } from "@/lib/format";
import type { CrowdPoint, DemandPoint, ForecastPoint } from "@/lib/types";

const AXIS = { stroke: "#94a3b8", fontSize: 11 };
const GRID = "#e2e8f0";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px -8px rgb(15 23 42 / 0.15)",
  fontSize: 12,
};

export function DemandAreaChart({
  data,
  color = "#3d4ee4",
  valueFormatter = (v: number) => formatCompact(v),
  height = 260,
}: {
  data: DemandPoint[];
  color?: string;
  valueFormatter?: (v: number) => string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} tickFormatter={valueFormatter} width={44} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [valueFormatter(Number(v)), "Passengers"]}
        />
        <Area
          type="monotone"
          dataKey="passengers"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.replace("#", "")})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DemandBarChart({
  data,
  color = "#0db3a4",
  height = 260,
  valueFormatter = (v: number) => formatCompact(v),
  seriesName = "Passengers",
}: {
  data: DemandPoint[];
  color?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
  /** Tooltip label — string, or derived from the hovered category. */
  seriesName?: string | ((point: DemandPoint) => string);
}) {
  const labelFor = (point: DemandPoint): string =>
    typeof seriesName === "function" ? seriesName(point) : seriesName;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} tickFormatter={valueFormatter} width={44} />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "#f1f5f9" }}
          formatter={(v, _name, item) => [
            valueFormatter(Number(v)),
            labelFor(item.payload as DemandPoint),
          ]}
        />
        <Bar dataKey="passengers" fill={color} radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Crowd timeline — bar color reflects crowd severity; selected hour emphasized. */
export function CrowdTimelineChart({
  points,
  height = 260,
  highlightTime,
}: {
  points: CrowdPoint[];
  height?: number;
  /** Hour label of the bar to emphasize (e.g. "8 AM") — others dim slightly. */
  highlightTime?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="time" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "#f1f5f9" }}
          formatter={(v, _n, item) => {
            const p = item.payload as CrowdPoint;
            return [`${v}% · ${CROWD_META[p.crowd].label}`, "Utilization"];
          }}
        />
        <Bar dataKey="utilization" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {points.map((p) => {
            const selected = highlightTime !== undefined && p.time === highlightTime;
            return (
              <Cell
                key={p.time}
                fill={CROWD_META[p.crowd].hex}
                fillOpacity={highlightTime === undefined || selected ? 1 : 0.4}
                stroke={selected ? "#0f172a" : undefined}
                strokeWidth={selected ? 2 : undefined}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Forecast — historical actuals plus predicted line with confidence band. */
export function ForecastChart({
  points,
  height = 300,
}: {
  points: ForecastPoint[];
  height?: number;
}) {
  const data = points.map((p) => ({
    ...p,
    band: p.upper,
    bandBase: p.lower,
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="time" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} tickFormatter={formatCompact} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCompact(Number(v))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="band" stroke="none" fill="#3d4ee4" fillOpacity={0.08} name="Prediction interval" legendType="none" />
        <Area type="monotone" dataKey="bandBase" stroke="none" fill="#ffffff" fillOpacity={1} name=" " legendType="none" />
        <Line type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={2} dot={false} name="Historical" connectNulls={false} />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#3d4ee4"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={{ r: 3, fill: "#3d4ee4" }}
          name="Forecast"
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Revenue trend — INR formatted. */
export function RevenueChart({
  data,
  height = 280,
}: {
  data: DemandPoint[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0db3a4" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#0db3a4" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={54} tickFormatter={formatINR} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatINR(Number(v)), "Revenue"]} />
        <Area type="monotone" dataKey="passengers" stroke="#0db3a4" strokeWidth={2} fill="url(#grad-rev)" name="Revenue" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Compact horizontal utilization bar for tables/cards. */
export function UtilBar({ value }: { value: number }) {
  const color =
    value >= 100
      ? "bg-red-500"
      : value >= 85
        ? "bg-orange-500"
        : value >= 60
          ? "bg-amber-500"
          : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full min-w-16 overflow-hidden rounded-full bg-slate-100" role="presentation">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="w-11 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-700">
        {value}%
      </span>
    </div>
  );
}
