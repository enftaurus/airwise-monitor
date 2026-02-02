// 7 Hyderabad zones with coordinates
export interface ZoneData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi?: number;
  floodRisk?: number;
  heatIndex?: number;
  pm25?: number;
  pm10?: number;
  tvoc?: number;
  noise?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  uvIndex?: number;
  lastUpdated?: string;
}

export const hyderabadZones: ZoneData[] = [
  {
    id: "zone-1",
    name: "Secunderabad",
    lat: 17.4399,
    lng: 78.4983,
  },
  {
    id: "zone-2",
    name: "Begumpet",
    lat: 17.4432,
    lng: 78.4677,
  },
  {
    id: "zone-3",
    name: "Banjara Hills",
    lat: 17.4156,
    lng: 78.4347,
  },
  {
    id: "zone-4",
    name: "Hitech City",
    lat: 17.4435,
    lng: 78.3772,
  },
  {
    id: "zone-5",
    name: "Charminar",
    lat: 17.3616,
    lng: 78.4747,
  },
  {
    id: "zone-6",
    name: "Gachibowli",
    lat: 17.4401,
    lng: 78.3489,
  },
  {
    id: "zone-7",
    name: "LB Nagar",
    lat: 17.3457,
    lng: 78.5522,
  },
];

// Hyderabad map bounds
export const HYDERABAD_BOUNDS = {
  north: 17.55,
  south: 17.25,
  east: 78.65,
  west: 78.25,
};

export const HYDERABAD_CENTER: [number, number] = [17.385, 78.4867];

export function getAQICategory(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "hsl(var(--aqi-good))" };
  if (aqi <= 100) return { label: "Moderate", color: "hsl(var(--aqi-moderate))" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "hsl(var(--aqi-poor))" };
  if (aqi <= 200) return { label: "Unhealthy", color: "hsl(var(--aqi-severe))" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#7c3aed" };
  return { label: "Hazardous", color: "#831843" };
}

export function getFloodRiskLevel(risk: number): { label: string; color: string } {
  if (risk <= 20) return { label: "Low", color: "hsl(var(--aqi-good))" };
  if (risk <= 40) return { label: "Moderate", color: "hsl(var(--aqi-moderate))" };
  if (risk <= 60) return { label: "High", color: "hsl(var(--aqi-poor))" };
  if (risk <= 80) return { label: "Very High", color: "hsl(var(--aqi-severe))" };
  return { label: "Extreme", color: "#831843" };
}

export function getHeatwaveLevel(index: number): { label: string; color: string } {
  if (index <= 27) return { label: "Normal", color: "hsl(var(--aqi-good))" };
  if (index <= 32) return { label: "Caution", color: "hsl(var(--aqi-moderate))" };
  if (index <= 39) return { label: "Extreme Caution", color: "hsl(var(--aqi-poor))" };
  if (index <= 51) return { label: "Danger", color: "hsl(var(--aqi-severe))" };
  return { label: "Extreme Danger", color: "#831843" };
}
