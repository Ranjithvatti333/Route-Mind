"use client";

import { useEffect, useId, useRef } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* backdrop click closes */}
      <button type="button" aria-label="Close dialog" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-card-hover outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-base font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden>
              <path d="m10 8.6 3.3-3.3 1.4 1.4L11.4 10l3.3 3.3-1.4 1.4L10 11.4l-3.3 3.3-1.4-1.4L8.6 10 5.3 6.7l1.4-1.4L10 8.6Z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
