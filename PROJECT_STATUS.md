# PROJECT_STATUS — Route Mind Frontend

Last updated: 2026-09-30

## COMPLETED

### Foundation
- Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 scaffold
- Recharts, Leaflet, react-leaflet installed and configured
- Design system: brand/accent tokens, status colors, shadows, animations (globals.css `@theme`)
- Custom SVG logo component + favicon (`app/icon.svg`)
- Full TypeScript domain model (`lib/types.ts`) matching expected backend contracts

### Data architecture (backend-ready)
- `services/api.ts` — request abstraction; switches to FastAPI via `NEXT_PUBLIC_API_BASE_URL`
- Domain services for routes, buses, alerts, crowd, weather, events, allocation, analytics, forecasting, simulation
- `hooks/useApiData.ts` — generic loading / success / error / empty handling
- Demo data fully isolated in `data/` (routes, network geo, intelligence, schedules), labeled in UI with "Demo data" badges

### Public website (10 routes, all verified 200 + no console errors)
- `/` Home — animated hero network visual, network overview KPIs, how-it-works, 8 feature cards, crowd prediction preview, weather intelligence, event intelligence, allocation preview, interactive what-if teaser, Leaflet map section, final CTA
- `/routes` — search + crowd/status filters + route cards
- `/routes/[id]` — SSG detail for 10 routes: overview, map, stop timeline, schedule, crowd forecast chart, weather impact, event impact, alerts
- `/buses` — filterable fleet table
- `/schedules` — per-route demo timetable browser
- `/crowd` — route/date/time filters, crowd chart, level legend, snapshot panel
- `/alerts` — severity-grouped alert cards with reason + recommended action
- `/map` — full map with Routes/Stops/Events/Depots layer toggles
- `/about`, `/login` (auth UI only, no fake authentication)
- Global `not-found.tsx`, SEO metadata + Open Graph on all pages

### Operator dashboard (18 pages, all verified)
- Responsive shell: fixed desktop sidebar, mobile drawer, sticky header
- Overview, Analytics (5 tabs), Passengers, Routes, Buses, Peak Hours, Weather, Events, Forecasting, Crowd Prediction, Alerts, Bus Allocation, Network, Revenue, Cost, Simulation (working demo engine), Reports, Settings

### Quality
- `tsc --noEmit` clean, `next build` clean (41 static pages), ESLint clean
- Browser-verified: desktop (1440px) + mobile (390px), sidebar drawer, mobile nav, charts, Leaflet map, simulation interaction
- Accessibility: semantic HTML, aria labels, focus-visible styles, keyboard-dismissable modal/drawer
- README.md written

## IN PROGRESS
- Nothing — frontend phase complete and stable.

## NOT IMPLEMENTED (backend scope, intentionally out of this phase)
- FastAPI backend, PostgreSQL database, auth (login is UI-only; `/dashboard` open for preview)
- ML demand forecasting / crowd prediction models (UI consumes demo series)
- Bus allocation optimization engine ("Apply plan" disabled)
- Real What-If simulation engine (current one is a deterministic browser approximation)
- Report generation/download (buttons ready, disabled/no fake downloads)
- Live TGSRTC route/stop geodata, schedules, weather feed, event feed
- Settings/persistence, alert acknowledgment persistence, event scenario creation
- Backend tests, deployment/CI

## KNOWN ISSUES
- Demo utilization uses a fixed assumption of ~8 trips/bus/day (`routeUtilization` in `lib/format.ts`) — replace with backend metric
- Map coordinates are approximate placeholders for the demo network, not surveyed stops
- Schedules are generated from sample headways, not real timetables
- Bus allocation summary row sums per-route percentage changes (acceptable for demo, not statistically rigorous)
- Tailwind class `grid-cols-12` heatmap on Peak Hours wraps 18 hours into 2 rows on large screens (visual only)

## NEXT STEP
1. Stand up FastAPI service + PostgreSQL schema (routes, stops, buses, ridership, alerts, events, weather)
2. Implement auth (JWT/session) and wire `/login` → protect `/dashboard`
3. Replace demo fallbacks one service at a time (`services/index.ts` already routes through `request()`)
4. Port the demo simulation logic into a server-side endpoint, then swap `simulationService.run`
5. Connect real geodata + GTFS-style schedules to the map and timetable pages
