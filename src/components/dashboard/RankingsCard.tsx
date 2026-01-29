import { TrendingUp, MapPin } from "lucide-react";

interface CityRanking {
  rank: number;
  city: string;
  aqi: number;
  trend: 'up' | 'down' | 'stable';
}

interface RankingsCardProps {
  rankings: CityRanking[];
  onCityClick?: (city: string) => void;
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

export function RankingsCard({ rankings, onCityClick }: RankingsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-aqi-severe" />
        <h3 className="font-semibold text-lg">Top Polluted Cities</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Real-time AQI rankings across India</p>
      
      <div className="space-y-2">
        {rankings.map((item) => (
          <button
            key={item.city}
            onClick={() => onCityClick?.(item.city)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group text-left"
          >
            <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
              {item.rank}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium truncate">{item.city}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${getAQIColor(item.aqi)}`} />
              <span className={`font-bold ${getAQITextColor(item.aqi)}`}>{item.aqi}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
