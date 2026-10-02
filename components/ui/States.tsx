/** Loading, empty and error states — no data component renders a blank screen. */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}

export function LoadingState({ label = "Loading data…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-slate-500">
      <span
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-600"
        role="status"
        aria-label={label}
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <svg viewBox="0 0 48 48" className="h-10 w-10 text-slate-300" aria-hidden>
        <path
          d="M14 34c-4 0-7-3-7-7 0-3.5 2.5-6.4 5.8-6.9C13.9 15 18.5 11.5 24 11.5c6.4 0 11.7 4.8 12.4 11 3.9.4 6.6 3.4 6.6 7 0 4-3 6.5-7 6.5H14Z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong while loading this data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
        <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2Zm-1 5a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0V7Zm1 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
        </svg>
      </span>
      <p className="max-w-sm text-sm text-slate-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/** Composes the three states around success content. */
export function DataBoundary<T>({
  state,
  isEmpty,
  emptyTitle = "No data available",
  emptyDescription,
  children,
}: {
  state: { isLoading: boolean; error: Error | undefined; data: T | undefined; refetch: () => void };
  isEmpty?: (data: T) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children: (data: T) => React.ReactNode;
}) {
  if (state.isLoading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error.message} onRetry={state.refetch} />;
  if (state.data === undefined || (isEmpty ? isEmpty(state.data) : false)) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }
  return <>{children(state.data)}</>;
}
