import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TrendDataPoint {
  time: string;
  aqi: number;
  predicted?: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
}

const timeRanges = ["24h", "7d", "30d"] as const;

export function TrendChart({ data }: TrendChartProps) {
  const [activeRange, setActiveRange] = useState<typeof timeRanges[number]>("24h");

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Air Quality Trend</h3>
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={activeRange === range ? "default" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setActiveRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[220px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-elevated)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <ReferenceLine y={100} stroke="hsl(var(--aqi-moderate))" strokeDasharray="5 5" />
            <ReferenceLine y={200} stroke="hsl(var(--aqi-poor))" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="hsl(var(--aqi-poor))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--aqi-poor))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary rounded" />
          <span className="text-xs text-muted-foreground">Actual AQI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-aqi-poor rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--aqi-poor)) 0, hsl(var(--aqi-poor)) 4px, transparent 4px, transparent 8px)' }} />
          <span className="text-xs text-muted-foreground">Predicted</span>
        </div>
      </div>
    </div>
  );
}
