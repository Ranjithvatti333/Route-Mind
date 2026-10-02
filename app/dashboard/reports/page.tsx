"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Section";
import { DEMO_REPORTS } from "@/data/intelligence";
import { generateReport } from "@/lib/reports";

/** Per-report client-side generation state. No backend queue exists. */
type ReportStatus = "generating" | "generated";

const GENERATION_DELAY_MS = 900;

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Record<string, { status: ReportStatus; filename: string; content: string }>>({});
  const timers = useRef<number[]>([]);
  // Ref guard: repeated synchronous clicks must not queue multiple timers
  // before the state update commits.
  const generatingRef = useRef<Set<string>>(new Set());

  // Clear any pending generation timers when the page unmounts.
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const generate = (id: string) => {
    // One generation process per report at a time.
    if (generatingRef.current.has(id)) return;
    generatingRef.current.add(id);
    setReports((prev) => ({ ...prev, [id]: { status: "generating", filename: "", content: "" } }));
    const timer = window.setTimeout(() => {
      generatingRef.current.delete(id);
      const { filename, content } = generateReport(id);
      setReports((prev) => ({ ...prev, [id]: { status: "generated", filename, content } }));
    }, GENERATION_DELAY_MS);
    timers.current.push(timer);
  };

  const download = (report: { status: ReportStatus; filename: string; content: string }) => {
    if (report.status !== "generated") return;
    downloadTextFile(report.filename, report.content);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Reports</h2>
          <p className="text-sm text-slate-500">
            On-demand reports generated in your browser from the shared network dataset.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_REPORTS.map((report) => {
          const state = reports[report.id];
          const isGenerating = state?.status === "generating";
          const isGenerated = state?.status === "generated";
          return (
            <Card key={report.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6m-6 4h6" />
                  </svg>
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                  {report.cadence}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">{report.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">{report.description}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant={isGenerated ? "secondary" : "primary"}
                  className="!px-4 !py-1.5 text-xs"
                  disabled={isGenerating}
                  onClick={() => generate(report.id)}
                >
                  {isGenerating ? "Generating…" : isGenerated ? "Generated" : "Generate"}
                </Button>
                <Button
                  variant="ghost"
                  className="!px-3 !py-1.5 text-xs"
                  disabled={!isGenerated}
                  title={isGenerated ? `Download ${state.filename}` : "Generate the report first"}
                  onClick={() => download(state)}
                >
                  Download
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200 bg-slate-50 p-4">
        <p className="text-xs leading-relaxed text-slate-500">
          Reports are generated client-side from the shared demo dataset (routes, fleet, demand,
          crowd forecasts, alerts, weather, events). Downloaded files are plain-text; when the
          backend report service lands, this flow will switch to server-generated PDF/CSV.
        </p>
      </Card>
    </div>
  );
}
