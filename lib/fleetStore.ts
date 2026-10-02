/**
 * Shared in-memory fleet store — the single source of truth for routes and
 * buses in demo mode. Every consumer (buses, routes, dashboard, analytics,
 * allocation, maps) reads the same state, so Apply Plan / Add Bus / Remove
 * Bus changes stay consistent across the app without a backend.
 *
 * Deterministic: bus IDs and registrations derive from current fleet state,
 * so the same action sequence always produces the same result.
 */

import type { AllocationRecommendation, TransitBus, TransitRoute } from "@/lib/types";
import { DEMO_BUSES, DEMO_ROUTES } from "@/data/routes";
import { DEMO_ALLOCATION } from "@/data/intelligence";

export interface FleetSnapshot {
  routes: TransitRoute[];
  buses: TransitBus[];
}

export interface ApplyPlanResult {
  ok: boolean;
  added: number;
  removed: number;
  routesChanged: number;
  errors: string[];
}

const routes: TransitRoute[] = DEMO_ROUTES.map((r) => ({ ...r }));
let buses: TransitBus[] = DEMO_BUSES.map((b) => ({ ...b }));
let snapshot: FleetSnapshot = { routes, buses };

/**
 * Allocation comparison state. `baselines` is the immutable per-route
 * allocation the session started with (the fixed left column);
 * `planTargets` is the proposed allocation (the right column) that manual
 * Add/Remove adjusts and Apply Plan materializes. Baselines are seeded once
 * and never overwritten — Apply only moves the live fleet, not the
 * reference point.
 */
const baselines = new Map<string, number>();
const planTargets = new Map<string, number>();
let allocationStateSeeded = false;

function seedAllocationState() {
  if (allocationStateSeeded) return;
  for (const r of routes) {
    baselines.set(r.id, r.busesAssigned);
    planTargets.set(r.id, r.busesAssigned);
  }
  for (const rec of DEMO_ALLOCATION) planTargets.set(rec.routeId, Math.max(0, rec.recommendedBuses));
  allocationStateSeeded = true;
}

const listeners = new Set<() => void>();

/** Publish a new immutable snapshot and notify subscribers. */
function commit() {
  snapshot = {
    routes: routes.map((r) => ({ ...r })),
    buses: buses.map((b) => ({ ...b })),
  };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Deterministic next bus id for a route: R101-B13 follows R101-B12. */
function nextBusId(routeId: string): string {
  const prefix = `${routeId}-B`;
  let max = 0;
  for (const b of buses) {
    if (b.id.startsWith(prefix)) {
      const n = Number.parseInt(b.id.slice(prefix.length), 10);
      if (Number.isFinite(n) && n > max) max = n;
    }
  }
  return `${prefix}${max + 1}`;
}

/** Deterministic next registration number across the whole fleet. */
function nextRegistration(): string {
  let max = 1199;
  for (const b of buses) {
    const m = /(\d+)$/.exec(b.registration);
    const n = m ? Number.parseInt(m[1], 10) : NaN;
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `TS07 UB ${max + 1}`;
}

function makeBus(routeId: string): TransitBus {
  return {
    id: nextBusId(routeId),
    registration: nextRegistration(),
    routeId,
    status: "idle",
    tripsToday: 0,
    passengersToday: 0,
    utilization: 0,
    revenueToday: 0,
  };
}

export const fleetStore = {
  subscribe,
  getSnapshot: (): FleetSnapshot => snapshot,
  getRoutes: () => snapshot.routes,
  getBuses: () => snapshot.buses,
  getRoute: (id: string) => snapshot.routes.find((r) => r.id === id),

  /** Add a bus to the fleet and assign it to a route. Returns the new bus. */
  addBus(routeId: string): TransitBus | null {
    seedAllocationState();
    const route = routes.find((r) => r.id === routeId);
    if (!route) return null;

    const bus = makeBus(routeId);
    buses = [...buses, bus];
    route.busesAssigned += 1;
    // Only the proposed allocation moves — the baseline stays fixed.
    planTargets.set(routeId, (planTargets.get(routeId) ?? route.busesAssigned) + 1);
    commit();
    return bus;
  },

  /**
   * Remove a bus from the fleet. Its route assignment goes with it — the
   * route's assigned count is decremented so no broken assignment remains.
   * Only the proposed allocation moves — the baseline stays fixed.
   */
  removeBus(busId: string): TransitBus | null {
    seedAllocationState();
    const bus = buses.find((b) => b.id === busId);
    if (!bus) return null;

    buses = buses.filter((b) => b.id !== busId);
    const route = routes.find((r) => r.id === bus.routeId);
    if (route) {
      route.busesAssigned = Math.max(0, route.busesAssigned - 1);
      const target = planTargets.get(route.id) ?? route.busesAssigned;
      planTargets.set(route.id, Math.max(0, target - 1));
    }
    commit();
    return bus;
  },

  /**
   * Recommendation rows for the comparison table. `currentBuses` is the
   * fixed baseline; `recommendedBuses` is the proposed allocation, which
   * manual Add/Remove accumulates against the baseline. Impact estimates
   * (wait, crowding, cost) are rescaled to the baseline-vs-proposed delta.
   */
  getRecommendations(): AllocationRecommendation[] {
    seedAllocationState();
    return DEMO_ALLOCATION.map((rec) => {
      const baseline = baselines.get(rec.routeId) ?? rec.currentBuses;
      const proposed = planTargets.get(rec.routeId) ?? rec.recommendedBuses;
      const baseDelta = rec.recommendedBuses - rec.currentBuses;
      const scale = baseDelta !== 0 ? (proposed - baseline) / baseDelta : 0;
      return {
        ...rec,
        currentBuses: baseline,
        recommendedBuses: proposed,
        waitingTimeChangeMin: Math.round(rec.waitingTimeChangeMin * scale * 10) / 10,
        crowdingChangePct: Math.round(rec.crowdingChangePct * scale),
        operatingCostChangeInr: Math.round(rec.operatingCostChangeInr * scale),
      };
    });
  },

  /**
   * Validate then apply an allocation plan: every listed route's live fleet
   * moves to its proposed bus count. Validation runs before any mutation, so
   * the fleet is never left half-applied, negative, or with dangling
   * assignments. Baselines are never touched — the comparison table keeps
   * its fixed left column after Apply.
   */
  applyPlan(recommendations: AllocationRecommendation[]): ApplyPlanResult {
    seedAllocationState();
    const errors: string[] = [];
    const plan: { route: TransitRoute; target: number; delta: number }[] = [];

    for (const rec of recommendations) {
      const route = routes.find((r) => r.id === rec.routeId);
      if (!route) {
        errors.push(`Unknown route ${rec.routeId}`);
        continue;
      }
      const target = Math.max(0, Math.round(rec.recommendedBuses));
      const delta = target - route.busesAssigned;
      if (delta < 0 && buses.filter((b) => b.routeId === route.id).length < -delta) {
        errors.push(`Not enough buses on ${route.id} to remove ${-delta}`);
        continue;
      }
      plan.push({ route, target, delta });
    }

    if (errors.length > 0 || plan.length === 0) {
      return { ok: errors.length === 0, added: 0, removed: 0, routesChanged: 0, errors };
    }

    let added = 0;
    let removed = 0;
    for (const { route, target, delta } of plan) {
      if (delta > 0) {
        for (let i = 0; i < delta; i++) buses = [...buses, makeBus(route.id)];
        added += delta;
      } else if (delta < 0) {
        // Remove idle buses first so active service is least disturbed.
        const rank = { idle: 0, maintenance: 1, active: 2 } as const;
        const onRoute = buses
          .filter((b) => b.routeId === route.id)
          .sort((a, b) => rank[a.status] - rank[b.status]);
        const removeIds = new Set(onRoute.slice(0, -delta).map((b) => b.id));
        buses = buses.filter((b) => !removeIds.has(b.id));
        removed += -delta;
      }
      route.busesAssigned = target;
    }

    commit();
    return {
      ok: true,
      added,
      removed,
      routesChanged: plan.filter((p) => p.delta !== 0).length,
      errors: [],
    };
  },
};
