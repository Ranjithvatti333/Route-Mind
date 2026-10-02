"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/ui/Section";
import { MapPanel } from "@/components/map/MapPanel";
import { MAP_ROUTES } from "@/data/routes";
import { STOP_DEMAND, DEPOTS } from "@/data/network";
import { DEMO_EVENTS } from "@/data/intelligence";

export function MapSection() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="map-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hyderabad network map"
          title="See demand across the city"
          description="Route corridors, stop crowding, depots and event hotspots on an interactive OpenStreetMap view."
        />
        <div className="relative mt-10">
          <MapPanel
            routes={MAP_ROUTES}
            stops={STOP_DEMAND}
            depots={DEPOTS}
            events={DEMO_EVENTS}
            showDepots
            showEvents
            height="440px"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-400">Map data &copy; OpenStreetMap contributors.</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Open full-screen map
            <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M6.2 3.3a1 1 0 0 1 1.4 0l4.4 4.4a1 1 0 0 1 0 1.4l-4.4 4.4a1 1 0 1 1-1.4-1.4L9.8 8.4 6.2 4.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
