"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/States";
import type { TransportMapProps } from "./TransportMap";

/** Leaflet touches `window` — must render client-side only. */
const TransportMap = dynamic(() => import("./TransportMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export function MapPanel(props: TransportMapProps) {
  return <TransportMap {...props} />;
}

export default MapPanel;
