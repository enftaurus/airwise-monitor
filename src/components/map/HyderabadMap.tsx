import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, ZoomIn, ZoomOut, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ZoneData,
  HYDERABAD_BOUNDS,
  HYDERABAD_CENTER,
  getAQICategory,
  getFloodRiskLevel,
  getHeatwaveLevel,
  getAQIHeatmapColor,
  getFloodHeatmapColor,
  getHeatwaveHeatmapColor,
} from "@/data/hyderabadZones";
import { AQIResponse, FloodResponse, HeatwaveResponse } from "@/services/api";

// Fix for default markers not showing
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

type DataMode = "aqi" | "flood" | "heatwave";

interface HyderabadMapProps {
  zones: ZoneData[];
  aqiData: Record<string, AQIResponse>;
  floodData: Record<string, FloodResponse>;
  heatwaveData: Record<string, HeatwaveResponse>;
  mode: DataMode;
  selectedZone: ZoneData | null;
  onZoneSelect: (zone: ZoneData) => void;
}

// Custom marker icon based on data mode
function createZoneIcon(
  zone: ZoneData,
  mode: DataMode,
  data: AQIResponse | FloodResponse | HeatwaveResponse | undefined,
  isSelected: boolean
): L.DivIcon {
  let value = 0;
  let color = "#22c55e";

  if (mode === "aqi" && data && "aqi" in data) {
    value = data.aqi || 0;
    color = getAQICategory(value).color;
  } else if (mode === "flood" && data && "floodRisk" in data) {
    value = data.floodRisk || 0;
    color = getFloodRiskLevel(value).color;
  } else if (mode === "heatwave" && data && "heatIndex" in data) {
    value = data.heatIndex || 0;
    color = getHeatwaveLevel(value).color;
  }

  const size = isSelected ? 44 : 36;
  const pulseSize = isSelected ? 60 : 52;

  return L.divIcon({
    className: "custom-zone-marker",
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: ${pulseSize}px;
          height: ${pulseSize}px;
          background: ${color}40;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${isSelected ? 13 : 11}px;
          box-shadow: 0 4px 12px ${color}80;
          border: 3px solid white;
        ">${mode === "flood" ? value + "%" : value}</div>
      </div>
    `,
    iconSize: [pulseSize, pulseSize],
    iconAnchor: [pulseSize / 2, pulseSize / 2],
    popupAnchor: [0, -pulseSize / 2],
  });
}

// Get heatmap color and radius based on mode and value
function getHeatmapConfig(
  mode: DataMode,
  data: AQIResponse | FloodResponse | HeatwaveResponse | undefined
): { color: string; radius: number; opacity: number } {
  let value = 0;
  let color = "#22c55e";

  if (mode === "aqi" && data && "aqi" in data) {
    value = data.aqi || 0;
    color = getAQIHeatmapColor(value);
  } else if (mode === "flood" && data && "floodRisk" in data) {
    value = data.floodRisk || 0;
    color = getFloodHeatmapColor(value);
  } else if (mode === "heatwave" && data && "heatIndex" in data) {
    value = data.heatIndex || 0;
    color = getHeatwaveHeatmapColor(value);
  }

  // Higher values = larger radius and higher opacity
  const normalizedValue = mode === "aqi" ? value / 300 : mode === "flood" ? value / 100 : (value - 20) / 35;
  const radius = 4000 + normalizedValue * 4000; // 4km to 8km radius
  const opacity = 0.2 + normalizedValue * 0.3; // 0.2 to 0.5 opacity

  return { color, radius, opacity };
}

// Map controls component
function MapControls() {
  const map = useMap();

  const handleLocate = () => {
    map.setView(HYDERABAD_CENTER, 11);
  };

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card"
        onClick={() => map.setZoom(map.getZoom() + 1)}
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card"
        onClick={() => map.setZoom(map.getZoom() - 1)}
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card"
        onClick={handleLocate}
      >
        <Locate className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Restrict map bounds to Hyderabad
function MapBoundsEnforcer() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [HYDERABAD_BOUNDS.south, HYDERABAD_BOUNDS.west],
      [HYDERABAD_BOUNDS.north, HYDERABAD_BOUNDS.east]
    );
    map.setMaxBounds(bounds);
    map.setMinZoom(10);
    map.setMaxZoom(15);
  }, [map]);

  return null;
}

export function HyderabadMap({
  zones,
  aqiData,
  floodData,
  heatwaveData,
  mode,
  selectedZone,
  onZoneSelect,
}: HyderabadMapProps) {
  const mapRef = useRef<L.Map>(null);

  const getDataForZone = (zone: ZoneData) => {
    if (mode === "aqi") return aqiData[zone.id];
    if (mode === "flood") return floodData[zone.id];
    return heatwaveData[zone.id];
  };

  const getPopupContent = (
    zone: ZoneData,
    data: AQIResponse | FloodResponse | HeatwaveResponse | undefined
  ) => {
    if (mode === "aqi" && data && "aqi" in data) {
      const category = getAQICategory(data.aqi);
      return `
        <div class="min-w-[180px]">
          <div class="font-semibold text-base">${zone.name}</div>
          <div class="text-xs text-gray-400 mb-2">${zone.direction} • ${zone.area}</div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold" style="color: ${category.color}">${data.aqi}</span>
            <span class="text-xs px-2 py-1 rounded-full" style="background: ${category.color}20; color: ${category.color}">${category.label}</span>
          </div>
          <div class="text-xs mt-2">PM2.5: ${data.pm25} µg/m³ | PM10: ${data.pm10} µg/m³</div>
        </div>
      `;
    }
    if (mode === "flood" && data && "floodRisk" in data) {
      const level = getFloodRiskLevel(data.floodRisk);
      return `
        <div class="min-w-[180px]">
          <div class="font-semibold text-base">${zone.name}</div>
          <div class="text-xs text-gray-400 mb-2">${zone.direction} • Flood Monitoring</div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold" style="color: ${level.color}">${data.floodRisk}%</span>
            <span class="text-xs px-2 py-1 rounded-full" style="background: ${level.color}20; color: ${level.color}">${level.label}</span>
          </div>
          <div class="text-xs mt-2">Water Level: ${data.waterLevel.toFixed(1)}m</div>
        </div>
      `;
    }
    if (mode === "heatwave" && data && "heatIndex" in data) {
      const level = getHeatwaveLevel(data.heatIndex);
      return `
        <div class="min-w-[180px]">
          <div class="font-semibold text-base">${zone.name}</div>
          <div class="text-xs text-gray-400 mb-2">${zone.direction} • Weather Conditions</div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold" style="color: ${level.color}">${data.temperature}°C</span>
            <span class="text-xs px-2 py-1 rounded-full" style="background: ${level.color}20; color: ${level.color}">${level.label}</span>
          </div>
          <div class="text-xs mt-2">Humidity: ${data.humidity}% | Wind: ${data.windSpeed} km/h</div>
        </div>
      `;
    }
    return `<div class="font-semibold">${zone.name}</div><div class="text-xs text-gray-400">Loading...</div>`;
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden">
      <MapContainer
        center={HYDERABAD_CENTER}
        zoom={11}
        ref={mapRef}
        className="w-full h-full"
        zoomControl={false}
        style={{ background: "hsl(222, 47%, 11%)" }}
      >
        {/* Dark theme tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Restrict bounds to Hyderabad */}
        <MapBoundsEnforcer />

        {/* Heatmap Circles for each zone */}
        {zones.map((zone) => {
          const data = getDataForZone(zone);
          const config = getHeatmapConfig(mode, data);
          return (
            <Circle
              key={`heatmap-${zone.id}`}
              center={[zone.lat, zone.lng]}
              radius={config.radius}
              pathOptions={{
                color: config.color,
                fillColor: config.color,
                fillOpacity: config.opacity,
                weight: 0,
              }}
            />
          );
        })}

        {/* Zone Markers */}
        {zones.map((zone) => {
          const data = getDataForZone(zone);
          const isSelected = selectedZone?.id === zone.id;
          return (
            <Marker
              key={zone.id}
              position={[zone.lat, zone.lng]}
              icon={createZoneIcon(zone, mode, data, isSelected)}
              eventHandlers={{
                click: () => onZoneSelect(zone),
              }}
            >
              <Popup>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPopupContent(zone, data),
                  }}
                />
              </Popup>
            </Marker>
          );
        })}

        {/* Controls */}
        <MapControls />
      </MapContainer>

      {/* Map Title */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="glass-card rounded-xl px-4 py-2 bg-card/90 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {mode === "aqi" ? "AQI" : mode === "flood" ? "Flood Risk" : "Heat"} Map
            </span>
          </div>
        </div>
      </div>

      {/* Selected Zone Indicator */}
      {selectedZone && (
        <div className="absolute bottom-4 left-4 z-[1000]">
          <div className="glass-card rounded-xl px-4 py-2 bg-card/90 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{selectedZone.name}</span>
              <span className="text-xs text-muted-foreground">({selectedZone.direction})</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="glass-card rounded-xl px-3 py-2 bg-card/90 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground mb-1">
            {mode === "aqi" ? "AQI Level" : mode === "flood" ? "Flood Risk" : "Heat Index"}
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-3 rounded-sm bg-[#22c55e]" title="Good/Low" />
            <div className="w-4 h-3 rounded-sm bg-[#eab308]" title="Moderate" />
            <div className="w-4 h-3 rounded-sm bg-[#f97316]" title="Poor/High" />
            <div className="w-4 h-3 rounded-sm bg-[#ef4444]" title="Severe/Very High" />
            <div className="w-4 h-3 rounded-sm bg-[#831843]" title="Hazardous/Extreme" />
          </div>
        </div>
      </div>
    </div>
  );
}
