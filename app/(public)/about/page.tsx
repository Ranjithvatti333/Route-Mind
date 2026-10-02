import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Route Mind — a public transport intelligence project for Hyderabad: what it studies, the problems it analyzes and how it supports transport planning.",
};

const CAPABILITIES = [
  ["Route analysis", "Corridor-level study of routes, stop sequences, distances and running times."],
  ["Passenger demand analysis", "Hourly, daily and weekly ridership patterns per route and stop."],
  ["Crowd analysis", "Predicted utilization against vehicle capacity, hour by hour across the day."],
  ["Peak-hour analysis", "Identifies the morning and evening windows when each route is under most pressure."],
  ["Bus & fleet analysis", "Fleet size, utilization and assignment across routes and depots."],
  ["Forecasting", "Projects ridership ahead of time using demand patterns, weather and events."],
  ["Bus allocation", "Recommended fleet distribution balancing crowding, waiting time and cost."],
  ["What-if simulation", "Scenario testing for rain, events, disruptions and fleet changes."],
];

const PROBLEMS = [
  ["Overcrowding", "Buses packed beyond capacity while other services on the same network run half-empty."],
  ["Unbalanced allocation", "Fleet spread across routes without matching the demand each corridor actually carries."],
  ["Unpredictable peaks", "Morning and evening surges that catch operators unprepared."],
  ["Weather and event shocks", "Rain and festivals that shift demand sharply on some corridors but not others."],
  ["Long waiting times", "Passengers stranded when service frequency does not match real demand."],
  ["Reactive planning", "Decisions made after problems appear instead of before the peak begins."],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">About the project</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Public transport should anticipate the city — not chase it
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          Route Mind is a final-year software project that studies public transport demand in
          Hyderabad, Telangana, and helps operators act on it. It combines ridership patterns,
          weather, festivals, holidays and local events to forecast crowding and recommend where
          buses should be — before the peak begins.
        </p>
      </header>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">What Route Mind does</h2>
          <ul className="mt-4 space-y-3">
            {CAPABILITIES.map(([t, d]) => (
              <li key={t}>
                <p className="text-sm font-semibold text-slate-800">{t}</p>
                <p className="text-sm leading-relaxed text-slate-500">{d}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Problems it analyzes</h2>
          <ul className="mt-4 space-y-3">
            {PROBLEMS.map(([t, d]) => (
              <li key={t}>
                <p className="text-sm font-semibold text-slate-800">{t}</p>
                <p className="text-sm leading-relaxed text-slate-500">{d}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Supporting transport planning</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The goal is practical: give planners and operators a clear picture of demand before it
          happens, so fleet capacity can be matched to the corridors that need it. Better
          allocation means fewer overcrowded buses, shorter waits at stops and a network that
          serves the city instead of reacting to it.
        </p>
      </Card>

      <div className="mt-10 text-center">
        <LinkButton href="/routes">Explore the network</LinkButton>
      </div>
    </div>
  );
}
