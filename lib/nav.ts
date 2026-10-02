/** Navigation configuration shared by navbar, sidebar and footer. */

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/routes", label: "Routes" },
  { href: "/buses", label: "Buses" },
  { href: "/schedules", label: "Schedules" },
  { href: "/crowd", label: "Crowd Forecast" },
  { href: "/alerts", label: "Alerts" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "About" },
] as const;

export const DASHBOARD_NAV: { section: string; items: { href: string; label: string }[] }[] = [
  {
    section: "Operations",
    items: [
      { href: "/dashboard", label: "Overview" },
      { href: "/dashboard/analytics", label: "Analytics" },
      { href: "/dashboard/passengers", label: "Passengers" },
      { href: "/dashboard/routes", label: "Routes" },
      { href: "/dashboard/buses", label: "Buses" },
      { href: "/dashboard/peak-hours", label: "Peak Hours" },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { href: "/dashboard/weather", label: "Weather" },
      { href: "/dashboard/events", label: "Events" },
      { href: "/dashboard/forecasting", label: "Forecasting" },
      { href: "/dashboard/crowd-prediction", label: "Crowd Prediction" },
      { href: "/dashboard/alerts", label: "Alerts" },
    ],
  },
  {
    section: "Optimization",
    items: [
      { href: "/dashboard/bus-allocation", label: "Bus Allocation" },
      { href: "/dashboard/network", label: "Network" },
      { href: "/dashboard/simulation", label: "Simulation" },
    ],
  },
  {
    section: "Business",
    items: [
      { href: "/dashboard/revenue", label: "Revenue" },
      { href: "/dashboard/cost", label: "Cost" },
      { href: "/dashboard/reports", label: "Reports" },
      { href: "/dashboard/settings", label: "Settings" },
    ],
  },
];
