import { X, AlertTriangle, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Alert {
  id: string;
  type: 'pollution' | 'heatwave';
  title: string;
  message: string;
  severity: 'warning' | 'critical';
}

interface AlertOverlayProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function AlertOverlay({ alerts, onDismiss }: AlertOverlayProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<string[]>([]);

  useEffect(() => {
    const newAlertIds = alerts.map(a => a.id);
    setVisibleAlerts(newAlertIds);
  }, [alerts]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {alerts
        .filter(alert => visibleAlerts.includes(alert.id))
        .map((alert, index) => (
          <div
            key={alert.id}
            className={`
              slide-in-right glass-card rounded-xl p-4 border-l-4
              ${alert.severity === 'critical' 
                ? 'border-l-aqi-severe bg-aqi-severe/5' 
                : 'border-l-aqi-moderate bg-aqi-moderate/5'
              }
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${alert.severity === 'critical' 
                  ? 'bg-aqi-severe/20 text-aqi-severe' 
                  : 'bg-aqi-moderate/20 text-aqi-moderate'
                }
              `}>
                {alert.type === 'pollution' 
                  ? <AlertTriangle className="w-5 h-5" />
                  : <Thermometer className="w-5 h-5" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`font-semibold text-sm ${
                    alert.severity === 'critical' ? 'text-aqi-severe' : 'text-aqi-moderate'
                  }`}>
                    {alert.title}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1 -mr-1 hover:bg-secondary"
                    onClick={() => {
                      setVisibleAlerts(prev => prev.filter(id => id !== alert.id));
                      onDismiss(alert.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
