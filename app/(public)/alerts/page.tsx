import type { Metadata } from "next";
import { AlertsList } from "./AlertsList";

export const metadata: Metadata = {
  title: "Service Alerts",
  description:
    "Critical alerts, warnings and advisories across the Route Mind network — with recommended operator actions.",
};

export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Service Alerts</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Predicted overcrowding, weather risks and event advisories — each with the reason and a
          recommended action.
        </p>
      </header>
      <AlertsList />
    </div>
  );
}
