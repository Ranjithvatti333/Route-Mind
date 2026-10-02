"use client";

import { useSyncExternalStore } from "react";
import { fleetStore } from "@/lib/fleetStore";

/**
 * Subscribe a component to the shared fleet store. Re-renders whenever an
 * allocation is applied or a bus is added/removed anywhere in the app.
 */
export function useFleet() {
  const snapshot = useSyncExternalStore(
    fleetStore.subscribe,
    fleetStore.getSnapshot,
    fleetStore.getSnapshot,
  );
  return snapshot;
}
