import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, ZoomIn, ZoomOut, Layers, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix for default markers not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface AQIPoint {
  lat: number;
  lng: number;
  aqi: number;
  city: string;
}

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  aqiPoints: AQIPoint[];
  onLocationSelect?: (city: string) => void;
}

// Custom marker icon based on AQI
function createAQIIcon(aqi: number): L.DivIcon {
  const getColor = (aqi: number) => {
    if (aqi <= 50) return "#22c55e";
    if (aqi <= 100) return "#eab308";
    if (aqi <= 200) return "#f97316";
    if (aqi <= 300) return "#ef4444";
    return "#7c3aed";
  };

  return L.divIcon({
    className: "custom-aqi-marker",
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 48px;
          height: 48px;
          background: ${getColor(aqi)}40;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          width: 36px;
          height: 36px;
          background: ${getColor(aqi)}60;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 0.5s;
        "></div>
        <div style="
          position: relative;
          width: 28px;
          height: 28px;
          background: ${getColor(aqi)};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
          box-shadow: 0 2px 8px ${getColor(aqi)}80;
          border: 2px solid white;
        ">${aqi}</div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -20],
  });
}

// Heatmap layer component
function HeatmapLayer({ points }: { points: AQIPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    let heat: L.Layer | null = null;

    // Dynamically import leaflet.heat
    import("leaflet.heat").then(() => {
      // Convert AQI points to heat data [lat, lng, intensity]
      const heatData: [number, number, number][] = points.map((point) => {
        // Normalize AQI to 0-1 intensity (higher AQI = higher intensity)
        const intensity = Math.min(point.aqi / 300, 1);
        return [point.lat, point.lng, intensity];
      });

      // Create heatmap layer
      heat = (L as any).heatLayer(heatData, {
        radius: 50,
        blur: 30,
        maxZoom: 10,
        max: 1.0,
        gradient: {
          0.0: "#22c55e",
          0.25: "#84cc16",
          0.5: "#eab308",
          0.75: "#f97316",
          1.0: "#ef4444",
        },
      });

      heat.addTo(map);
    });

    return () => {
      if (heat) {
        map.removeLayer(heat);
      }
    };
  }, [map, points]);

  return null;
}

// Map controls component
function MapControls({ onLocate }: { onLocate: () => void }) {
  const map = useMap();

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="bg-card/90 backdrop-blur-sm shadow-elevated hover:bg-card"
        onClick={() => map.setZoom(map.getZoom() + 1)}
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-card/90 backdrop-blur-sm shadow-elevated hover:bg-card"
        onClick={() => map.setZoom(map.getZoom() - 1)}
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-card/90 backdrop-blur-sm shadow-elevated hover:bg-card"
        onClick={onLocate}
      >
        <Locate className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Center map on props change
function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [map, center]);
  
  return null;
}

export function LeafletMap({ center, zoom = 10, aqiPoints, onLocationSelect }: LeafletMapProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const mapRef = useRef<L.Map>(null);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapRef.current?.setView(
            [position.coords.latitude, position.coords.longitude],
            12
          );
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        ref={mapRef}
        className="w-full h-full"
        zoomControl={false}
        style={{ background: "hsl(var(--background))" }}
      >
        {/* Map Tiles - OpenStreetMap (free, no API key) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Heatmap Layer */}
        {showHeatmap && <HeatmapLayer points={aqiPoints} />}

        {/* AQI Markers */}
        {aqiPoints.map((point, index) => (
          <Marker
            key={`${point.city}-${index}`}
            position={[point.lat, point.lng]}
            icon={createAQIIcon(point.aqi)}
            eventHandlers={{
              click: () => onLocationSelect?.(point.city),
            }}
          >
            <Popup className="aqi-popup">
              <div className="p-2 min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{point.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">AQI</span>
                  <span
                    className="font-bold text-lg"
                    style={{
                      color:
                        point.aqi <= 50
                          ? "#22c55e"
                          : point.aqi <= 100
                          ? "#eab308"
                          : point.aqi <= 200
                          ? "#f97316"
                          : "#ef4444",
                    }}
                  >
                    {point.aqi}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Controls */}
        <MapControls onLocate={handleLocate} />
        <MapCenterUpdater center={center} />
      </MapContainer>

      {/* Heatmap Toggle */}
      <div className="absolute left-4 top-4 z-[1000]">
        <Button
          variant={showHeatmap ? "default" : "secondary"}
          size="sm"
          className="bg-card/90 backdrop-blur-sm shadow-elevated gap-2"
          onClick={() => setShowHeatmap(!showHeatmap)}
        >
          <Layers className="w-4 h-4" />
          <span className="text-xs">Heatmap</span>
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute left-4 bottom-4 z-[1000] glass-card rounded-xl p-3">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">AQI Legend</h4>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-aqi-good" />
            <span className="text-xs">Good (0-50)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-aqi-moderate" />
            <span className="text-xs">Moderate (51-100)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-aqi-poor" />
            <span className="text-xs">Poor (101-200)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-aqi-severe" />
            <span className="text-xs">Severe (201-300)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
