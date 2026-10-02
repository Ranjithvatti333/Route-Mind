import type { Metadata } from "next";
import { CrowdExplorer } from "./CrowdExplorer";

export const metadata: Metadata = {
  title: "Crowd Forecast",
  description:
    "Predicted crowd levels by route, date and time — utilization, capacity and prediction confidence from Route Mind.",
};

export default function CrowdPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Crowd Forecast</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          See how busy each route is expected to be — before passengers reach the stop.
        </p>
      </header>
      <CrowdExplorer />
    </div>
  );
}
