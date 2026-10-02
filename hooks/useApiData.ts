"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiEnvelope } from "@/lib/types";

export interface ApiDataState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
  /** True when data came from the bundled demo layer (no backend). */
  isDemo: boolean;
  refetch: () => void;
}

/**
 * Generic data hook: loading / success / error states for every
 * data-driven component. Prevents blank screens and duplicated logic.
 *
 * Note: resetting to the loading state inside the fetch effect is
 * intentional — data fetching is the one legitimate "synchronize with an
 * external system" effect in this app, so the set-state lint rule is
 * disabled on those lines only.
 */
export function useApiData<T>(
  fetcher: () => Promise<ApiEnvelope<T>>,
  deps: unknown[] = [],
): ApiDataState<T> {
  const [data, setData] = useState<T>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<Error>();
  const [isDemo, setIsDemo] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    setError(undefined);

    fetcher()
      .then((envelope) => {
        if (cancelled) return;
        setData(envelope.data);
        setIsDemo(envelope.source === "demo");
        setStatus("success");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { data, isLoading: status === "loading", error, isDemo, refetch };
}
