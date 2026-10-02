import type { Metadata } from "next";
import { SchedulesBrowser } from "./SchedulesBrowser";

export const metadata: Metadata = {
  title: "Schedules",
  description:
    "Route timetables for the Route Mind network — first and last bus, headways and departures.",
};

export default function SchedulesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Schedules</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Pick a route to view its timetable — departures across the full service day,
          from the first bus at 5:00 AM to the last at 10:00 PM.
        </p>
      </header>
      <SchedulesBrowser />
    </div>
  );
}
