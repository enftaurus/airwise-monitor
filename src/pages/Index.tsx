import { useState } from "react";
import { NavBar } from "@/components/dashboard/NavBar";
import { MapSection } from "@/components/dashboard/MapSection";
import { AQICard } from "@/components/dashboard/AQICard";
import { RankingsCard } from "@/components/dashboard/RankingsCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { XAICard } from "@/components/dashboard/XAICard";
import { SuggestionsSection, getDefaultSuggestions, getDefaultVulnerableGroups } from "@/components/dashboard/SuggestionsSection";
import { AlertOverlay } from "@/components/dashboard/AlertOverlay";

// Mock data
const mockAQI = 187;
const mockCategory = "Poor";

const mockPollutants = [
  { name: "PM2.5", value: 98, max: 150, unit: "µg/m³" },
  { name: "PM10", value: 145, max: 250, unit: "µg/m³" },
  { name: "NO₂", value: 42, max: 100, unit: "ppb" },
  { name: "CO", value: 1.2, max: 4, unit: "ppm" },
];

const mockRankings = [
  { rank: 1, city: "Delhi", aqi: 312, trend: 'up' as const },
  { rank: 2, city: "Ghaziabad", aqi: 287, trend: 'stable' as const },
  { rank: 3, city: "Noida", aqi: 265, trend: 'up' as const },
  { rank: 4, city: "Gurugram", aqi: 234, trend: 'down' as const },
  { rank: 5, city: "Faridabad", aqi: 221, trend: 'stable' as const },
  { rank: 6, city: "Lucknow", aqi: 198, trend: 'up' as const },
];

const mockTrendData = [
  { time: "12AM", aqi: 145 },
  { time: "3AM", aqi: 132 },
  { time: "6AM", aqi: 156 },
  { time: "9AM", aqi: 189 },
  { time: "12PM", aqi: 178 },
  { time: "3PM", aqi: 165 },
  { time: "6PM", aqi: 187 },
  { time: "9PM", aqi: 195, predicted: 195 },
  { time: "12AM", aqi: undefined, predicted: 210 },
  { time: "3AM", aqi: undefined, predicted: 198 },
];

const mockFactors = [
  { factor: "PM2.5", percentage: 55, color: "hsl(var(--aqi-severe))" },
  { factor: "Vehicle Emissions", percentage: 22, color: "hsl(var(--aqi-poor))" },
  { factor: "Industrial Activity", percentage: 13, color: "hsl(var(--aqi-moderate))" },
  { factor: "Weather Conditions", percentage: 10, color: "hsl(var(--primary))" },
];

const mockAlerts = [
  {
    id: "1",
    type: "pollution" as const,
    title: "Severe Air Pollution",
    message: "Avoid outdoor activities for the next 24 hours.",
    severity: "critical" as const,
  },
];

export default function Index() {
  const [location, setLocation] = useState("New Delhi, India");
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar location={location} onLocationChange={setLocation} />

      {/* Hero Section - Map + AQI */}
      <section className="pt-16">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-6 min-h-[500px]">
            <MapSection location={location} aqi={mockAQI} />
            <div className="lg:sticky lg:top-24 h-fit">
              <AQICard
                aqi={mockAQI}
                category={mockCategory}
                pollutants={mockPollutants}
                lastUpdated="5 mins ago"
                isWarning={mockAQI > 150}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Data & Insights Section */}
      <section className="py-8 px-4 md:px-6">
        <div className="max-w-[1800px] mx-auto">
          <h2 className="text-2xl font-bold mb-6">Data & Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RankingsCard
              rankings={mockRankings}
              onCityClick={(city) => setLocation(`${city}, India`)}
            />
            <TrendChart data={mockTrendData} />
            <XAICard
              factors={mockFactors}
              explanation="PM2.5 is the dominant factor driving today's pollution levels, primarily due to increased vehicle emissions during morning rush hours and reduced wind speeds limiting pollutant dispersion."
            />
          </div>
        </div>
      </section>

      {/* Suggestions & Health Advisory */}
      <SuggestionsSection
        aqi={mockAQI}
        suggestions={getDefaultSuggestions(mockAQI)}
        vulnerableGroups={getDefaultVulnerableGroups()}
      />

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t border-border">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-aqi-good flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <span className="font-semibold">AirGuard AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered air quality monitoring for a healthier tomorrow
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">API</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Alert Overlays */}
      <AlertOverlay alerts={alerts} onDismiss={handleDismissAlert} />
    </div>
  );
}
