import { useState, useEffect, useCallback } from "react";
import { hyderabadZones, ZoneData } from "@/data/hyderabadZones";
import {
  fetchAQIData,
  fetchFloodData,
  fetchHeatwaveData,
  getMockAQIData,
  getMockFloodData,
  getMockHeatwaveData,
  AQIResponse,
  FloodResponse,
  HeatwaveResponse,
} from "@/services/api";

export type DataType = "aqi" | "flood" | "heatwave";

interface UseZoneDataReturn {
  zones: ZoneData[];
  aqiData: Record<string, AQIResponse>;
  floodData: Record<string, FloodResponse>;
  heatwaveData: Record<string, HeatwaveResponse>;
  selectedZone: ZoneData | null;
  setSelectedZone: (zone: ZoneData | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshData: (type: DataType) => Promise<void>;
  useMockData: boolean;
  setUseMockData: (useMock: boolean) => void;
}

export function useZoneData(): UseZoneDataReturn {
  const [zones] = useState<ZoneData[]>(hyderabadZones);
  const [aqiData, setAqiData] = useState<Record<string, AQIResponse>>({});
  const [floodData, setFloodData] = useState<Record<string, FloodResponse>>({});
  const [heatwaveData, setHeatwaveData] = useState<Record<string, HeatwaveResponse>>({});
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true); // Default to mock for dev

  const refreshData = useCallback(
    async (type: DataType) => {
      setIsLoading(true);
      setError(null);

      try {
        const results: Record<string, any> = {};

        for (const zone of zones) {
          let data;
          if (useMockData) {
            // Use mock data
            data =
              type === "aqi"
                ? getMockAQIData(zone)
                : type === "flood"
                ? getMockFloodData(zone)
                : getMockHeatwaveData(zone);
          } else {
            // Fetch from backend
            data =
              type === "aqi"
                ? await fetchAQIData(zone)
                : type === "flood"
                ? await fetchFloodData(zone)
                : await fetchHeatwaveData(zone);
          }

          if (data) {
            results[zone.id] = data;
          }
        }

        if (type === "aqi") setAqiData(results);
        else if (type === "flood") setFloodData(results);
        else setHeatwaveData(results);
      } catch (err) {
        setError(`Failed to fetch ${type} data`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [zones, useMockData]
  );

  // Initial load
  useEffect(() => {
    refreshData("aqi");
    refreshData("flood");
    refreshData("heatwave");
  }, [refreshData]);

  return {
    zones,
    aqiData,
    floodData,
    heatwaveData,
    selectedZone,
    setSelectedZone,
    isLoading,
    error,
    refreshData,
    useMockData,
    setUseMockData,
  };
}
