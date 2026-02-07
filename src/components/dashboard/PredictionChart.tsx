import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface PredictionData {
  time: string;
  value: number;
}

interface PredictionChartProps {
  title: string;
  data: PredictionData[];
  color: string;
  unit: string;
  lineStrokeWidth?: number;
}

export function PredictionChart({
  title,
  data,
  color,
  unit,
  lineStrokeWidth = 2,
}: PredictionChartProps) {
  return (
    <div className="glass-card rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            stroke="rgba(255,255,255,0.5)"
            label={{ value: "Time (hrs)", position: "insideBottom", offset: -2, style: { fontSize: 11, fill: "rgba(255,255,255,0.6)" } }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            stroke="rgba(255,255,255,0.5)"
            label={{ value: unit, angle: -90, position: "insideLeft", offset: 15, style: { fontSize: 11, fill: "rgba(255,255,255,0.6)" } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: `1px solid ${color}`,
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, "Prediction"]}
            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            dot={false}
            strokeWidth={lineStrokeWidth}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
