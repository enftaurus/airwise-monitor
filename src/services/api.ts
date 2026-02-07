import axios from "axios";
import { ZoneData } from "@/data/hyderabadZones";

const API_BASE_URL = "http://localhost:8000";

export interface ZoneRequest {
  zone_id: string;
  lat: number;
  lng: number;
  type: "aqi" | "flood" | "heatwave";
}

export interface AQIResponse {
  zone_id: string;
  aqi: number;
  pm25: number;
  pm10: number;
  dust?: number;
  o3?: number;
  tvoc: number;
  noise: number;
  lastUpdated: string;
}

export interface FloodResponse {
  zone_id: string;
  floodRisk: number;
  waterLevel: number;
  rainfall: number;
  lastUpdated: string;
}

export interface HeatwaveResponse {
  zone_id: string;
  heatIndex: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  lastUpdated: string;
}

// Fetch AQI data for a zone
export async function fetchAQIData(zone: ZoneData): Promise<AQIResponse | null> {
  try {
    const response = await axios.post<AQIResponse>(`${API_BASE_URL}/aqi`, {
      zone_id: zone.id,
      lat: zone.lat,
      lng: zone.lng,
      type: "aqi",
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching AQI for ${zone.name}:`, error);
    return null;
  }
}

// Fetch flood data for a zone
export async function fetchFloodData(zone: ZoneData): Promise<FloodResponse | null> {
  try {
    const response = await axios.post<FloodResponse>(`${API_BASE_URL}/flood`, {
      zone_id: zone.id,
      lat: zone.lat,
      lng: zone.lng,
      type: "flood",
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching flood data for ${zone.name}:`, error);
    return null;
  }
}

// Fetch heatwave data for a zone
export async function fetchHeatwaveData(zone: ZoneData): Promise<HeatwaveResponse | null> {
  try {
    const response = await axios.post<HeatwaveResponse>(`${API_BASE_URL}/heatwave`, {
      zone_id: zone.id,
      lat: zone.lat,
      lng: zone.lng,
      type: "heatwave",
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching heatwave data for ${zone.name}:`, error);
    return null;
  }
}

// Fetch all data for all zones
export async function fetchAllZonesData(zones: ZoneData[], type: "aqi" | "flood" | "heatwave") {
  const fetchFn = type === "aqi" ? fetchAQIData : type === "flood" ? fetchFloodData : fetchHeatwaveData;
  const results = await Promise.all(zones.map((zone) => fetchFn(zone)));
  return results;
}

// Mock data for development (when backend is not available)
export function getMockAQIData(zone: ZoneData): AQIResponse {
  const baseAQI = 120 + Math.floor(Math.random() * 80);
  return {
    zone_id: zone.id,
    aqi: baseAQI,
    pm25: 70 + Math.floor(Math.random() * 40),
    pm10: 90 + Math.floor(Math.random() * 50),
    dust: 55 + Math.floor(Math.random() * 35),
    o3: 20 + Math.floor(Math.random() * 15),
    tvoc: 4 + Math.random() * 3,
    noise: 55 + Math.floor(Math.random() * 25),
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

export function getMockFloodData(zone: ZoneData): FloodResponse {
  return {
    zone_id: zone.id,
    floodRisk: Math.floor(Math.random() * 100),
    waterLevel: Math.random() * 5,
    rainfall: Math.floor(Math.random() * 200),
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

export function getMockHeatwaveData(zone: ZoneData): HeatwaveResponse {
  return {
    zone_id: zone.id,
    heatIndex: 25 + Math.floor(Math.random() * 20),
    temperature: 24 + Math.floor(Math.random() * 15),
    humidity: 40 + Math.floor(Math.random() * 40),
    windSpeed: 5 + Math.floor(Math.random() * 20),
    uvIndex: Math.floor(Math.random() * 11),
    lastUpdated: new Date().toLocaleTimeString(),
  };
}
