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
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.6)" }}
            stroke="rgba(255,255,255,0.3)"
            label={{ value: "Time (hrs)", position: "insideBottom", offset: -15, style: { fontSize: 12, fill: "rgba(255,255,255,0.7)" } }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.6)" }}
            stroke="rgba(255,255,255,0.3)"
            width={45}
            label={{ value: unit, angle: -90, position: "insideLeft", offset: 5, style: { fontSize: 12, fill: "rgba(255,255,255,0.7)" } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.85)",
              border: `1px solid ${color}`,
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, "Prediction"]}
            labelFormatter={(label) => `Time: ${label}`}
            labelStyle={{ color: "rgba(255,255,255,0.8)", marginBottom: 4 }}
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
