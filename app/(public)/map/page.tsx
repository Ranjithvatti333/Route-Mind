import type { Metadata } from "next";
import { MapExplorer } from "./MapExplorer";

export const metadata: Metadata = {
  title: "Transport Map",
  description:
    "Interactive Hyderabad transport map — route corridors, stop crowding, events and depots on OpenStreetMap.",
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transport Map</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Toggle layers to explore routes, stop-level demand, event hotspots and depots. Built on
          OpenStreetMap.
        </p>
      </header>
      <MapExplorer />
    </div>
  );
}
