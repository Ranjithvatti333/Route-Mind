import type { Metadata } from "next";
import { BusesTable } from "./BusesTable";

export const metadata: Metadata = {
  title: "Bus Information",
  description:
    "Fleet overview for the Route Mind network — bus status, utilization, trips and route assignment.",
};

export default function BusesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bus Information</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Fleet assignments, utilization and operating status across the network.
        </p>
      </header>
      <BusesTable />
    </div>
  );
}
