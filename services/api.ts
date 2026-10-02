/**
 * API abstraction layer.
 *
 * When NEXT_PUBLIC_API_BASE_URL is set, requests go to the FastAPI backend.
 * Until then the layer serves bundled DEMO data from `data/` so every page
 * has realistic loading / success / error handling without a live backend.
 *
 * Swap rule: replace a service's `fallback` with the matching backend
 * endpoint — no component changes needed.
 */

import type { ApiEnvelope } from "@/lib/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** Demo mode when no backend URL is configured. */
export const IS_DEMO_MODE = !API_BASE_URL;

/** Small artificial latency so loading states are exercised in demo mode. */
const DEMO_LATENCY_MS = 250;

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Fetch from backend when configured; otherwise resolve the supplied demo
 * fallback. Backend failures propagate so hooks can render error states.
 */
export async function request<T>(
  path: string,
  fallback: () => T | Promise<T>,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  if (IS_DEMO_MODE) {
    await delay(DEMO_LATENCY_MS);
    return { data: await fallback(), source: "demo" };
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    throw new ApiError(`Request failed: ${path}`, res.status);
  }

  return { data: (await res.json()) as T, source: "api" };
}
