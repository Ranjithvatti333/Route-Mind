import Link from "next/link";
import { SectionHeading, LinkButton } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { DEMO_EVENTS, DEMO_WEATHER_IMPACT } from "@/data/intelligence";
import { formatCompact, formatSignedPct } from "@/lib/format";

/* ---------------- How Route Mind Works ---------------- */

const STEPS = [
  {
    name: "Data",
    desc: "Collect ridership, GPS, weather and event feeds into one operational picture.",
    icon: (
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4h13a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13ZM8 4v16M4 9.5h16M4 14.5h16" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    ),
  },
  {
    name: "Analyze",
    desc: "Clean and correlate demand patterns across routes, hours, days and seasons.",
    icon: (
      <path d="M4 19h16M7 16v-5m5 5V7m5 9v-8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    ),
  },
  {
    name: "Predict",
    desc: "Forecast demand and crowd levels per route using weather, events and history.",
    icon: (
      <path d="M4 15c3-1 4-6 7-6s4 4 9 2M4 19h16M15 5l5 5m0-5v5h-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    name: "Optimize",
    desc: "Match fleet capacity to predicted demand within operating constraints.",
    icon: (
      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m12.4-6.4-2.1 2.1m-4.6 4.6-2.1 2.1m0-8.8 2.1 2.1m4.6 4.6 2.1 2.1" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    ),
  },
  {
    name: "Recommend",
    desc: "Deliver clear allocation actions with expected impact on waiting time and cost.",
    icon: (
      <path d="M9 3h6l1 4 3 3v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9l3-3 1-4Zm-3 9h12M12 12v7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From raw signals to smarter allocation"
          description="Route Mind turns scattered operational data into decisions an operator can act on before the peak hits."
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <li key={step.name} className="relative">
              <Card className="h-full p-5 transition-shadow hover:shadow-card-hover">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>{step.icon}</svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {i + 1}</p>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">{step.name}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </Card>
              {i < STEPS.length - 1 && (
                <svg viewBox="0 0 16 16" className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 fill-slate-300 lg:block" aria-hidden>
                  <path d="M5 2.5 11.5 8 5 13.5z" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Intelligent Features ---------------- */

const FEATURES = [
  { name: "Demand Analytics", desc: "Understand passenger flow per route, hour and day of week.", icon: "M4 19h16M7 15v-4m5 4V6m5 9v-6" },
  { name: "Weather Intelligence", desc: "Learn route-specific relationships between rainfall and ridership.", icon: "M7 15a4 4 0 1 1 .6-7.95A5 5 0 0 1 17 9a3 3 0 0 1 0 6H7Zm-1 4 1-2m3.5 2 1-2m3.5 2 1-2" },
  { name: "Festival & Event Analysis", desc: "Anticipate surges around festivals, matches and public gatherings.", icon: "M12 3v3m6-1-2 2M6 5l2 2m9 5a5 5 0 1 1-10 0 5 5 0 0 1 10 0Zm-7 8h4m-2-3v3" },
  { name: "Crowd Prediction", desc: "See crowding before it happens — stop and time level forecasts.", icon: "M12 4a8 8 0 1 0 8 8h-8V4Zm2 0a8 8 0 0 1 6 6h-6V4Z" },
  { name: "Demand Forecasting", desc: "30-minute to 7-day horizons with confidence intervals.", icon: "M4 16c3-1.5 4.5-7 8-7s4 3.5 8 2M4 19.5h16M14 4l5 5m0-5v5h-5" },
  { name: "Bus Allocation", desc: "Recommended fleet distribution that keeps utilization balanced.", icon: "M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M4 17h16M8 21h.01M16 21h.01M4 13h16M8 17v2m8-2v2" },
  { name: "Network Analysis", desc: "Spot corridor-level bottlenecks and transfer pressure points.", icon: "M6 4v5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V4M6 20v-5a3 3 0 0 1 3-3" },
  { name: "What-If Simulation", desc: "Test rain, events or disruptions before committing the plan.", icon: "M15.5 3.5 20.5 8.5M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" },
];

export function IntelligentFeatures() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Intelligent features"
          title="An operations brain for the bus network"
          description="Every module feeds the same goal: the right number of buses, on the right routes, at the right time."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.name} className="group p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition-colors group-hover:bg-accent-100">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={f.icon} />
                </svg>
              </span>
              <h3 className="mt-4 text-sm font-bold text-slate-900">{f.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Smart Crowd Prediction preview ---------------- */

const CROWD_PREVIEW = [
  { time: "6 PM", level: "Moderate", bar: 68, color: "bg-amber-500", chip: "text-amber-700 bg-amber-50 ring-amber-200" },
  { time: "7 PM", level: "High", bar: 92, color: "bg-orange-500", chip: "text-orange-700 bg-orange-50 ring-orange-200" },
  { time: "8 PM", level: "Critical", bar: 118, color: "bg-red-500", chip: "text-red-700 bg-red-50 ring-red-200" },
];

export function CrowdPreview() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="crowd-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Smart crowd prediction"
              title="Know the rush before the stop fills up"
              description="Route Mind predicts utilization per route and time window, so operators can act hours ahead instead of reacting at the bus stop."
            />
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />Utilization forecast against vehicle capacity</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />Prediction confidence shown with every forecast</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />Overcrowding ETA with recommended actions</li>
            </ul>
            <div className="mt-8">
              <LinkButton href="/crowd" variant="primary">Open Crowd Forecast</LinkButton>
            </div>
          </div>

          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Route R101 — evening forecast</h3>
            </div>
            <div className="space-y-4">
              {CROWD_PREVIEW.map((p) => (
                <div key={p.time}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{p.time}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${p.chip}`}>{p.level}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${p.color}`} style={{ width: `${Math.min(100, p.bar)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Weather Intelligence ---------------- */

export function WeatherIntelligence() {
  const impacts = DEMO_WEATHER_IMPACT.slice(0, 4);
  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="weather-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Card className="order-last p-6 lg:order-first">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Predicted demand change if it rains</h3>
            </div>
            <ul className="space-y-3">
              {impacts.map((imp) => {
                const positive = imp.demandChangePct >= 0;
                return (
                  <li key={imp.routeId} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 text-sm font-bold text-slate-800">{imp.routeId}</span>
                    <div className="relative h-8 flex-1 rounded-lg bg-slate-100">
                      <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300" aria-hidden />
                      <div
                        className={`absolute inset-y-1 rounded-md ${positive ? "bg-red-400" : "bg-emerald-400"}`}
                        style={
                          positive
                            ? { left: "50%", width: `${Math.min(48, imp.demandChangePct)}%` }
                            : { right: "50%", width: `${Math.min(48, -imp.demandChangePct)}%` }
                        }
                      />
                    </div>
                    <span
                      className={`w-14 shrink-0 text-right text-sm font-bold tabular-nums ${
                        positive ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {formatSignedPct(imp.demandChangePct)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
              Route Mind does not assume rain always increases demand — the model
              learns each route&rsquo;s own weather relationship from history.
            </p>
          </Card>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Weather intelligence"
              title="Rain behaves differently on every route"
              description="A downpour may push office commuters toward buses on one corridor while emptying another as trips get postponed. Route Mind learns these route-specific patterns instead of applying one rule to the whole network."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Route-specific learning", "Weather sensitivity is modeled per corridor, not globally."],
                ["Forecast-aware planning", "Rain forecasts feed tomorrow's allocation recommendation."],
                ["Impact ranges, not guesses", "Each prediction carries a demand-change range with confidence."],
                ["Operational alerts", "Warnings trigger when rainfall crosses a route's learned threshold."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-bold text-slate-900">{t}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Event Intelligence ---------------- */

export function EventIntelligence() {
  const events = DEMO_EVENTS.slice(0, 3);
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="events-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Event intelligence"
          title="Festivals and events, translated into bus demand"
          description="When thousands of people converge on one part of the city, Route Mind connects the dots to the routes that serve them."
        />
        <Card className="mt-10 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-bold text-slate-900">Upcoming events</h3>
          </div>
          <div className="scroll-slim overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-5 py-3 font-semibold">Event</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Location</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Expected attendance</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Affected routes</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Predicted increase</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{ev.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{ev.location}</td>
                    <td className="px-5 py-3.5 tabular-nums text-slate-600">{formatCompact(ev.expectedAttendance)}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex gap-1">
                        {ev.affectedRouteIds.map((r) => (
                          <span key={r} className="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-700">{r}</span>
                        ))}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold tabular-nums text-red-600">
                      {formatSignedPct(ev.predictedDemandIncreasePct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- Dynamic Bus Allocation preview ---------------- */

const ALLOCATION_PREVIEW = [
  { route: "R101", from: 12, to: 16, dir: "up" as const },
  { route: "R103", from: 14, to: 12, dir: "down" as const },
  { route: "R104", from: 11, to: 14, dir: "up" as const },
  { route: "R107", from: 15, to: 13, dir: "down" as const },
];

export function AllocationPreview() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="allocation-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Dynamic bus allocation"
              title="Move buses to where demand will be"
              description="Route Mind compares the current fleet plan against predicted demand and proposes a reallocation — with the expected impact on waiting time, crowding and cost."
            />
            <blockquote className="mt-6 rounded-xl border-l-4 border-brand-500 bg-white px-4 py-3 text-sm italic leading-relaxed text-slate-600 shadow-card">
              Recommendation based on predicted demand and available capacity.
            </blockquote>
            <div className="mt-8">
              <LinkButton href="/login">See it in the dashboard</LinkButton>
            </div>
          </div>

          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Current vs recommended</h3>
            </div>
            <ul className="space-y-4">
              {ALLOCATION_PREVIEW.map((a) => (
                <li key={a.route} className="flex items-center gap-4">
                  <span className="w-14 text-sm font-bold text-slate-800">{a.route}</span>
                  <span className="text-sm tabular-nums text-slate-400 line-through">{a.from}</span>
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-slate-300" aria-hidden>
                    <path d="M9.3 2.3 15 8l-5.7 5.7-1.4-1.4 3.3-3.3H1v-2h10.2L7.9 3.7l1.4-1.4Z" />
                  </svg>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums ${
                      a.dir === "up" ? "bg-brand-50 text-brand-700" : "bg-accent-50 text-accent-700"
                    }`}
                  >
                    {a.to} buses
                  </span>
                  <span
                    className={`ml-auto text-xs font-semibold ${
                      a.dir === "up" ? "text-brand-600" : "text-accent-600"
                    }`}
                  >
                    {a.dir === "up" ? `+${a.to - a.from}` : a.to - a.from}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-20" aria-labelledby="cta-heading">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, rgb(91 111 241 / 0.5) 0, transparent 45%), radial-gradient(circle at 75% 70%, rgb(13 179 164 / 0.4) 0, transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 id="cta-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Make Every Bus Count.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-brand-200">
          Explore the network, study demand patterns and see how intelligent allocation changes
          the daily commute for thousands of passengers.
        </p>
        <div className="mt-8">
          <Link
            href="/routes"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-brand-800 shadow-lg transition-colors hover:bg-brand-50"
          >
            Explore Route Mind
            <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M6.2 3.3a1 1 0 0 1 1.4 0l4.4 4.4a1 1 0 0 1 0 1.4l-4.4 4.4a1 1 0 1 1-1.4-1.4L9.8 8.4 6.2 4.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
