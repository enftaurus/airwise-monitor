import { Clock, AlertCircle } from "lucide-react";

interface PollutantData {
  name: string;
  value: number;
  max: number;
  unit: string;
}

interface AQICardProps {
  aqi: number;
  category: string;
  pollutants: PollutantData[];
  lastUpdated: string;
  isWarning?: boolean;
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "bg-aqi-good";
  if (aqi <= 100) return "bg-aqi-moderate";
  if (aqi <= 200) return "bg-aqi-poor";
  if (aqi <= 300) return "bg-aqi-severe";
  return "bg-aqi-hazardous";
}

function getAQITextColor(aqi: number): string {
  if (aqi <= 50) return "text-aqi-good";
  if (aqi <= 100) return "text-aqi-moderate";
  if (aqi <= 200) return "text-aqi-poor";
  if (aqi <= 300) return "text-aqi-severe";
  return "text-aqi-hazardous";
}

function getAQIBgGradient(aqi: number): string {
  if (aqi <= 50) return "from-aqi-good/10 to-aqi-good/5";
  if (aqi <= 100) return "from-aqi-moderate/10 to-aqi-moderate/5";
  if (aqi <= 200) return "from-aqi-poor/10 to-aqi-poor/5";
  if (aqi <= 300) return "from-aqi-severe/10 to-aqi-severe/5";
  return "from-aqi-hazardous/10 to-aqi-hazardous/5";
}

export function AQICard({ aqi, category, pollutants, lastUpdated, isWarning }: AQICardProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${getAQIBgGradient(aqi)}`}>
      {/* Warning Badge */}
      {isWarning && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-aqi-severe/10 rounded-lg border border-aqi-severe/20">
          <AlertCircle className="w-4 h-4 text-aqi-severe" />
          <span className="text-sm font-medium text-aqi-severe">Air Quality Alert</span>
        </div>
      )}

      {/* AQI Number */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className={`absolute inset-0 ${getAQIColor(aqi)} rounded-full opacity-20 animate-pulse-ring`} style={{ transform: 'scale(1.2)' }} />
          <div className={`relative w-32 h-32 rounded-full ${getAQIColor(aqi)}/10 border-4 ${getAQIColor(aqi).replace('bg-', 'border-')} flex items-center justify-center`}>
            <span className={`text-5xl font-bold ${getAQITextColor(aqi)}`}>{aqi}</span>
          </div>
        </div>
        <div className={`mt-4 text-lg font-semibold ${getAQITextColor(aqi)}`}>
          {category}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Air Quality Index</p>
      </div>

      {/* Pollutant Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pollutants</h4>
        {pollutants.map((pollutant) => (
          <div key={pollutant.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{pollutant.name}</span>
              <span className="text-muted-foreground">{pollutant.value} {pollutant.unit}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${getAQIColor(Math.round((pollutant.value / pollutant.max) * 300))} transition-all duration-500`}
                style={{ width: `${Math.min((pollutant.value / pollutant.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Last Updated */}
      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Updated {lastUpdated}</span>
      </div>
    </div>
  );
}
