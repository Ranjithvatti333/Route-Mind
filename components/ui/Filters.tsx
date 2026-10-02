"use client";

import { useId } from "react";

export function FilterBar({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card ${className}`}
      role="group"
      aria-label="Filters"
    >
      {children}
    </div>
  );
}

export function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <div className="flex min-w-40 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

export function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label?: string;
}) {
  const id = useId();
  return (
    <div className="flex min-w-40 flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-500">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const id = useId();
  return (
    <div className="flex min-w-48 flex-1 flex-col gap-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <svg
          viewBox="0 0 20 20"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-slate-400"
          aria-hidden
        >
          <path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.64 3.65a1 1 0 0 1-1.41 1.41l-3.65-3.64A5.5 5.5 0 1 1 8.5 3Zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        </svg>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
