"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Section";
import { DEMO_ROUTES } from "@/data/routes";

const STORAGE_KEY = "routemind.settings.v1";

type SettingsState = {
  name: string;
  email: string;
  role: string;
  criticalCrowdAlerts: boolean;
  weatherWarnings: boolean;
  eventReminders: boolean;
  dailyDigest: boolean;
  compactTables: boolean;
  autoRefresh: boolean;
  defaultRoute: string;
  weatherFeatures: boolean;
  eventCalendar: boolean;
  excludeHolidays: boolean;
  horizon: string;
  threshold: number;
};

const DEFAULT_SETTINGS: SettingsState = {
  name: "Operations Manager",
  email: "operator@routemind.example",
  role: "Controller",
  criticalCrowdAlerts: true,
  weatherWarnings: true,
  eventReminders: false,
  dailyDigest: true,
  compactTables: false,
  autoRefresh: true,
  defaultRoute: "All routes",
  weatherFeatures: true,
  eventCalendar: true,
  excludeHolidays: false,
  horizon: "3 hours",
  threshold: 100,
};

const ROLES = ["Controller", "Depot Manager", "Planner", "Administrator"];
const HORIZONS = ["30 minutes", "1 hour", "3 hours", "Tomorrow", "7 days"];

// localStorage acts as the settings store. useSyncExternalStore keeps the page
// hydration-safe: the server snapshot is the defaults, and saved values are
// applied right after hydration without a markup mismatch.
function readStoredSettings(): SettingsState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SettingsState>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

let cachedSnapshot: SettingsState | null = null;
const listeners = new Set<() => void>();

function onExternalStorageChange() {
  cachedSnapshot = null;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("storage", onExternalStorageChange);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onExternalStorageChange);
    }
  };
}

function getSnapshot(): SettingsState {
  if (!cachedSnapshot) cachedSnapshot = readStoredSettings();
  return cachedSnapshot;
}

function getServerSnapshot(): SettingsState {
  return DEFAULT_SETTINGS;
}

function persistSettings(next: SettingsState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    cachedSnapshot = next;
    listeners.forEach((listener) => listener());
    return true;
  } catch {
    return false;
  }
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-brand-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [overrides, setOverrides] = useState<Partial<SettingsState>>({});
  const [justSaved, setJustSaved] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const settings = useMemo<SettingsState>(
    () => ({ ...saved, ...overrides }),
    [saved, overrides]
  );
  const dirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(saved),
    [settings, saved]
  );

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setOverrides((prev) => ({ ...prev, [key]: value }));
    setJustSaved(false);
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }

  function handleSave() {
    if (!dirty) return; // nothing to persist — skip duplicate saves
    if (persistSettings(settings)) {
      setOverrides({});
      setJustSaved(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setJustSaved(false), 4000);
    } else {
      setJustSaved(false);
    }
  }

  function handleDiscard() {
    setOverrides({});
    setJustSaved(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">
          Operator preferences, saved on this device.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900">Profile</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="set-name" className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
              <input
                id="set-name"
                value={settings.name}
                onChange={(e) => update("name", e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-300 px-3.5 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="set-email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                id="set-email"
                type="email"
                value={settings.email}
                onChange={(e) => update("email", e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-300 px-3.5 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="set-role" className="mb-1 block text-sm font-medium text-slate-700">Role</label>
              <select
                id="set-role"
                value={settings.role}
                onChange={(e) => update("role", e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none"
              >
                {(ROLES.includes(settings.role) ? ROLES : [settings.role, ...ROLES]).map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          <div className="mt-2 divide-y divide-slate-100">
            <Toggle label="Critical crowd alerts" desc="Immediate alert when a route is predicted to exceed capacity." checked={settings.criticalCrowdAlerts} onChange={(v) => update("criticalCrowdAlerts", v)} />
            <Toggle label="Weather warnings" desc="Notify when forecast rainfall crosses a route's learned threshold." checked={settings.weatherWarnings} onChange={(v) => update("weatherWarnings", v)} />
            <Toggle label="Event reminders" desc="Day-before summary of events affecting your routes." checked={settings.eventReminders} onChange={(v) => update("eventReminders", v)} />
            <Toggle label="Daily digest email" desc="Network KPI summary every morning at 7 AM." checked={settings.dailyDigest} onChange={(v) => update("dailyDigest", v)} />
          </div>
        </Card>

        {/* Dashboard preferences */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900">Dashboard preferences</h3>
          <div className="mt-2 divide-y divide-slate-100">
            <Toggle label="Compact tables" desc="Denser rows to fit more routes on screen." checked={settings.compactTables} onChange={(v) => update("compactTables", v)} />
            <Toggle label="Auto-refresh data" desc="Reload dashboard data every 60 seconds (when backend is live)." checked={settings.autoRefresh} onChange={(v) => update("autoRefresh", v)} />
          </div>
          <div className="mt-4">
            <label htmlFor="set-default-route" className="mb-1 block text-sm font-medium text-slate-700">Default route filter</label>
            <select
              id="set-default-route"
              value={settings.defaultRoute}
              onChange={(e) => update("defaultRoute", e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none"
            >
              <option>All routes</option>
              {DEMO_ROUTES.map((r) => (
                <option key={r.id}>{r.id}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Data settings */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900">Data settings</h3>
          <div className="mt-2 divide-y divide-slate-100">
            <Toggle label="Include weather features" desc="Feed weather data into demand predictions." checked={settings.weatherFeatures} onChange={(v) => update("weatherFeatures", v)} />
            <Toggle label="Include event calendar" desc="Feed event data into demand predictions." checked={settings.eventCalendar} onChange={(v) => update("eventCalendar", v)} />
            <Toggle label="Exclude holidays from baselines" desc="Treat public holidays as special days in models." checked={settings.excludeHolidays} onChange={(v) => update("excludeHolidays", v)} />
          </div>
        </Card>

        {/* Model settings */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900">Model settings</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="set-horizon" className="mb-1 block text-sm font-medium text-slate-700">Default forecast horizon</label>
              <select
                id="set-horizon"
                value={settings.horizon}
                onChange={(e) => update("horizon", e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none"
              >
                {HORIZONS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="set-threshold" className="mb-1 block text-sm font-medium text-slate-700">Overcrowding threshold (%)</label>
              <input
                id="set-threshold"
                type="number"
                value={settings.threshold}
                min={70}
                max={130}
                onChange={(e) => update("threshold", Number(e.target.value))}
                className="h-10 w-full rounded-xl border border-slate-300 px-3.5 text-sm tabular-nums focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        {justSaved && (
          <p role="status" className="mr-auto text-sm font-medium text-emerald-600">
            Settings saved successfully.
          </p>
        )}
        <Button variant="secondary" onClick={handleDiscard}>Discard</Button>
        <Button onClick={handleSave} disabled={!dirty}>Save changes</Button>
      </div>
    </div>
  );
}
