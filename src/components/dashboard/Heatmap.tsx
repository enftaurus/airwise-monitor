import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import { ZoneData } from "@/data/hyderabadZones";

interface HeatmapProps {
  data: Record<string, number>;
  zones: ZoneData[];
  mode: "aqi" | "flood" | "heatwave";
}

export function Heatmap({ data, zones, mode }: HeatmapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Convert zone data to heatmap coordinates
    const heatData = zones
      .filter((zone) => data[zone.id] !== undefined)
      .map((zone) => {
        let intensity = 0;
        const value = data[zone.id];

        if (mode === "aqi") {
          intensity = Math.min(value / 300, 1); // 0-300 AQI normalized to 0-1
        } else if (mode === "flood") {
          intensity = Math.min(value / 100, 1); // 0-100% normalized
        } else if (mode === "heatwave") {
          intensity = Math.min((value - 20) / 40, 1); // 20-60°C normalized
        }

        return [zone.lat, zone.lng, intensity] as [number, number, number];
      });

    // Remove existing heat layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current as unknown as L.Layer);
    }

    // Create new heat layer
    if (heatData.length > 0) {
      const leafletWithHeat = L as unknown as {
        heatLayer: (
          data: [number, number, number][],
          options: Record<string, unknown>
        ) => L.Layer;
      };
      heatLayerRef.current = leafletWithHeat.heatLayer(heatData, {
        radius: 40,
        blur: 25,
        maxZoom: 17,
        minOpacity: 0.3,
        gradient: {
          0.0: "#00ff00",
          0.25: "#ffff00",
          0.5: "#ff8800",
          0.75: "#ff0000",
          1.0: "#8b0000",
        },
      }).addTo(mapRef.current);
    }
  }, [data, zones, mode]);

  return null;
}
