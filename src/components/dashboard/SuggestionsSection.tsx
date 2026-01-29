import { Shield, Baby, Heart, Wind, Droplets, Home, Shirt, PersonStanding } from "lucide-react";

interface Suggestion {
  icon: React.ReactNode;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

interface VulnerableGroup {
  icon: React.ReactNode;
  label: string;
}

interface SuggestionsSectionProps {
  aqi: number;
  suggestions: Suggestion[];
  vulnerableGroups: VulnerableGroup[];
}

function getBackgroundGradient(aqi: number): string {
  if (aqi <= 50) return "from-aqi-good/5 via-background to-aqi-good/10";
  if (aqi <= 100) return "from-aqi-moderate/5 via-background to-aqi-moderate/10";
  if (aqi <= 200) return "from-aqi-poor/5 via-background to-aqi-poor/10";
  return "from-aqi-severe/5 via-background to-aqi-severe/10";
}

export function SuggestionsSection({ aqi, suggestions, vulnerableGroups }: SuggestionsSectionProps) {
  return (
    <section className={`py-8 px-4 md:px-6 bg-gradient-to-r ${getBackgroundGradient(aqi)}`}>
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Suggestions Card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">What You Should Do</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Personalized recommendations based on current air quality</p>
            
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                    suggestion.priority === 'high' 
                      ? 'bg-aqi-severe/10 border border-aqi-severe/20' 
                      : suggestion.priority === 'medium'
                      ? 'bg-aqi-moderate/10 border border-aqi-moderate/20'
                      : 'bg-secondary/50 border border-border/50'
                  }`}
                >
                  <div className={`mt-0.5 ${
                    suggestion.priority === 'high' ? 'text-aqi-severe' : 
                    suggestion.priority === 'medium' ? 'text-aqi-moderate' : 'text-primary'
                  }`}>
                    {suggestion.icon}
                  </div>
                  <span className="text-sm font-medium">{suggestion.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerable Groups Card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-aqi-severe" />
              <h3 className="font-semibold text-lg">Who Should Be Careful</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">People at higher risk from current pollution levels</p>
            
            <div className="grid grid-cols-2 gap-4">
              {vulnerableGroups.map((group, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border/50 hover:bg-secondary/70 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-aqi-severe/10 flex items-center justify-center text-aqi-severe">
                    {group.icon}
                  </div>
                  <span className="font-medium text-sm">{group.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Default suggestions based on AQI
export function getDefaultSuggestions(aqi: number): Suggestion[] {
  if (aqi <= 50) {
    return [
      { icon: <Wind className="w-5 h-5" />, text: "Great day for outdoor activities!", priority: 'low' },
      { icon: <PersonStanding className="w-5 h-5" />, text: "Perfect conditions for morning exercise", priority: 'low' },
    ];
  }
  if (aqi <= 100) {
    return [
      { icon: <Wind className="w-5 h-5" />, text: "Sensitive individuals should limit prolonged outdoor exertion", priority: 'medium' },
      { icon: <Droplets className="w-5 h-5" />, text: "Stay hydrated throughout the day", priority: 'low' },
    ];
  }
  if (aqi <= 200) {
    return [
      { icon: <Shirt className="w-5 h-5" />, text: "Wear a mask outdoors if possible", priority: 'high' },
      { icon: <PersonStanding className="w-5 h-5" />, text: "Avoid morning walks and outdoor exercise", priority: 'high' },
      { icon: <Home className="w-5 h-5" />, text: "Keep windows closed during peak hours", priority: 'medium' },
      { icon: <Droplets className="w-5 h-5" />, text: "Stay hydrated and use air purifiers indoors", priority: 'medium' },
    ];
  }
  return [
    { icon: <Shirt className="w-5 h-5" />, text: "Wear N95 mask when going outdoors", priority: 'high' },
    { icon: <Home className="w-5 h-5" />, text: "Stay indoors and keep all windows closed", priority: 'high' },
    { icon: <Wind className="w-5 h-5" />, text: "Use air purifiers on high setting", priority: 'high' },
    { icon: <PersonStanding className="w-5 h-5" />, text: "Avoid all outdoor physical activities", priority: 'high' },
    { icon: <Droplets className="w-5 h-5" />, text: "Stay hydrated and monitor for symptoms", priority: 'medium' },
  ];
}

export function getDefaultVulnerableGroups(): VulnerableGroup[] {
  return [
    { icon: <Baby className="w-5 h-5" />, label: "Children" },
    { icon: <Heart className="w-5 h-5" />, label: "Elderly" },
    { icon: <Wind className="w-5 h-5" />, label: "Asthma Patients" },
    { icon: <PersonStanding className="w-5 h-5" />, label: "Outdoor Workers" },
  ];
}
