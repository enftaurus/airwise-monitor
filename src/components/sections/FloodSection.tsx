import { Droplets, CloudRain, Waves, AlertTriangle } from "lucide-react";
import { FloodResponse } from "@/services/api";
import { getFloodRiskLevel } from "@/data/hyderabadZones";
import { PredictionChart } from "@/components/dashboard/PredictionChart";

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

  // Generate 12-hour prediction data
  const getPredictionData = () => {
    const predictions = [];
    const baseRisk = data.floodRisk;
    for (let i = 0; i < 12; i++) {
      const variance = Math.sin(i / 2) * 8 + (Math.random() - 0.5) * 5;
      predictions.push({
        time: `${i}:00`,
        value: Math.max(0, Math.min(100, baseRisk + variance)),
      });
    }
    return predictions;
  };

  const floodPredictions = getPredictionData();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <h2 className="text-lg font-bold mt-2">{zoneName} Flood Monitoring</h2>
          <p className="text-xs text-muted-foreground">
            Real-time flood risk and water level data
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last Updated: {data.lastUpdated} (Local Time)
          </p>
        </div>
      </div>

      {/* Main Flood Risk Display */}
      <div className="glass-card rounded-xl p-4 bg-gradient-to-br from-card/80 to-card/40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Flood Risk Index
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <span
                className="text-5xl font-bold"
                style={{ color: riskLevel.color }}
              >
                {data.floodRisk}%
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
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
          <div className="flex gap-4 sm:ml-auto flex-wrap">
            <div className="min-w-[60px]">
              <p className="text-xs text-muted-foreground">Water Level</p>
              <p className="text-lg font-bold">
                {data.waterLevel.toFixed(1)}
                <span className="text-xs text-muted-foreground ml-1">m</span>
              </p>
            </div>
            <div className="min-w-[60px]">
              <p className="text-xs text-muted-foreground">Rainfall</p>
              <p className="text-lg font-bold">
                {data.rainfall}
                <span className="text-xs text-muted-foreground ml-1">mm</span>
              </p>
            </div>
          </div>
        </div>

        {/* Risk Scale */}
        <div className="mt-4">
          <div className="flex text-[10px] text-muted-foreground mb-1">
            <span className="flex-1">Low</span>
            <span className="flex-1 text-center">Moderate</span>
            <span className="flex-1 text-center">High</span>
            <span className="flex-1 text-center">Very High</span>
            <span className="flex-1 text-right">Extreme</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-aqi-good" />
            <div className="flex-1 bg-aqi-moderate" />
            <div className="flex-1 bg-aqi-poor" />
            <div className="flex-1 bg-aqi-severe" />
            <div className="flex-1 bg-pink-900" />
          </div>
          <div className="flex text-[10px] text-muted-foreground mt-1">
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
      <div className="grid grid-cols-1 gap-3">
        <FloodCard
          icon={<Waves className="w-5 h-5" />}
          label="Water Level"
          value={`${data.waterLevel.toFixed(1)} m`}
          description="Current water level in drainage systems"
          severity={data.waterLevel > 3 ? "high" : data.waterLevel > 1.5 ? "medium" : "low"}
        />
        <FloodCard
          icon={<CloudRain className="w-5 h-5" />}
          label="Rainfall"
          value={`${data.rainfall} mm`}
          description="Rainfall in the last 24 hours"
          severity={data.rainfall > 100 ? "high" : data.rainfall > 50 ? "medium" : "low"}
        />
        <FloodCard
          icon={<Droplets className="w-5 h-5" />}
          label="Drainage Capacity"
          value={`${Math.max(0, 100 - data.floodRisk)}%`}
          description="Available drainage capacity"
          severity={data.floodRisk > 60 ? "high" : data.floodRisk > 30 ? "medium" : "low"}
        />
      </div>

      {/* Advisory */}
      {data.floodRisk > 50 && (
        <div className="glass-card rounded-lg p-3 border-l-4 border-l-yellow-500 bg-yellow-500/5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-500 text-sm">Flood Advisory</h4>
              <p className="text-xs text-muted-foreground mt-1">
                High flood risk detected. Avoid low-lying areas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 12-Hour Flood Risk Prediction */}
      <PredictionChart
        title="Flood Risk Prediction (Next 12 Hours)"
        data={floodPredictions}
        color={riskLevel.color}
        unit="%"
      />
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
    <div className={`glass-card rounded-lg p-3 border-l-4 ${borderColor}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
