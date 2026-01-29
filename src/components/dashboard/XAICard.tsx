import { Brain, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FactorContribution {
  factor: string;
  percentage: number;
  color: string;
}

interface XAICardProps {
  factors: FactorContribution[];
  explanation: string;
}

export function XAICard({ factors, explanation }: XAICardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">What's Causing This?</h3>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">AI-powered analysis of pollution contributors</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Feature contribution to current AQI levels</p>

      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.factor} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{factor.factor}</span>
              <span className="text-sm font-bold" style={{ color: factor.color }}>{factor.percentage}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${factor.percentage}%`,
                  backgroundColor: factor.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-secondary/50 rounded-xl border border-border/50">
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-medium">💡 Insight:</span> {explanation}
        </p>
      </div>
    </div>
  );
}
