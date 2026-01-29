import { Globe, BarChart3, AlertTriangle, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavBarProps {
  location: string;
  onLocationChange: (location: string) => void;
}

const cities = [
  "New Delhi, India",
  "Mumbai, India",
  "Bangalore, India",
  "Chennai, India",
  "Kolkata, India",
  "Hyderabad, India",
];

export function NavBar({ location, onLocationChange }: NavBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav">
      <div className="h-full max-w-[1800px] mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-aqi-good flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl tracking-tight">
            Air<span className="text-primary">Guard</span> AI
          </span>
        </div>

        {/* Center - Location */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden md:flex items-center gap-2 text-foreground hover:bg-secondary">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{location}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            {cities.map((city) => (
              <DropdownMenuItem
                key={city}
                onClick={() => onLocationChange(city)}
                className="cursor-pointer"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {city}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right - Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hover:bg-secondary" title="Global View">
            <Globe className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary" title="Rankings">
            <BarChart3 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary relative" title="Alerts">
            <AlertTriangle className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-aqi-severe rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}
