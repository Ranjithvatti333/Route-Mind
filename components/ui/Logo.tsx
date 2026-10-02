import Link from "next/link";

/** Route Mind logo — route path with nodes, location pin at destination. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Route Mind logo">
      <rect width="64" height="64" rx="14" className="fill-brand-600" />
      <path
        d="M14 46 C 22 46, 20 20, 32 20 C 44 20, 40 46, 50 46"
        fill="none"
        className="stroke-white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
      <circle cx="14" cy="46" r="5" className="fill-accent-300" />
      <circle cx="32" cy="20" r="4.5" className="fill-white" />
      <circle cx="50" cy="46" r="5" className="fill-white" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Route Mind home">
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-bold tracking-tight text-slate-900">ROUTE MIND</span>
          <span className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-slate-500">
            TRANSPORT INTELLIGENCE
          </span>
        </span>
      )}
    </Link>
  );
}
