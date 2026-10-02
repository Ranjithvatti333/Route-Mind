/**
 * Schedule data — synthetic timetables for the sample network.
 * Real schedules will come from the backend scheduling service.
 */

export interface ScheduleEntry {
  departure: string;
  arrival: string;
  busType: string;
  frequencyMin: number;
}

export interface RouteSchedule {
  routeId: string;
  firstBus: string;
  lastBus: string;
  headwayPeakMin: number;
  headwayOffPeakMin: number;
}

export const DEMO_SCHEDULE: RouteSchedule = {
  routeId: "R101",
  firstBus: "5:00 AM",
  lastBus: "10:00 PM",
  headwayPeakMin: 8,
  headwayOffPeakMin: 15,
};

const FIRST_DEPARTURE_MIN = 5 * 60; // 5:00 AM
const LAST_DEPARTURE_MIN = 22 * 60; // 10:00 PM
const PEAK_HOURS = [7, 8, 9, 17, 18, 19];
const BUS_TYPES = ["City Ordinary", "Metro Deluxe", "Express"];

function formatTime(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Build a full-day departures timetable for a route (5:00 AM – 10:00 PM).
 * Denser headways during morning and evening peaks; arrival = departure +
 * the route's own running time. Each route gets a deterministic offset so
 * timetables differ across the network.
 */
export function demoDepartures(routeId: string, travelTimeMin = 48): ScheduleEntry[] {
  const routeIndex = Number(routeId.slice(1)) - 101;
  const entries: ScheduleEntry[] = [];
  let minutes = FIRST_DEPARTURE_MIN + ((routeIndex * 7) % DEMO_SCHEDULE.headwayOffPeakMin);
  let seq = 0;
  while (minutes <= LAST_DEPARTURE_MIN) {
    const hour = Math.floor(minutes / 60);
    const headway = PEAK_HOURS.includes(hour)
      ? DEMO_SCHEDULE.headwayPeakMin
      : DEMO_SCHEDULE.headwayOffPeakMin;
    entries.push({
      departure: formatTime(minutes),
      arrival: formatTime(minutes + travelTimeMin),
      busType: BUS_TYPES[(seq + routeIndex) % BUS_TYPES.length],
      frequencyMin: headway,
    });
    minutes += headway;
    seq += 1;
  }
  return entries;
}
