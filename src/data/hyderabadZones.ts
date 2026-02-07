// 9 Hyderabad zones - 8 equidistant points + Charminar center
export interface ZoneData {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  direction: string;
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
    name: "Medchal",
    area: "Medchal, Telangana, India",
    direction: "North",
    lat: 17.5649,
    lng: 78.4867,
  },
  {
    id: "zone-2",
    name: "Ghatkesar",
    area: "Ghatkesar, Telangana, India",
    direction: "North-East",
    lat: 17.5118,
    lng: 78.6221,
  },
  {
    id: "zone-3",
    name: "Uppal",
    area: "Uppal, Hyderabad, Telangana, India",
    direction: "East",
    lat: 17.385,
    lng: 78.6767,
  },
  {
    id: "zone-4",
    name: "Ibrahimpatnam",
    area: "Ibrahimpatnam, Telangana, India",
    direction: "South-East",
    lat: 17.2582,
    lng: 78.6221,
  },
  {
    id: "zone-5",
    name: "Shamshabad",
    area: "Shamshabad, Hyderabad, Telangana, India",
    direction: "South",
    lat: 17.2051,
    lng: 78.4867,
  },
  {
    id: "zone-6",
    name: "Shankarpally",
    area: "Shankarpally, Telangana, India",
    direction: "South-West",
    lat: 17.2582,
    lng: 78.3512,
  },
  {
    id: "zone-7",
    name: "Patancheru",
    area: "Patancheru, Hyderabad, Telangana, India",
    direction: "West",
    lat: 17.385,
    lng: 78.2967,
  },
  {
    id: "zone-8",
    name: "Kompally",
    area: "Kompally, Hyderabad, Telangana, India",
    direction: "North-West",
    lat: 17.5118,
    lng: 78.3512,
  },
  {
    id: "zone-9",
    name: "Hyderabad Center",
    area: "Hyderabad, Telangana, India",
    direction: "Center",
    lat: 17.385044,
    lng: 78.486671,
  },
];

// Telangana map bounds - State-wide coverage
export const HYDERABAD_BOUNDS = {
  north: 19.95,
  south: 15.75,
  east: 81.45,
  west: 77.2,
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

// Get heatmap color based on AQI value
export function getAQIHeatmapColor(aqi: number): string {
  if (aqi <= 50) return "#22c55e"; // Green
  if (aqi <= 100) return "#eab308"; // Yellow
  if (aqi <= 150) return "#f97316"; // Orange
  if (aqi <= 200) return "#ef4444"; // Red
  if (aqi <= 300) return "#7c3aed"; // Purple
  return "#831843"; // Maroon
}

export function getFloodHeatmapColor(risk: number): string {
  if (risk <= 20) return "#22c55e";
  if (risk <= 40) return "#eab308";
  if (risk <= 60) return "#f97316";
  if (risk <= 80) return "#ef4444";
  return "#831843";
}

export function getHeatwaveHeatmapColor(temp: number): string {
  if (temp <= 27) return "#22c55e";
  if (temp <= 32) return "#eab308";
  if (temp <= 39) return "#f97316";
  if (temp <= 45) return "#ef4444";
  return "#831843";
}
