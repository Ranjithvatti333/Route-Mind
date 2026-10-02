import { CROWD_META, SEVERITY_META } from "@/lib/format";
import type { AlertSeverity, CrowdLevel } from "@/lib/types";

export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function CrowdBadge({ level }: { level: CrowdLevel }) {
  const meta = CROWD_META[level];
  return (
    <Badge className={`${meta.chip} capitalize`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const meta = SEVERITY_META[severity];
  return <Badge className={`${meta.chip} uppercase tracking-wide`}>{meta.label}</Badge>;
}
