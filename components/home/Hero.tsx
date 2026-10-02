import Link from "next/link";

/** Abstract animated network visualization — route lines, bus nodes, demand pulses. */
function HeroNetwork() {
  const routes: { d: string; color: string; delay: string }[] = [
    { d: "M40 300 C 120 300, 140 160, 240 160 S 400 220, 470 140", color: "#5b6ff1", delay: "0s" },
    { d: "M30 180 C 110 200, 180 300, 280 290 S 420 260, 480 320", color: "#26cfbc", delay: "-2s" },
    { d: "M70 380 C 160 360, 210 240, 320 250 S 430 190, 500 220", color: "#7b94f8", delay: "-4s" },
  ];
  const nodes: { cx: number; cy: number; color: string; label: string }[] = [
    { cx: 40, cy: 300, color: "#5b6ff1", label: "Depot" },
    { cx: 240, cy: 160, color: "#5b6ff1", label: "High demand" },
    { cx: 470, cy: 140, color: "#dc2626", label: "Critical" },
    { cx: 280, cy: 290, color: "#26cfbc", label: "Interchange" },
    { cx: 480, cy: 320, color: "#d97706", label: "Moderate" },
    { cx: 320, cy: 250, color: "#ea580c", label: "High demand" },
  ];

  return (
    <div className="relative" aria-hidden>
      <svg viewBox="0 0 520 420" className="w-full">
        {/* route lines */}
        {routes.map((r, i) => (
          <path
            key={i}
            d={r.d}
            fill="none"
            stroke={r.color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="2 14"
            className="animate-dash-flow"
            style={{ animationDelay: r.delay, opacity: 0.75 }}
          />
        ))}
        {/* soft halo rings on busy nodes */}
        {nodes.map((n, i) => (
          <circle
            key={`halo-${i}`}
            cx={n.cx}
            cy={n.cy}
            r={14}
            fill="none"
            stroke={n.color}
            strokeWidth={2}
            className="animate-pulse-soft"
            style={{ animationDelay: `${i * 0.45}s`, transformOrigin: `${n.cx}px ${n.cy}px` }}
          />
        ))}
        {/* nodes */}
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.cx} cy={n.cy} r={6} fill="#ffffff" stroke={n.color} strokeWidth={3} />
          </g>
        ))}
        {/* moving signal dots */}
        {routes.map((r, i) => (
          <circle key={`sig-${i}`} r={5} fill="#ffffff" stroke={r.color} strokeWidth={2.5}>
            <animateMotion dur={`${7 + i * 1.6}s`} repeatCount="indefinite" path={r.d} />
          </circle>
        ))}
      </svg>

      {/* legend */}
      <div className="absolute bottom-1 left-1 flex flex-col gap-1.5 rounded-xl bg-white/85 p-3 text-xs font-medium text-slate-600 shadow-card backdrop-blur sm:left-3">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Low crowd</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />Moderate</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-500" />High</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" />Critical</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      {/* subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(226 232 240 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(226 232 240 / 0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" />
            AI-Powered Public Transport Intelligence
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
            Understand Demand.{" "}
            <span className="text-brand-600">Predict Crowds.</span>{" "}
            Move Smarter.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Route Mind uses transport data, weather, events and AI forecasting to help public
            transport operators make smarter bus allocation decisions.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              Explore Routes
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M6.2 3.3a1 1 0 0 1 1.4 0l4.4 4.4a1 1 0 0 1 0 1.4l-4.4 4.4a1 1 0 1 1-1.4-1.4L9.8 8.4 6.2 4.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              Operator Dashboard
            </Link>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-card sm:p-6">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live network view
              </p>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" />
                Network feed
              </span>
            </div>
            <HeroNetwork />
          </div>
        </div>
      </div>
    </section>
  );
}
