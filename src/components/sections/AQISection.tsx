import { Wind, Droplets, Volume2 } from "lucide-react";
import { AQIResponse } from "@/services/api";
import { getAQICategory } from "@/data/hyderabadZones";
import { PredictionChart } from "@/components/dashboard/PredictionChart";

interface AQISectionProps {
  data: AQIResponse | null;
  zoneName: string;
}

export function AQISection({ data, zoneName }: AQISectionProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Select a zone to view AQI data
      </div>
    );
  }

  const category = getAQICategory(data.aqi);

  // Generate 12-hour prediction data
  const getPredictionData = () => {
    const predictions = [];
    const baseAQI = data.aqi;
    for (let i = 0; i < 12; i++) {
      const variance = Math.sin(i / 3) * 15 + (Math.random() - 0.5) * 10;
      predictions.push({
        time: `${i}:00`,
        value: Math.max(0, Math.round(baseAQI + variance)),
      });
    }
    return predictions;
  };

  const aqiPredictions = getPredictionData();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <h2 className="text-lg font-bold mt-2">{zoneName} Air Quality Index</h2>
          <p className="text-xs text-muted-foreground">
            Real-time PM2.5, PM10 air pollution level
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last Updated: {data.lastUpdated} (Local Time)
          </p>
        </div>
      </div>

      {/* Main AQI Display */}
      <div className="glass-card rounded-xl p-4 bg-gradient-to-br from-card/80 to-card/40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Air Quality Index
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <span
                className="text-5xl font-bold"
                style={{ color: category.color }}
              >
                {data.aqi}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                {category.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AQI (US)</p>
          </div>

          {/* Pollutant Summary */}
          <div className="flex gap-4 sm:ml-auto flex-wrap">
            <div className="min-w-[60px]">
              <p className="text-xs text-muted-foreground">PM2.5</p>
              <p className="text-lg font-bold">
                {data.pm25}
                <span className="text-xs text-muted-foreground ml-1">µg/m³</span>
              </p>
            </div>
            <div className="min-w-[60px]">
              <p className="text-xs text-muted-foreground">PM10</p>
              <p className="text-lg font-bold">
                {data.pm10}
                <span className="text-xs text-muted-foreground ml-1">µg/m³</span>
              </p>
            </div>
          </div>
        </div>

        {/* AQI Scale */}
        <div className="mt-4">
          <div className="flex text-[10px] text-muted-foreground mb-1">
            <span className="flex-1">Good</span>
            <span className="flex-1 text-center">Moderate</span>
            <span className="flex-1 text-center">Poor</span>
            <span className="flex-1 text-center">Unhealthy</span>
            <span className="flex-1 text-center">Severe</span>
            <span className="flex-1 text-right">Hazard</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-aqi-good" />
            <div className="flex-1 bg-aqi-moderate" />
            <div className="flex-1 bg-aqi-poor" />
            <div className="flex-1 bg-aqi-severe" />
            <div className="flex-1 bg-purple-600" />
            <div className="flex-1 bg-pink-900" />
          </div>
          <div className="flex text-[10px] text-muted-foreground mt-1">
            <span>0</span>
            <span className="flex-1 text-center">50</span>
            <span className="flex-1 text-center">100</span>
            <span className="flex-1 text-center">150</span>
            <span className="flex-1 text-center">200</span>
            <span className="flex-1 text-center">300</span>
            <span>301+</span>
          </div>
        </div>
      </div>

      {/* Pollutant Cards */}
      <div className="grid grid-cols-2 gap-3">
        <PollutantCard
          icon={<Wind className="w-4 h-4" />}
          label="PM2.5"
          value={data.pm25}
          unit="µg/m³"
          severity={data.pm25 > 100 ? "high" : data.pm25 > 50 ? "medium" : "low"}
        />
        <PollutantCard
          icon={<Wind className="w-4 h-4" />}
          label="PM10"
          value={data.pm10}
          unit="µg/m³"
          severity={data.pm10 > 150 ? "high" : data.pm10 > 75 ? "medium" : "low"}
        />
        <PollutantCard
          icon={<Droplets className="w-4 h-4" />}
          label="TVOC"
          value={data.tvoc.toFixed(2)}
          unit="ppm"
          severity={data.tvoc > 5 ? "high" : data.tvoc > 2 ? "medium" : "low"}
        />
        <PollutantCard
          icon={<Volume2 className="w-4 h-4" />}
          label="Noise"
          value={data.noise}
          unit="dB"
          severity={data.noise > 70 ? "high" : data.noise > 50 ? "medium" : "low"}
        />
      </div>

      {/* 12-Hour AQI Prediction */}
      <PredictionChart
        title="AQI Prediction (Next 12 Hours)"
        data={aqiPredictions}
        color={category.color}
        unit="AQI"
      />
    </div>
  );
}

interface PollutantCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  unit: string;
  severity: "low" | "medium" | "high";
}

function PollutantCard({ icon, label, value, unit, severity }: PollutantCardProps) {
  const borderColor =
    severity === "high"
      ? "border-l-red-500"
      : severity === "medium"
      ? "border-l-yellow-500"
      : "border-l-green-500";

  return (
    <div className={`glass-card rounded-lg p-3 border-l-4 ${borderColor}`}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-muted/50 text-muted-foreground flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold leading-tight">{value}</p>
          <p className="text-[10px] text-muted-foreground">{unit}</p>
        </div>
      </div>
    </div>
  );
}
