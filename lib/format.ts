/** Display formatters shared across pages. */

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export function formatPct(n: number, digits = 0): string {
  return `${n >= 0 ? "" : ""}${n.toFixed(digits)}%`;
}

export function formatSignedPct(n: number, digits = 0): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

/**
 * Demo utilization estimate: daily passengers vs total daily seat-trips
 * (buses × seats × ~8 trips/bus/day). Clamped to a realistic 5–98% band.
 * Replace with backend-computed utilization when available.
 */
export function routeUtilization(route: {
  dailyPassengers: number;
  busesAssigned: number;
  capacityPerBus: number;
}): number {
  const tripsPerBusPerDay = 8;
  const raw = (route.dailyPassengers / (route.busesAssigned * route.capacityPerBus * tripsPerBusPerDay)) * 100;
  return Math.min(98, Math.max(5, Math.round(raw)));
}

export const CROWD_META: Record<
  string,
  { label: string; chip: string; dot: string; hex: string }
> = {
  low: {
    label: "Low",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    hex: "#16a34a",
  },
  moderate: {
    label: "Moderate",
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
    hex: "#d97706",
  },
  high: {
    label: "High",
    chip: "bg-orange-50 text-orange-700 ring-orange-200",
    dot: "bg-orange-500",
    hex: "#ea580c",
  },
  critical: {
    label: "Critical",
    chip: "bg-red-50 text-red-700 ring-red-200",
    dot: "bg-red-500",
    hex: "#dc2626",
  },
};

export const SEVERITY_META: Record<string, { label: string; chip: string }> = {
  critical: { label: "Critical", chip: "bg-red-50 text-red-700 ring-red-200" },
  warning: { label: "Warning", chip: "bg-amber-50 text-amber-700 ring-amber-200" },
  info: { label: "Info", chip: "bg-sky-50 text-sky-700 ring-sky-200" },
};
