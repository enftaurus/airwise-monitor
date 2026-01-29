import { MapPin, ZoomIn, ZoomOut, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapSectionProps {
  location: string;
  aqi: number;
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "bg-aqi-good";
  if (aqi <= 100) return "bg-aqi-moderate";
  if (aqi <= 200) return "bg-aqi-poor";
  if (aqi <= 300) return "bg-aqi-severe";
  return "bg-aqi-hazardous";
}

export function MapSection({ location, aqi }: MapSectionProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-aqi-good/5">
      {/* Map Background - Stylized placeholder */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-aqi-good/10" />
        
        {/* Heatmap-style circles */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-aqi-moderate/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-aqi-poor/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-aqi-good/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-aqi-severe/10 rounded-full blur-3xl" />
      </div>

      {/* Location Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          {/* Pulsing ring */}
          <div className={`absolute inset-0 w-20 h-20 -m-4 ${getAQIColor(aqi)} rounded-full opacity-30 animate-pulse-ring`} />
          <div className={`absolute inset-0 w-16 h-16 -m-2 ${getAQIColor(aqi)} rounded-full opacity-40 animate-pulse-ring`} style={{ animationDelay: '0.5s' }} />
          
          {/* Center marker */}
          <div className={`relative w-12 h-12 ${getAQIColor(aqi)} rounded-full flex items-center justify-center shadow-elevated`}>
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          
          {/* Location label */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap">
            <div className="glass-card px-3 py-1.5 rounded-lg text-sm font-medium">
              {location.split(',')[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="glass-card border-0 shadow-elevated">
          <Layers className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" className="glass-card border-0 shadow-elevated">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" className="glass-card border-0 shadow-elevated">
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute left-4 bottom-4 glass-card rounded-xl p-3">
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
