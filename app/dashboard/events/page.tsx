"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DataBoundary } from "@/components/ui/States";
import { Button } from "@/components/ui/Section";
import { Modal } from "@/components/ui/Modal";
import { useApiData } from "@/hooks/useApiData";
import { eventsService } from "@/services";
import { formatCompact, formatSignedPct } from "@/lib/format";
import type { TransitEvent } from "@/lib/types";

export default function EventsPage() {
  const state = useApiData(() => eventsService.list());
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", date: "", attendance: "" });

  const columns: Column<TransitEvent>[] = [
    {
      key: "event",
      header: "Event",
      render: (e) => (
        <div>
          <p className="font-semibold text-slate-800">{e.name}</p>
          <p className="text-xs text-slate-400">{e.date}</p>
        </div>
      ),
    },
    { key: "loc", header: "Location", render: (e) => e.location },
    { key: "att", header: "Expected attendance", render: (e) => <span className="tabular-nums">{formatCompact(e.expectedAttendance)}</span> },
    {
      key: "routes",
      header: "Affected routes",
      render: (e) => (
        <span className="flex flex-wrap gap-1">
          {e.affectedRouteIds.map((r) => (
            <span key={r} className="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-700">
              {r}
            </span>
          ))}
        </span>
      ),
    },
    {
      key: "impact",
      header: "Predicted impact",
      render: (e) => (
        <span className="rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
          {formatSignedPct(e.predictedDemandIncreasePct)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Events</h2>
          <p className="text-sm text-slate-500">Festivals, matches and gatherings that move demand</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setModalOpen(true)}>+ Create Event Scenario</Button>
        </div>
      </div>

      <Card>
        <DataBoundary state={state} isEmpty={(e) => e.length === 0} emptyTitle="No events in the calendar">
          {(rows) => <DataTable columns={columns} rows={rows} rowKey={(e) => e.id} caption="Upcoming events" />}
        </DataBoundary>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Event Scenario">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            // Backend scenario creation endpoint pending — form is UI-ready only.
            setModalOpen(false);
          }}
        >
          <div>
            <label htmlFor="ev-name" className="mb-1 block text-sm font-medium text-slate-700">Event name</label>
            <input
              id="ev-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-10 w-full rounded-xl border border-slate-300 px-3.5 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="e.g. Diwali market night"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ev-loc" className="mb-1 block text-sm font-medium text-slate-700">Location</label>
              <input
                id="ev-loc"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-300 px-3.5 text-sm focus:border-brand-500 focus:outline-none"
                placeholder="e.g. Charminar"
              />
            </div>
            <div>
              <label htmlFor="ev-date" className="mb-1 block text-sm font-medium text-slate-700">Date</label>
              <input
                id="ev-date"
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-300 px-3.5 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="ev-att" className="mb-1 block text-sm font-medium text-slate-700">Expected attendance</label>
            <input
              id="ev-att"
              type="number"
              min={0}
              value={form.attendance}
              onChange={(e) => setForm({ ...form, attendance: e.target.value })}
              className="h-10 w-full rounded-xl border border-slate-300 px-3.5 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="e.g. 25000"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create scenario</Button>
          </div>
          <p className="text-xs text-slate-400">
            UI only — scenario persistence and demand modeling arrive with the backend.
          </p>
        </form>
      </Modal>
    </div>
  );
}
