# Route Mind

**AI-Powered Public Transport Intelligence — Hyderabad, Telangana, India**

Route Mind analyzes public transport demand and helps operators understand passenger demand, bus
crowding, route utilization, peak hours, weather/rainfall impact, festivals, holidays, local
events — and turns that into demand forecasts, overcrowding predictions and bus allocation
recommendations.

This repository contains the **complete frontend**: a public website plus an operator dashboard,
built to connect to a future FastAPI + PostgreSQL backend with ML forecasting and an optimization
engine. **No backend is implemented here** — the app currently runs on a clearly separated demo
data layer.

> **Data note:** every statistic in the UI is demo data from a bundled sample network. Nothing on
> this site represents real TGSRTC measurements. Demo values are labeled in the UI and isolated in
> `data/`.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19 + Tailwind CSS v4 |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet (OpenStreetMap tiles) |
| Backend (planned) | FastAPI, PostgreSQL, ML models |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production build:

```bash
npm run build
npm start
```

### Connecting the backend

Set the API base URL and every service in `services/index.ts` automatically switches from demo
data to live endpoints:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Architecture

```
app/                  Routes (App Router)
  (public)/           Public website (navbar + footer layout)
    page.tsx          Home — hero, network overview, how it works, features,
                      crowd/weather/event/allocation previews, what-if, map, CTA
    routes/           Route browser + /routes/[id] detail page (SSG)
    buses/            Fleet table with filters
    schedules/        Demo timetables per route
    crowd/            Crowd forecast explorer (route/date/time filters)
    alerts/           Service alerts by severity
    map/              Full interactive map with layer toggles
    about/            Project overview
    login/            Operator login UI (auth intentionally not implemented)
  dashboard/          Operator control center (sidebar shell)
    page.tsx          Overview — KPIs, demand chart, alerts, weather/events impact,
                      allocation preview, network map
    analytics/        Daily/Weekly/Monthly/Route/Bus tabs
    passengers/       Boardings, alightings, demand charts
    routes/           Route analytics table + utilization bars
    buses/            Bus analytics table
    peak-hours/       Demand-by-hour + intensity matrix
    weather/          Current conditions + per-route weather impact
    events/           Event calendar + "Create Event Scenario" modal (UI)
    forecasting/      Demand forecast with confidence bands
    crowd-prediction/ Utilization trajectory + overcrowding ETA
    alerts/           Operator alert console (acknowledge = demo interaction)
    bus-allocation/   Current vs recommended allocation + rationale panel
    network/          Interactive map + per-route drill-down
    revenue/          Revenue charts + KPIs
    cost/             Cost structure + current vs recommended plan
    simulation/       What-If scenario runner (demo approximation)
    reports/          Report cards — buttons ready, generation is backend work
    settings/         Profile / notifications / preferences / model settings (UI)
components/
  ui/                 Badge, Card, ChartCard, KpiCard, DataTable, Filters, Modal,
                      Logo, Section/LinkButton/Button, Loading/Empty/Error states
  layout/             PublicNavbar, PublicFooter, DashboardShell (responsive sidebar)
  charts/             Recharts wrappers (area, bar, forecast band, crowd timeline, UtilBar)
  map/                TransportMap (Leaflet) + MapPanel (dynamic, client-only)
  home/               Hero animation + home sections
data/                 DEMO data layer (routes, network geo, intelligence, schedules)
services/             API abstraction — request() falls back to demo until backend exists
hooks/                useApiData — loading / error / empty / success states
lib/                  Shared types, formatters, nav config
```

### Data flow rule

Components never hard-code business data. They call domain services
(`routesService.list()`, `crowdService.forecast()`…) through `useApiData`, which renders
loading / error / empty states. In demo mode services return bundled data with
`source: "demo"` (UI shows a **Demo data** badge); with `NEXT_PUBLIC_API_BASE_URL` set, the
same calls hit the FastAPI backend.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint

## Status

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for what is complete, in progress, and planned.
