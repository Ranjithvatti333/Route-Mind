import type { Metadata } from "next";
import { RoutesBrowser } from "./RoutesBrowser";

export const metadata: Metadata = {
  title: "Routes",
  description:
    "Browse Hyderabad routes with live crowd status, peak windows and service status — demand insights from Route Mind.",
};

export default function RoutesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Routes</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Explore the network route by route — current crowding, peak periods and operational
          status at a glance.
        </p>
      </header>
      <RoutesBrowser />
    </div>
  );
}
