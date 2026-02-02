import { Sun, Thermometer, Droplets, Wind, Umbrella, Eye } from "lucide-react";
import { HeatwaveResponse } from "@/services/api";
import { getHeatwaveLevel } from "@/data/hyderabadZones";
import { PredictionChart } from "@/components/dashboard/PredictionChart";

interface HeatwaveSectionProps {
  data: HeatwaveResponse | null;
  zoneName: string;
}

export function HeatwaveSection({ data, zoneName }: HeatwaveSectionProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Select a zone to view heatwave data
      </div>
    );
  }

  const heatLevel = getHeatwaveLevel(data.heatIndex);

  // Generate 12-hour prediction data
  const getPredictionData = () => {
    const predictions = [];
    const baseTemp = data.temperature;
    for (let i = 0; i < 12; i++) {
      const variance = Math.sin(i / 3) * 3 + (Math.random() - 0.5) * 2;
      predictions.push({
        time: `${i}:00`,
        value: Math.round((baseTemp + variance) * 10) / 10,
      });
    }
    return predictions;
  };

  const tempPredictions = getPredictionData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <h2 className="text-xl font-bold mt-2">{zoneName} Weather Conditions</h2>
          <p className="text-sm text-muted-foreground">
            Current temperature and heatwave monitoring
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last Updated: {data.lastUpdated} (Local Time)
          </p>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-card/80 to-card/40">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Temperature */}
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Current Temperature
            </p>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-7xl font-bold text-foreground">
                {data.temperature}
              </span>
              <span className="text-3xl text-muted-foreground">°C</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-muted-foreground">
                Feels Like <span className="text-foreground font-medium">{data.temperature + 1}°C</span>
              </span>
              <span className="text-sm text-muted-foreground">
                Humidity <span className="text-foreground font-medium">{data.humidity}%</span>
              </span>
            </div>
            <div className="mt-4">
              <span
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${heatLevel.color}20`,
                  color: heatLevel.color,
                }}
              >
                {heatLevel.label}
              </span>
            </div>
          </div>

          {/* Heat Index */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Heat Index</p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-5xl font-bold"
                style={{ color: heatLevel.color }}
              >
                {data.heatIndex}
              </span>
              <span className="text-xl text-muted-foreground">°C</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Heat index is: {heatLevel.label.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <WeatherCard
          icon={<Wind className="w-6 h-6" />}
          label="Wind Speed"
          value={`${data.windSpeed}`}
          unit="km/h"
          badge={data.windSpeed < 10 ? "Light breeze" : data.windSpeed < 20 ? "Moderate" : "Strong"}
        />
        <WeatherCard
          icon={<Droplets className="w-6 h-6" />}
          label="Humidity"
          value={`${data.humidity}`}
          unit="%"
        />
        <WeatherCard
          icon={<Sun className="w-6 h-6" />}
          label="UV Index"
          value={`${data.uvIndex}`}
          unit=""
          badge={data.uvIndex < 3 ? "Low" : data.uvIndex < 6 ? "Moderate" : data.uvIndex < 8 ? "High" : "Very High"}
          badgeColor={data.uvIndex < 3 ? "green" : data.uvIndex < 6 ? "yellow" : "red"}
        />
        <WeatherCard
          icon={<Eye className="w-6 h-6" />}
          label="Visibility"
          value="4"
          unit="km"
        />
      </div>

      {/* UV Scale */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">UV Index</span>
          <span className="text-xs text-muted-foreground">
            Current level: {data.uvIndex}
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex">
          <div className="flex-[3] bg-green-500" />
          <div className="flex-[3] bg-yellow-500" />
          <div className="flex-[2] bg-orange-500" />
          <div className="flex-[2] bg-red-500" />
          <div className="flex-[1] bg-purple-600" />
        </div>
        <div className="flex text-xs text-muted-foreground mt-1">
          <span className="flex-[3]">Low</span>
          <span className="flex-[3] text-center">Moderate</span>
          <span className="flex-[2] text-center">High</span>
          <span className="flex-[2] text-center">Very High</span>
          <span className="flex-[1] text-right">Extreme</span>
        </div>
      </div>

      {/* Suggestions */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Suggestions for {zoneName}</h3>
          <span className="text-sm text-muted-foreground">Today</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SuggestionItem
            icon={<Umbrella className="w-8 h-8" />}
            label="Umbrella"
            status={data.humidity > 70 ? "Required" : "Optional"}
          />
          <SuggestionItem
            icon={<span className="text-2xl">👕</span>}
            label="Clothing"
            status="Light wear"
          />
          <SuggestionItem
            icon={<span className="text-2xl">🚗</span>}
            label="Driving"
            status="Safe"
          />
          <SuggestionItem
            icon={<Sun className="w-8 h-8" />}
            label="Sunscreen"
            status={data.uvIndex > 5 ? "Apply" : "Optional"}
          />
        </div>
      </div>

      {/* 12-Hour Temperature Prediction */}
      <PredictionChart
        title="Temperature Prediction (Next 12 Hours)"
        data={tempPredictions}
        color={heatLevel.color}
        unit="°C"
      />
    </div>
  );
}

interface WeatherCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  badge?: string;
  badgeColor?: "green" | "yellow" | "red";
}

function WeatherCard({ icon, label, value, unit, badge, badgeColor = "green" }: WeatherCardProps) {
  const badgeColors = {
    green: "bg-green-500/20 text-green-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    red: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">{icon}</div>
      </div>
      <p className="text-sm text-muted-foreground mt-3">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      {badge && (
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${badgeColors[badgeColor]}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

interface SuggestionItemProps {
  icon: React.ReactNode;
  label: string;
  status: string;
}

function SuggestionItem({ icon, label, status }: SuggestionItemProps) {
  return (
    <div className="flex flex-col items-center text-center p-3">
      <div className="text-muted-foreground mb-2">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-primary mt-1">• {status}</p>
    </div>
  );
}
