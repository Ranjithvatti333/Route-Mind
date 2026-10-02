import { Card } from "./Card";

export function KpiCard({
  label,
  value,
  delta,
  deltaPositive,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
      {delta && (
        <p
          className={`mt-1 text-xs font-medium ${
            deltaPositive === undefined
              ? "text-slate-400"
              : deltaPositive
                ? "text-emerald-600"
                : "text-red-600"
          }`}
        >
          {delta}
        </p>
      )}
    </Card>
  );
}
