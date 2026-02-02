import { Droplets, CloudRain, Waves, AlertTriangle } from "lucide-react";
import { FloodResponse } from "@/services/api";
import { getFloodRiskLevel } from "@/data/hyderabadZones";

interface FloodSectionProps {
  data: FloodResponse | null;
  zoneName: string;
}

export function FloodSection({ data, zoneName }: FloodSectionProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Select a zone to view flood data
      </div>
    );
  }

  const riskLevel = getFloodRiskLevel(data.floodRisk);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <h2 className="text-xl font-bold mt-2">{zoneName} Flood Monitoring</h2>
          <p className="text-sm text-muted-foreground">
            Real-time flood risk and water level data
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last Updated: {data.lastUpdated} (Local Time)
          </p>
        </div>
      </div>

      {/* Main Flood Risk Display */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-card/80 to-card/40">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Flood Risk Index
            </p>
            <div className="flex items-baseline gap-4 mt-2">
              <span
                className="text-7xl font-bold"
                style={{ color: riskLevel.color }}
              >
                {data.floodRisk}%
              </span>
              <span
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${riskLevel.color}20`,
                  color: riskLevel.color,
                }}
              >
                {riskLevel.label}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="flex gap-6 ml-auto">
            <div>
              <p className="text-sm text-muted-foreground">Water Level</p>
              <p className="text-xl font-bold">
                {data.waterLevel.toFixed(1)} <span className="text-xs text-muted-foreground">m</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rainfall</p>
              <p className="text-xl font-bold">
                {data.rainfall} <span className="text-xs text-muted-foreground">mm</span>
              </p>
            </div>
          </div>
        </div>

        {/* Risk Scale */}
        <div className="mt-6">
          <div className="flex text-xs text-muted-foreground mb-1">
            <span className="flex-1">Low</span>
            <span className="flex-1 text-center">Moderate</span>
            <span className="flex-1 text-center">High</span>
            <span className="flex-1 text-center">Very High</span>
            <span className="flex-1 text-right">Extreme</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-aqi-good" />
            <div className="flex-1 bg-aqi-moderate" />
            <div className="flex-1 bg-aqi-poor" />
            <div className="flex-1 bg-aqi-severe" />
            <div className="flex-1 bg-pink-900" />
          </div>
          <div className="flex text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span className="flex-1 text-center">20%</span>
            <span className="flex-1 text-center">40%</span>
            <span className="flex-1 text-center">60%</span>
            <span className="flex-1 text-center">80%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FloodCard
          icon={<Waves className="w-6 h-6" />}
          label="Water Level"
          value={`${data.waterLevel.toFixed(1)} m`}
          description="Current water level in drainage systems"
          severity={data.waterLevel > 3 ? "high" : data.waterLevel > 1.5 ? "medium" : "low"}
        />
        <FloodCard
          icon={<CloudRain className="w-6 h-6" />}
          label="Rainfall"
          value={`${data.rainfall} mm`}
          description="Rainfall in the last 24 hours"
          severity={data.rainfall > 100 ? "high" : data.rainfall > 50 ? "medium" : "low"}
        />
        <FloodCard
          icon={<Droplets className="w-6 h-6" />}
          label="Drainage Capacity"
          value={`${Math.max(0, 100 - data.floodRisk)}%`}
          description="Available drainage capacity"
          severity={data.floodRisk > 60 ? "high" : data.floodRisk > 30 ? "medium" : "low"}
        />
      </div>

      {/* Advisory */}
      {data.floodRisk > 50 && (
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-yellow-500 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-500">Flood Advisory</h4>
              <p className="text-sm text-muted-foreground mt-1">
                High flood risk detected. Avoid low-lying areas and stay updated with local weather alerts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FloodCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  severity: "low" | "medium" | "high";
}

function FloodCard({ icon, label, value, description, severity }: FloodCardProps) {
  const borderColor =
    severity === "high"
      ? "border-l-red-500"
      : severity === "medium"
      ? "border-l-yellow-500"
      : "border-l-green-500";

  return (
    <div className={`glass-card rounded-xl p-5 border-l-4 ${borderColor}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
