/**
 * Geographic data for the Hyderabad network map.
 * Coordinates are approximate stop locations for the sample network —
 * they are NOT surveyed TGSRTC stop locations and will be replaced by
 * backend-provided geodata.
 */

import type { Depot, StopDemand } from "@/lib/types";

export const HYDERABAD_CENTER: [number, number] = [17.4015, 78.467];

/** Named coordinate registry (approximate). */
export const COORDS: Record<string, [number, number]> = {
  secunderabad: [17.4399, 78.4983],
  "secunderabad-station": [17.434, 78.501],
  paradise: [17.4462, 78.5043],
  "rtc-x-roads": [17.436, 78.502],
  "tank-bund": [17.4165, 78.4872],
  nampally: [17.3888, 78.4757],
  assembly: [17.391, 78.474],
  mehdipatnam: [17.397, 78.44],
  kukatpally: [17.4849, 78.4138],
  koti: [17.379, 78.48],
  gachibowli: [17.4401, 78.3489],
  "lb-nagar": [17.3457, 78.5522],
  charminar: [17.3616, 78.4747],
  ameerpet: [17.4374, 78.4487],
  uppal: [17.4009, 78.5583],
  miyapur: [17.4967, 78.3578],
  dilsukhnagar: [17.3686, 78.5247],
  begumpet: [17.4448, 78.4665],
  kphb: [17.4933, 78.399],
  madhapur: [17.4483, 78.3915],
  falaknuma: [17.33, 78.47],
  afzalgunj: [17.372, 78.482],
  patancheru: [17.5186, 78.2818],
  "jntu-kukatpally": [17.4948, 78.3914],
  tarnaka: [17.4266, 78.5371],
  "habsiguda": [17.4045, 78.5484],
  "banjara-hills": [17.4126, 78.4392],
  "jubilee-hills": [17.4239, 78.4098],
  "jubilee-check-post": [17.433, 78.416],
  "somajiguda": [17.4261, 78.4528],
  "koti-market": [17.3772, 78.4794],
  "erragadda": [17.4442, 78.4387],
  "santosh-nagar": [17.3534, 78.4989],
  "is-sadan": [17.3409, 78.4837],

  // Central Hyderabad
  "musheerabad": [17.4266, 78.4919],
  "gandhi-nagar": [17.4189, 78.4863],
  "gymkhana": [17.4235, 78.484],
  "kavadiguda": [17.4297, 78.4795],
  "indira-park": [17.424, 78.493],
  "padmarao-nagar": [17.421, 78.496],
  "sitaphalmandi": [17.431, 78.51],
  "bagh-lingampally": [17.408, 78.496],
  "vidyanagar": [17.418, 78.523],
  "vst": [17.409, 78.5285],
  "osmania-university": [17.415, 78.517],
  "khairatabad": [17.413, 78.46],
  "lakdikapul": [17.402, 78.47],
  "erramanzil": [17.409, 78.455],
  "basheerbagh": [17.404, 78.479],
  "abids": [17.387, 78.474],
  "mj-market": [17.394, 78.471],
  "gudi-malkapur": [17.39, 78.462],
  "narayanguda": [17.39, 78.487],
  "chikkadpally": [17.398, 78.487],
  "ramkote": [17.389, 78.481],
  "sultan-bazar": [17.383, 78.478],
  "purnapul": [17.383, 78.468],
  "dhoolpet": [17.379, 78.462],

  // Old city
  "nayapul": [17.37, 78.481],
  "city-college": [17.371, 78.479],
  "darulshifa": [17.365, 78.482],
  "gulzar-houz": [17.3618, 78.4755],
  "saidabad": [17.359, 78.49],
  "yakutpura": [17.354, 78.498],
  "dabeerpura": [17.371, 78.501],
  "bandlaguda": [17.375, 78.435],
  "chaderghat": [17.377, 78.493],
  "malakpet": [17.373, 78.505],
  "chaitanyapuri": [17.366, 78.537],
  "kothapet": [17.364, 78.546],
  "nagole": [17.363, 78.571],
  "peerzadiguda": [17.404, 78.575],

  // West / IT corridor
  "punjagutta": [17.423, 78.449],
  "yousufguda": [17.432, 78.444],
  "sr-nagar": [17.442, 78.442],
  "srinagar-colony": [17.423, 78.431],
  "greenlands": [17.444, 78.462],
  "prakash-nagar": [17.441, 78.468],
  "kothaguda": [17.438, 78.379],
  "kavuri-hills": [17.443, 78.406],
  "kondapur": [17.462, 78.364],
  "botanical-garden": [17.472, 78.37],
  "chanda-nagar": [17.485, 78.335],
  "bhel": [17.503, 78.32],
  "ramachandra-puram": [17.5, 78.33],
  "beeramguda": [17.509, 78.312],
  "ameenpur": [17.517, 78.3],

  // North
  "bowenpally": [17.455, 78.47],
  "chintal": [17.47, 78.487],
  "fathenagar": [17.468, 78.448],
  "balanagar": [17.474, 78.447],
  "sanathnagar": [17.464, 78.445],
  "moosapet": [17.477, 78.434],
};

/** Depot fleet counts reconcile with the total across DEMO_BUSES (351). */
export const DEPOTS: Depot[] = [
  { id: "dep-1", name: "Secunderabad Depot", lat: 17.4364, lng: 78.5013, busCount: 96 },
  { id: "dep-2", name: "Mehdipatnam Depot", lat: 17.3942, lng: 78.4365, busCount: 74 },
  { id: "dep-3", name: "Miyapur Depot", lat: 17.4998, lng: 78.3542, busCount: 121 },
  { id: "dep-4", name: "Koti Depot", lat: 17.3759, lng: 78.4827, busCount: 60 },
];

/** Stop-level demand markers for map overlays — key interchanges across the network. */
export const STOP_DEMAND: StopDemand[] = [
  { stopId: "st-sec", name: "Secunderabad", lat: 17.4399, lng: 78.4983, crowd: "high" },
  { stopId: "st-par", name: "Paradise", lat: 17.4462, lng: 78.5043, crowd: "moderate" },
  { stopId: "st-nam", name: "Nampally", lat: 17.3888, lng: 78.4757, crowd: "critical" },
  { stopId: "st-meh", name: "Mehdipatnam", lat: 17.397, lng: 78.44, crowd: "high" },
  { stopId: "st-kot", name: "Koti", lat: 17.379, lng: 78.48, crowd: "critical" },
  { stopId: "st-cha", name: "Charminar", lat: 17.3616, lng: 78.4747, crowd: "high" },
  { stopId: "st-ame", name: "Ameerpet", lat: 17.4374, lng: 78.4487, crowd: "moderate" },
  { stopId: "st-gac", name: "Gachibowli", lat: 17.4401, lng: 78.3489, crowd: "high" },
  { stopId: "st-mad", name: "Madhapur", lat: 17.4483, lng: 78.3915, crowd: "moderate" },
  { stopId: "st-miy", name: "Miyapur", lat: 17.4967, lng: 78.3578, crowd: "low" },
  { stopId: "st-kuk", name: "Kukatpally", lat: 17.4849, lng: 78.4138, crowd: "high" },
  { stopId: "st-dil", name: "Dilsukhnagar", lat: 17.3686, lng: 78.5247, crowd: "moderate" },
  { stopId: "st-lbn", name: "LB Nagar", lat: 17.3457, lng: 78.5522, crowd: "low" },
  { stopId: "st-upp", name: "Uppal", lat: 17.4009, lng: 78.5583, crowd: "low" },
  { stopId: "st-pun", name: "Punjagutta", lat: 17.423, lng: 78.449, crowd: "high" },
  { stopId: "st-kon", name: "Kondapur", lat: 17.462, lng: 78.364, crowd: "moderate" },
  { stopId: "st-kotg", name: "Kothaguda", lat: 17.438, lng: 78.379, crowd: "high" },
  { stopId: "st-srn", name: "S.R. Nagar", lat: 17.442, lng: 78.442, crowd: "moderate" },
  { stopId: "st-moo", name: "Moosapet", lat: 17.477, lng: 78.434, crowd: "moderate" },
  { stopId: "st-mal", name: "Malakpet", lat: 17.373, lng: 78.505, crowd: "high" },
  { stopId: "st-nay", name: "Nayapul", lat: 17.37, lng: 78.481, crowd: "moderate" },
  { stopId: "st-bow", name: "Bowenpally", lat: 17.455, lng: 78.47, crowd: "moderate" },
  { stopId: "st-bal", name: "Balanagar", lat: 17.474, lng: 78.447, crowd: "low" },
  { stopId: "st-cnd", name: "Chandanagar", lat: 17.485, lng: 78.335, crowd: "low" },
  { stopId: "st-amn", name: "Ameenpur", lat: 17.517, lng: 78.3, crowd: "low" },
  { stopId: "st-cty", name: "Chaitanyapuri", lat: 17.366, lng: 78.537, crowd: "moderate" },
];
